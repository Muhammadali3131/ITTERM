const mongoose = require("mongoose");
const DescQA = require("../schemas/Desc_QA");
const { descQAValidation } = require("../validation/desc_qa.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

const addDescQA = async (req, res) => {
  try {
    const { error, value } = descQAValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const newDescQA = await DescQA.create(value);
    res.status(201).send({ message: "Yangi DescQA qo'shildi", newDescQA });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllDescQAs = async (req, res) => {
  try {
    const descQAs = await DescQA.find().populate("qa_id desc_id");
    res.status(200).send({ descQAs });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getDescQAById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const descQA = await DescQA.findById(id).populate("qa_id desc_id");
    if (!descQA) {
      return res.status(404).send({ message: "DescQA topilmadi" });
    }

    res.status(200).send({ descQA });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateDescQAById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = descQAValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const result = await DescQA.updateOne({ _id: id }, value);
    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "DescQA topilmadi" });
    }

    res.status(200).send({ message: "DescQA yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteDescQAById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const result = await DescQA.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "DescQA topilmadi" });
    }

    res.status(200).send({ message: "DescQA o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addDescQA,
  getAllDescQAs,
  getDescQAById,
  updateDescQAById,
  deleteDescQAById,
};
