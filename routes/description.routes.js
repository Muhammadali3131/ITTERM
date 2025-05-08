const {
  addDescription,
  getAllDescriptions,
  getDescriptionById,
  updateDescriptionById,
  deleteDescriptionById,
} = require("../controllers/description.controller");

const router = require("express").Router();

router.post("/create", addDescription);
router.get("/all", getAllDescriptions);
router.get("/:id", getDescriptionById);
router.put("/:id", updateDescriptionById);
router.delete("/:id", deleteDescriptionById);

module.exports = router;
