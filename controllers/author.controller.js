const mongoose = require("mongoose");
const Author = require("../schemas/Author");
const { authorValidation } = require("../validation/author.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const hashedPassword = bcrypt.hashSync(value.password, 7);

    const newAuthor = await Author.create({
      ...value,
      password: hashedPassword,
    });

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

    const token = jwt.sign(payload, config.get("tokenKey"), {
      expiresIn: config.get("tokenExpTime"),
    });

    res
      .status(201)
      .send({ message: "Tizimga xush kelibsiz", id: author.id, token });
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
};
