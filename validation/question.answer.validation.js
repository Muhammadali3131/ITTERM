const questionAnswerValidation = (data) => {
  const schema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string(),
    created_date: Joi.date(),
    updated_date: Joi.date(),
    is_checked: Joi.boolean().default(false),
    user_id: Joi.string().required(),
    expert_id: Joi.string(),
  });

  return schema.validate(data);
};

module.exports = { questionAnswerValidation };
