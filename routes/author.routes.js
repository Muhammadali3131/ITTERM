const {
  addAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
} = require("../controllers/author.controller");

const router = require("express").Router();

router.post("/create", addAuthor);
router.get("/all", getAllAuthors);
router.get("/:id", getAuthorById);
router.put("/:id", updateAuthorById);
router.delete("/:id", deleteAuthorById);

module.exports = router;
