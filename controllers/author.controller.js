const mongoose = require("mongoose");
const Author = require("../schemas/Author");
const { authorValidation } = require("../validation/author.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const newAuthor = await Author.create(value);
    res.status(201).send({ message: "Yangi author qo'shildi", newAuthor });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).send({ authors });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).send({ message: "Author topilmadi" });
    }
    res.status(200).send({ author });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = authorValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const author = await Author.updateOne({ _id: id }, value);
    if (author.matchedCount == 0) {
      return res.status(404).send({ message: "Author topilmadi" });
    }
    res.status(200).send({ message: "Author yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const author = await Author.deleteOne({ _id: id });
    if (author.deletedCount == 0) {
      return res.status(404).send({ message: "Author topilmadi" });
    }
    res.status(200).send({ message: "Author o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
};
