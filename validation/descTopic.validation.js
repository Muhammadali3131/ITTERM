const Joi = require("joi");

const descTopicValidation = Joi.object({
  desc_id: Joi.string(),
  topic_id: Joi.string(),
});

module.exports = descTopicValidation;
