const Joi = require("joi");

const synonymValidation = Joi.object({
  desc_id: Joi.string().required(),
  dict_id: Joi.string().required(),
});

module.exports = synonymValidation;
