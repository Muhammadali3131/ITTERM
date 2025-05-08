const Joi = require("joi");

const descriptionValidation = Joi.object({
  category_id: Joi.string(),
  description: Joi.string().trim(),
});

module.exports = descriptionValidation;
