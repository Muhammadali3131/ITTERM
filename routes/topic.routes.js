const {
  addTopic,
  getAllTopics,
  getTopicById,
  updateTopicById,
  deleteTopicById,
} = require("../controllers/topic.controller");

const router = require("express").Router();

router.post("/create", addTopic);
router.get("/all", getAllTopics);
router.get("/:id", getTopicById);
router.put("/:id", updateTopicById);
router.delete("/:id", deleteTopicById);

module.exports = router;
