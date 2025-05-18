const {
  addDescQA,
  getAllDescQAs,
  getDescQAById,
  updateDescQAById,
  deleteDescQAById,
} = require("../controllers/desc_qa.controller");

const router = require("express").Router();

router.post("/create", addDescQA);
router.get("/all", getAllDescQAs);
router.get("/:id", getDescQAById);
router.put("/:id", updateDescQAById);
router.delete("/:id", deleteDescQAById);

module.exports = router;
