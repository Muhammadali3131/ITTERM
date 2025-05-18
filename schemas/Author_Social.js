const { Schema, model } = require("mongoose");

const authorSocialSchema = new Schema({
  author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  social_id: { type: Schema.Types.ObjectId, ref: "Social", required: true },
  social_link: { type: String, required: true },
});

module.exports = model("AuthorSocial", authorSocialSchema);
