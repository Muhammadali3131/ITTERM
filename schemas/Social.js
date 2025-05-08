const { Schema, model } = require("mongoose");

const socialSchema = new Schema(
  {
    social_name: { type: String, required: true, trim: true },
    social_icon_file: { type: String, trim: true },
  },
  { versionKey: false, timestamps: false }
);

module.exports = model("Social", socialSchema);
