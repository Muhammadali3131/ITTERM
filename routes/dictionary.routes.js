const router = require("express").Router();

const {
  addDictionary,
  getAllDictionaries,
  getDictionaryById,
  updateDictionaryById,
  deleteDictionaryById,
} = require("../controllers/dictionary.controller");

const authorExpertGuard = require("../middlewares/guards/author-expert.guard");
const authorJwtGuard = require("../middlewares/guards/author-jwt.guard");

router.post("/create", authorJwtGuard, authorExpertGuard, addDictionary);
router.get("/all", authorJwtGuard, getAllDictionaries);
router.get("/:id", getDictionaryById);
router.put("/:id", updateDictionaryById);
router.delete("/:id", deleteDictionaryById);

module.exports = router;
