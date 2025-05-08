const mongoose = require("mongoose");
const Description = require("../schemas/Description");
const {
  descriptionValidation,
} = require("../validation/description.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

const addDescription = async (req, res) => {
  try {
    const { error, value } = descriptionValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const newDescription = await Description.create(value);
    res
      .status(201)
      .send({ message: "Yangi description qo'shildi", newDescription });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllDescriptions = async (req, res) => {
  try {
    const descriptions = await Description.find();
    res.status(200).send({ descriptions });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getDescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const description = await Description.findById(id);
    if (!description) {
      return res.status(404).send({ message: "Description topilmadi" });
    }
    res.status(200).send({ description });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateDescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = descriptionValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const description = await Description.updateOne({ _id: id }, value);
    if (description.matchedCount == 0) {
      return res.status(404).send({ message: "Description topilmadi" });
    }
    res.status(200).send({ message: "Description yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteDescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const description = await Description.deleteOne({ _id: id });
    if (description.deletedCount == 0) {
      return res.status(404).send({ message: "Description topilmadi" });
    }
    res.status(200).send({ message: "Description o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addDescription,
  getAllDescriptions,
  getDescriptionById,
  updateDescriptionById,
  deleteDescriptionById,
};
