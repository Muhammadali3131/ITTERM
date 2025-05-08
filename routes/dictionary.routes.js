const {
  addDictionary,
  getAllDictionaries,
  getDictionaryById,
  updateDictionaryById,
  deleteDictionaryById,
} = require("../controllers/dictionary.controller");

const router = require("express").Router();

router.post("/create", addDictionary);
router.get("/all", getAllDictionaries);
router.get("/:id", getDictionaryById);
router.put("/:id", updateDictionaryById);
router.delete("/:id", deleteDictionaryById);

module.exports = router;
