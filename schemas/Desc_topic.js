const { Schema, model } = require("mongoose");

const descTopicSchema = new Schema(
  {
    desc_id: { type: Schema.Types.ObjectId, ref: "Description" },
    topic_id: { type: Schema.Types.ObjectId, ref: "Topic" },
  },
  { versionKey: false, timestamps: false }
);

module.exports = model("DescTopic", descTopicSchema);
