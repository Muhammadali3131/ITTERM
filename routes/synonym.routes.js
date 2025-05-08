const {
  addSynonym,
  getAllSynonyms,
  getSynonymById,
  updateSynonymById,
  deleteSynonymById,
} = require("../controllers/synonym.controller");

const router = require("express").Router();

router.post("/create", addSynonym);
router.get("/all", getAllSynonyms);
router.get("/:id", getSynonymById);
router.put("/:id", updateSynonymById);
router.delete("/:id", deleteSynonymById);

module.exports = router;
