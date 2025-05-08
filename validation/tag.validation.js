const Joi = require("joi");

const tagValidation = Joi.object({
  topic_id: Joi.string().required(),
  category_id: Joi.string().required(),
});

module.exports = tagValidation;
