const mongoose = require("mongoose");
const Category = require("../schemas/Category");
const { categoryValidation } = require("../validation/category.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

const addCategory = async (req, res) => {
  try {
    const { error, value } = categoryValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    const newCategory = await Category.create(value);
    res.status(201).send({ message: "Yangi category qo'shildi", newCategory });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send({ categories });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Category topilmadi" });
    }
    res.status(200).send({ category });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = categoryValidation(req.body);
    if (error) return sendErrorResponse(error, res);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }

    const category = await Category.updateOne({ _id: id }, value);
    if (category.matchedCount == 0) {
      return res.status(404).send({ message: "Category topilmadi" });
    }
    res.status(200).send({ message: "Category yangilandi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ error: "ID noto'g'ri kiritilgan" });
    }
    const category = await Category.deleteOne({ _id: id });
    if (category.deletedCount == 0) {
      return res.status(404).send({ message: "Category topilmadi" });
    }
    res.status(200).send({ message: "Category o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
