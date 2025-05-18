const descQASchema = new Schema({
  qa_id: { type: Schema.Types.ObjectId, ref: "QuestionAnswer", required: true },
  desc_id: { type: Schema.Types.ObjectId, ref: "Description", required: true },
});

module.exports = model("DescQA", descQASchema);
