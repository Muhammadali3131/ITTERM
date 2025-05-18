const questionAnswerSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  is_checked: { type: Boolean, default: false },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expert_id: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("QuestionAnswer", questionAnswerSchema);
