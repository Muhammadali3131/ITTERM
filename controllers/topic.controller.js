const mongoose = require("mongoose");
const Topic = require("../schemas/Topic");
const { topicValidation } = require("../validation/topic.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

const addTopic = async (req, res) => {
  try {
    const { error, value } = topicValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const newTopic = await Topic.create(value);
    res.status(201).send({ message: "Yangi topic qo'shildi", newTopic });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.status(200).send({ topics });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).send({ message: "Topic topilmadi" });
    }
    res.status(200).send({ topic });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = topicValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const topic = await Topic.updateOne({ _id: id }, value);
    if (topic.matchedCount == 0) {
      return res.status(404).send({ message: "Topic topilmadi" });
    }
    res.status(200).send({ message: "Topic yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const topic = await Topic.deleteOne({ _id: id });
    if (topic.deletedCount == 0) {
      return res.status(404).send({ message: "Topic topilmadi" });
    }
    res.status(200).send({ message: "Topic o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addTopic,
  getAllTopics,
  getTopicById,
  updateTopicById,
  deleteTopicById,
};
