const Joi = require("joi");

const userValidation = (data) => {
  const schema = Joi.object({
    user_name: Joi.string().min(3).max(100).required(),
    user_email: Joi.string().email().required(),
    user_password: Joi.string().min(6).required(),
    user_info: Joi.string(),
    user_photo: Joi.string(),
    user_is_active: Joi.boolean().default(true),
  });

  return schema.validate(data);
};

module.exports = { userValidation };
