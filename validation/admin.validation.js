const Joi = require("joi");

const adminValidator = Joi.object({
  admin_name: Joi.string().min(3).max(100).required(),
  admin_email: Joi.string().email().required(),
  admin_phone: Joi.string()
    .pattern(/^\+998\d{9}$/)
    .length(13)
    .required(),
  admin_password: Joi.string().min(6).required(),
  admin_is_active: Joi.boolean(),
  admin_is_creator: Joi.boolean(),
  created_date: Joi.date(),
  updated_date: Joi.date(),
});

module.exports = adminValidator;
