const {
  addDescTopic,
  getAllDescTopics,
  getDescTopicById,
  updateDescTopicById,
  deleteDescTopicById,
} = require("../controllers/desc_topic.controller");

const router = require("express").Router();

router.post("/create", addDescTopic);
router.get("/all", getAllDescTopics);
router.get("/:id", getDescTopicById);
router.put("/:id", updateDescTopicById);
router.delete("/:id", deleteDescTopicById);

module.exports = router;
