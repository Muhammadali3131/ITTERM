const Joi = require("joi");

const socialValidation = Joi.object({
  social_name: Joi.string().trim().required(),
  social_icon_file: Joi.string(),
});

module.exports = socialValidation;
