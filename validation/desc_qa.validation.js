const descQAValidation = (data) => {
  const schema = Joi.object({
    qa_id: Joi.string().required(),
    desc_id: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { descQAValidation };
