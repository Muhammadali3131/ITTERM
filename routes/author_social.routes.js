const {
  addAuthorSocial,
  getAllAuthorSocials,
  getAuthorSocialById,
  updateAuthorSocialById,
  deleteAuthorSocialById,
} = require("../controllers/author_social.controller");

const router = require("express").Router();

router.post("/create", addAuthorSocial);
router.get("/all", getAllAuthorSocials);
router.get("/:id", getAuthorSocialById);
router.put("/:id", updateAuthorSocialById);
router.delete("/:id", deleteAuthorSocialById);

module.exports = router;
