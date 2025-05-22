const {
  addTopic,
  getAllTopics,
  getTopicById,
  updateTopicById,
  deleteTopicById,
} = require("../controllers/topic.controller");
const authorJwtGuard = require("../middlewares/guards/author-jwt.guard");

const router = require("express").Router();

router.post("/create", addTopic);
router.get("/all", authorJwtGuard, getAllTopics);
router.get("/:id", getTopicById);
router.put("/:id", updateTopicById);
router.delete("/:id", deleteTopicById);

module.exports = router;
