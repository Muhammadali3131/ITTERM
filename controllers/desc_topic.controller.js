const mongoose = require("mongoose");
const DescTopic = require("../schemas/Desc_topic");
const { descTopicValidation } = require("../validation/descTopic.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

const addDescTopic = async (req, res) => {
  try {
    const { error, value } = descTopicValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const newDescTopic = await DescTopic.create(value);
    res
      .status(201)
      .send({ message: "Yangi DescTopic qo'shildi", newDescTopic });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllDescTopics = async (req, res) => {
  try {
    const descTopics = await DescTopic.find();
    res.status(200).send({ descTopics });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getDescTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const descTopic = await DescTopic.findById(id);
    if (!descTopic) {
      return res.status(404).send({ message: "DescTopic topilmadi" });
    }
    res.status(200).send({ descTopic });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateDescTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = descTopicValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const descTopic = await DescTopic.updateOne({ _id: id }, value);
    if (descTopic.matchedCount === 0) {
      return res.status(404).send({ message: "DescTopic topilmadi" });
    }
    res.status(200).send({ message: "DescTopic yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteDescTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const descTopic = await DescTopic.deleteOne({ _id: id });
    if (descTopic.deletedCount === 0) {
      return res.status(404).send({ message: "DescTopic topilmadi" });
    }
    res.status(200).send({ message: "DescTopic o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addDescTopic,
  getAllDescTopics,
  getDescTopicById,
  updateDescTopicById,
  deleteDescTopicById,
};
