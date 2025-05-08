const mongoose = require("mongoose");
const Tag = require("../schemas/Tag");
const { tagValidation } = require("../validation/tag.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

const addTag = async (req, res) => {
  try {
    const { error, value } = tagValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const newTag = await Tag.create(value);
    res.status(201).send({ message: "Yangi tag qo'shildi", newTag });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).send({ tags });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).send({ message: "Tag topilmadi" });
    }
    res.status(200).send({ tag });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = tagValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const tag = await Tag.updateOne({ _id: id }, value);
    if (tag.matchedCount === 0) {
      return res.status(404).send({ message: "Tag topilmadi" });
    }
    res.status(200).send({ message: "Tag yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteTagById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const tag = await Tag.deleteOne({ _id: id });
    if (tag.deletedCount === 0) {
      return res.status(404).send({ message: "Tag topilmadi" });
    }
    res.status(200).send({ message: "Tag o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addTag,
  getAllTags,
  getTagById,
  updateTagById,
  deleteTagById,
};
