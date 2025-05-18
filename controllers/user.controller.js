const mongoose = require("mongoose");
const User = require("../schemas/User");
const { userValidation } = require("../validation/user.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtUserService = require("../services/jwt.user.service");

const addUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const hashedPassword = bcrypt.hashSync(value.user_password, 7);

    const newUser = await User.create({
      ...value,
      user_password: hashedPassword,
    });

    res.status(201).send({ message: "Yangi user qo'shildi", newUser });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({ users });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User topilmadi" });
    }
    res.status(200).send({ user });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = userValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const updated = await User.updateOne({ _id: id }, value);
    if (updated.matchedCount === 0) {
      return res.status(404).send({ message: "User topilmadi" });
    }
    res.status(200).send({ message: "User yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const deleted = await User.deleteOne({ _id: id });
    if (deleted.deletedCount === 0) {
      return res.status(404).send({ message: "User topilmadi" });
    }
    res.status(200).send({ message: "User o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;
    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(401).send({ message: "Email yoki password noto'g'ri" });
    }

    const isMatch = bcrypt.compareSync(user_password, user.user_password);
    if (!isMatch) {
      return res.status(401).send({ message: "Email yoki password noto'g'ri" });
    }

    const payload = {
      id: user._id,
      email: user.user_email,
      is_active: user.user_is_active,
    };

    const token = jwt.sign(payload, config.get("tokenKeyUser"), {
      expiresIn: config.get("tokenExpTime"),
    });

    res.status(200).send({ message: "Xush kelibsiz", token });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }
    const user = await User.findOneAndUpdate(
      { refresh_token: refreshToken },
      {
        refresh_token: "",
      },
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(400).send({ message: "Token noto'g'ri" });
    }

    res.clearCookie("refreshToken");
    res.send({ user });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const refreshUserToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }

    await jwtUserService.verifyRefreshToken(refreshToken);
    const user = await User.findOne({ refresh_token: refreshToken });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Bazada refresh token topilmadi" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      is_active: user.is_active,
      is_expert: user.is_expert,
    };
    const tokens = jwtUserService.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time"),
    });

    res.status(201).send({
      message: "Tokenlar yangilandi",
      id: user.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const userActivate = async (req, res) => {
  try {
    const { link } = req.params;
    const user = await User.findOne({ activation_link: link });

    if (!user) {
      return res.status(400).send({ message: "User link noto'g'ri" });
    }

    if (user.is_active) {
      return res.status(400).send({ message: "User avval faollashtirilgan" });
    }

    user.is_active = true;
    await user.save();
    res.send({ message: "User faollashtirildi", isActive: user.is_active });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  loginUser,
  logoutUser,
  refreshUserToken,
  userActivate,
};
