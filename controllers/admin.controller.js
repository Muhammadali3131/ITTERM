const mongoose = require("mongoose");
const Admin = require("../schemas/Admin");
const { adminValidation } = require("../validation/admin.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtAdminService = require("../services/jwt.admin.service");

const addAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const hashedPassword = bcrypt.hashSync(value.admin_password, 7);

    const newAdmin = await Admin.create({
      ...value,
      admin_password: hashedPassword,
    });

    res.status(201).send({ message: "Yangi admin qo'shildi", newAdmin });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).send({ admins });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).send({ message: "Admin topilmadi" });
    }

    res.status(200).send({ admin });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = adminValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const admin = await Admin.updateOne({ _id: id }, value);
    if (admin.matchedCount == 0) {
      return res.status(404).send({ message: "Admin topilmadi" });
    }

    res.status(200).send({ message: "Admin yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const admin = await Admin.deleteOne({ _id: id });
    if (admin.deletedCount == 0) {
      return res.status(404).send({ message: "Admin topilmadi" });
    }

    res.status(200).send({ message: "Admin o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { admin_email, admin_password } = req.body;

    const admin = await Admin.findOne({ admin_email });
    if (!admin) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }

    const validPassword = bcrypt.compareSync(
      admin_password,
      admin.admin_password
    );
    if (!validPassword) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }

    const payload = {
      id: admin._id,
      email: admin.admin_email,
      is_active: admin.admin_is_active,
      is_creator: admin.admin_is_creator,
    };

    const token = jwt.sign(payload, config.get("tokenKeyAdmin"), {
      expiresIn: config.get("tokenExpTime"),
    });

    res
      .status(200)
      .send({ message: "Tizimga xush kelibsiz", token, id: admin._id });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }
    const admin = await Admin.findOneAndUpdate(
      { refresh_token: refreshToken },
      {
        refresh_token: "",
      },
      {
        new: true,
      }
    );
    if (!admin) {
      return res.status(400).send({ message: "Token noto'g'ri" });
    }

    res.clearCookie("refreshToken");
    res.send({ admin });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const refreshAdminToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }

    await jwtAdminService.verifyRefreshToken(refreshToken);
    const admin = await Admin.findOne({ refresh_token: refreshToken });
    if (!admin) {
      return res
        .status(401)
        .send({ message: "Bazada refresh token topilmadi" });
    }
    const payload = {
      id: admin._id,
      email: admin.email,
      is_active: admin.is_active,
      is_expert: admin.is_expert,
    };
    const tokens = jwtAdminService.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time"),
    });

    res.status(201).send({
      message: "Tokenlar yangilandi",
      id: admin.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken
};
