const Joi = require("joi");

const topicValidation = (body) => {
  const schema = Joi.object({
    author_id: Joi.string().required(),
    topic_title: Joi.string(),
    topic_text: Joi.string(),
    created_date: Joi.date(),
    updated_date: Joi.date(),
    is_checked: Joi.boolean(),
    is_approved: Joi.boolean(),
    expert_id: Joi.string(),
  });
  return schema.validate(body);
};

module.exports = { topicValidation };
