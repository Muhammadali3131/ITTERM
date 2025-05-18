const Joi = require("joi");

const authorSocialValidation = (data) => {
  const schema = Joi.object({
    author_id: Joi.string().required(),
    social_id: Joi.string().required(),
    social_link: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { authorSocialValidation };
