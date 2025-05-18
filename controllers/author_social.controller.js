const mongoose = require("mongoose");
const AuthorSocial = require("../schemas/Author_Social");
const {
  authorSocialValidation,
} = require("../validation/author_social.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

const addAuthorSocial = async (req, res) => {
  try {
    const { error, value } = authorSocialValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const newAuthorSocial = await AuthorSocial.create(value);
    res
      .status(201)
      .send({ message: "Yangi author_social qo'shildi", newAuthorSocial });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllAuthorSocials = async (req, res) => {
  try {
    const authorSocials = await AuthorSocial.find().populate(
      "author_id social_id"
    );
    res.status(200).send({ authorSocials });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAuthorSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const authorSocial = await AuthorSocial.findById(id).populate(
      "author_id social_id"
    );
    if (!authorSocial) {
      return res.status(404).send({ message: "AuthorSocial topilmadi" });
    }

    res.status(200).send({ authorSocial });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateAuthorSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = authorSocialValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const result = await AuthorSocial.updateOne({ _id: id }, value);
    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "AuthorSocial topilmadi" });
    }

    res.status(200).send({ message: "AuthorSocial yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteAuthorSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const result = await AuthorSocial.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "AuthorSocial topilmadi" });
    }

    res.status(200).send({ message: "AuthorSocial o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addAuthorSocial,
  getAllAuthorSocials,
  getAuthorSocialById,
  updateAuthorSocialById,
  deleteAuthorSocialById,
};
