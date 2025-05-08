const mongoose = require("mongoose");
const Social = require("../schemas/Social");
const { socialValidation } = require("../validation/social.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

const addSocial = async (req, res) => {
  try {
    const { error, value } = socialValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const newSocial = await Social.create(value);
    res.status(201).send({ message: "Yangi social qo'shildi", newSocial });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllSocials = async (req, res) => {
  try {
    const socials = await Social.find();
    res.status(200).send({ socials });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const social = await Social.findById(id);
    if (!social) {
      return res.status(404).send({ message: "Social topilmadi" });
    }
    res.status(200).send({ social });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = socialValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const social = await Social.updateOne({ _id: id }, value);
    if (social.matchedCount == 0) {
      return res.status(404).send({ message: "Social topilmadi" });
    }
    res.status(200).send({ message: "Social yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const social = await Social.deleteOne({ _id: id });
    if (social.deletedCount == 0) {
      return res.status(404).send({ message: "Social topilmadi" });
    }
    res.status(200).send({ message: "Social o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addSocial,
  getAllSocials,
  getSocialById,
  updateSocialById,
  deleteSocialById,
};
