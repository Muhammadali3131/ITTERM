const router = require("express").Router();

const {
  addAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
  loginAuthor,
} = require("../controllers/author.controller");

const authorJwtGuard = require("../middlewares/guards/author-jwt.guard");
const authorSelfGuard = require("../middlewares/guards/author-self.guard");

router.post("/create", addAuthor);
router.post("/login", loginAuthor);
router.get("/all", authorJwtGuard, getAllAuthors);
router.get("/:id", authorJwtGuard, authorSelfGuard, getAuthorById);
router.put("/:id", updateAuthorById);
router.delete("/:id", deleteAuthorById);

module.exports = router;
