const mongoose = require("mongoose");
const Author = require("../schemas/Author");
const { authorValidation } = require("../validation/author.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtService = require("../services/jwt.service");
const uuid = require("uuid");
const mailService = require("../services/mail.service");

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const hashedPassword = bcrypt.hashSync(value.password, 7);

    const activation_link = uuid.v4();

    const newAuthor = await Author.create({
      ...value,
      password: hashedPassword,
      activation_link,
    });
    const link = `${config.get(
      "api_url"
    )}/api/author/activate/${activation_link}`;
    await mailService.sendMail(value.email, link);

    res.status(201).send({ message: "Yangi author qo'shildi", newAuthor });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).send({ authors });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).send({ message: "Author topilmadi" });
    }
    res.status(200).send({ author });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = authorValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const author = await Author.updateOne({ _id: id }, value);
    if (author.matchedCount == 0) {
      return res.status(404).send({ message: "Author topilmadi" });
    }
    res.status(200).send({ message: "Author yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const author = await Author.deleteOne({ _id: id });
    if (author.deletedCount == 0) {
      return res.status(404).send({ message: "Author topilmadi" });
    }
    res.status(200).send({ message: "Author o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(401).send({ message: "Email yoki password noto'g'ri" });
    }
    const validPassword = bcrypt.compareSync(password, author.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Email yoki password noto'g'ri" });
    }

    const payload = {
      id: author._id,
      email: author.email,
      is_active: author.is_active,
      is_expert: author.is_expert,
    };

    // const token = jwt.sign(payload, config.get("tokenKey"), {
    //   expiresIn: config.get("tokenExpTime"),
    // });

    const tokens = jwtService.generateTokens(payload);
    author.refresh_token = tokens.refreshToken;
    await author.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time"),
    });

    //------------------------ TEST UCHUN ERROR ---------------------------------------
    // try {
    //   setTimeout(function () {
    //     throw new Error("UncaughtException example");
    //   }, 1000);
    // } catch (error) {
    //   console.log(error);
    // }

    // new Promise((_, reject) => {
    //   reject(new Error("UnHandledRejection example"));
    // });
    //------------------------ TEST UCHUN ERROR ---------------------------------------

    res.status(201).send({
      message: "Tizimga xush kelibsiz",
      id: author.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const logoutAuthor = async (req, res) => {
  try {
    console.log(req.cookies);
    console.log(req.headers.cookie);
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }
    const author = await Author.findOneAndUpdate(
      { refresh_token: refreshToken },
      {
        refresh_token: "",
      },
      {
        new: true,
      }
    );
    if (!author) {
      return res.status(400).send({ message: "Token noto'g'ri" });
    }

    res.clearCookie("refreshToken");
    res.send({ author });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const refreshAuthorToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }

    await jwtService.verifyRefreshToken(refreshToken);
    const author = await Author.findOne({ refresh_token: refreshToken });
    if (!author) {
      return res
        .status(401)
        .send({ message: "Bazada refresh token topilmadi" });
    }
    const payload = {
      id: author._id,
      email: author.email,
      is_active: author.is_active,
      is_expert: author.is_expert,
    };
    const tokens = jwtService.generateTokens(payload);
    author.refresh_token = tokens.refreshToken;
    await author.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time"),
    });

    res.status(201).send({
      message: "Tokenlar yangilandi",
      id: author.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const authorActivate = async (req, res) => {
  try {
    const { link } = req.params;
    const author = await Author.findOne({ activation_link: link });

    if (!author) {
      return res.status(400).send({ message: "Author link noto'g'ri" });
    }

    if (author.is_active) {
      return res.status(400).send({ message: "Author avval faollashtirilgan" });
    }

    author.is_active = true;
    await author.save();
    res.send({ message: "Author faollashtirildi", isActive: author.is_active });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  authorActivate,
};
