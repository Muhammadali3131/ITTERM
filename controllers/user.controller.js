const mongoose = require("mongoose");
const User = require("../schemas/User");
const { userValidation } = require("../validation/user.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

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

    const token = jwt.sign(payload, config.get("tokenKey"), {
      expiresIn: config.get("tokenExpTime"),
    });

    res.status(200).send({ message: "Xush kelibsiz", token });
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
};
