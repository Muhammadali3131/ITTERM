const mongoose = require("mongoose");
const Synonym = require("../schemas/Synonym");
const { synonymValidation } = require("../validation/synonym.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

const addSynonym = async (req, res) => {
  try {
    const { error, value } = synonymValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const newSynonym = await Synonym.create(value);
    res.status(201).send({ message: "Yangi synonym qo'shildi", newSynonym });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllSynonyms = async (req, res) => {
  try {
    const synonyms = await Synonym.find();
    res.status(200).send({ synonyms });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getSynonymById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const synonym = await Synonym.findById(id);
    if (!synonym) {
      return res.status(404).send({ message: "Synonym topilmadi" });
    }
    res.status(200).send({ synonym });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateSynonymById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = synonymValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const synonym = await Synonym.updateOne({ _id: id }, value);
    if (synonym.matchedCount == 0) {
      return res.status(404).send({ message: "Synonym topilmadi" });
    }
    res.status(200).send({ message: "Synonym yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteSynonymById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const synonym = await Synonym.deleteOne({ _id: id });
    if (synonym.deletedCount == 0) {
      return res.status(404).send({ message: "Synonym topilmadi" });
    }
    res.status(200).send({ message: "Synonym o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addSynonym,
  getAllSynonyms,
  getSynonymById,
  updateSynonymById,
  deleteSynonymById,
};
