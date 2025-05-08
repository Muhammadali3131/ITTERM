const {
  addSocial,
  getAllSocials,
  getSocialById,
  updateSocialById,
  deleteSocialById,
} = require("../controllers/social.controller");

const router = require("express").Router();

router.post("/create", addSocial);
router.get("/all", getAllSocials);
router.get("/:id", getSocialById);
router.put("/:id", updateSocialById);
router.delete("/:id", deleteSocialById);

module.exports = router;
