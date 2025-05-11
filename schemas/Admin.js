const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  admin_name: {
    type: String,
    required: true,
    trim: true,
  },
  admin_email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  admin_phone: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\+998\d{9}$/,
      "Telefon raqami +998 bilan boshlanishi va 13 ta belgidan iborat bo'lishi kerak",
    ],
  },
  admin_password: {
    type: String,
    required: true,
  },
  admin_is_active: {
    type: Boolean,
    default: true,
  },
  admin_is_creator: {
    type: Boolean,
    default: false,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  updated_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Admin", AdminSchema);
