const Joi = require("joi");

const categoryValidation = Joi.object({
  name: Joi.string().trim(),
  parent_category_id: Joi.string(),
});

module.exports = categoryValidation;
