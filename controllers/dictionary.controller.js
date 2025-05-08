const mongoose = require("mongoose");
const Dictionary = require("../schemas/Dictionary");
const { dictionaryValidation } = require("../validation/dictionary.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

const addDictionary = async (req, res) => {
  try {
    const { error, value } = dictionaryValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const newItem = await Dictionary.create(value);
    res.status(201).send({ message: "Yangi so'z qo'shildi", newItem });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllDictionaries = async (req, res) => {
  try {
    const items = await Dictionary.find();
    res.status(200).send({ items });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getDictionaryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const item = await Dictionary.findById(id);
    if (!item) {
      return res.status(404).send({ message: "So'z topilmadi" });
    }

    res.status(200).send({ item });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateDictionaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = dictionaryValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const item = await Dictionary.updateOne({ _id: id }, value);
    if (item.matchedCount === 0) {
      return res.status(404).send({ message: "So'z topilmadi" });
    }

    res.status(200).send({ message: "So'z yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteDictionaryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const item = await Dictionary.deleteOne({ _id: id });
    if (item.deletedCount === 0) {
      return res.status(404).send({ message: "So'z topilmadi" });
    }

    res.status(200).send({ message: "So'z o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addDictionary,
  getAllDictionaries,
  getDictionaryById,
  updateDictionaryById,
  deleteDictionaryById,
};
