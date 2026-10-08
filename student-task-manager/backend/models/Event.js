const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ["deadline", "meeting", "exam", "reminder"], default: "reminder" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
