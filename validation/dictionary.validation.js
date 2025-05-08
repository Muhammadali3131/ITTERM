const Joi = require("joi");

const dictionaryValidation = (data) => {
  const schema = Joi.object({
    term: Joi.string().trim().min(1).required(),
    letter: Joi.string().trim().uppercase().required(),
  });

  return schema.validate(data);
};

module.exports = { dictionaryValidation };
