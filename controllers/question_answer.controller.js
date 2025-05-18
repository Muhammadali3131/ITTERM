const mongoose = require("mongoose");
const QuestionAnswer = require("../schemas/QuestionAnswer");
const {
  questionAnswerValidation,
} = require("../validation/question.answer.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

const addQuestionAnswer = async (req, res) => {
  try {
    const { error, value } = questionAnswerValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const newQA = await QuestionAnswer.create(value);
    res.status(201).send({ message: "Savol-javob qo'shildi", newQA });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllQuestionAnswers = async (req, res) => {
  try {
    const allQAs = await QuestionAnswer.find().populate("user_id expert_id");
    res.status(200).send({ allQAs });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getQuestionAnswerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const qa = await QuestionAnswer.findById(id).populate("user_id expert_id");
    if (!qa) {
      return res.status(404).send({ message: "Savol-javob topilmadi" });
    }

    res.status(200).send({ qa });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateQuestionAnswerById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = questionAnswerValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const result = await QuestionAnswer.updateOne({ _id: id }, value);
    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Savol-javob topilmadi" });
    }

    res.status(200).send({ message: "Savol-javob yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteQuestionAnswerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const result = await QuestionAnswer.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Savol-javob topilmadi" });
    }

    res.status(200).send({ message: "Savol-javob o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addQuestionAnswer,
  getAllQuestionAnswers,
  getQuestionAnswerById,
  updateQuestionAnswerById,
  deleteQuestionAnswerById,
};
