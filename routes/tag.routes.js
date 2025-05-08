const {
  addTag,
  getAllTags,
  getTagById,
  updateTagById,
  deleteTagById,
} = require("../controllers/tag.controller");

const router = require("express").Router();

router.post("/create", addTag);
router.get("/all", getAllTags);
router.get("/:id", getTagById);
router.put("/:id", updateTagById);
router.delete("/:id", deleteTagById);

module.exports = router;
