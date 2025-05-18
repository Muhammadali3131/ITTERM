const {
  addQuestionAnswer,
  getAllQuestionAnswers,
  getQuestionAnswerById,
  updateQuestionAnswerById,
  deleteQuestionAnswerById,
} = require("../controllers/question_answer.controller");

const router = require("express").Router();

router.post("/create", addQuestionAnswer);
router.get("/all", getAllQuestionAnswers);
router.get("/:id", getQuestionAnswerById);
router.put("/:id", updateQuestionAnswerById);
router.delete("/:id", deleteQuestionAnswerById);

module.exports = router;
