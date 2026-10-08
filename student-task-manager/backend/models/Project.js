const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "on-hold", "completed", "archived"],
      default: "active",
    },
    color: { type: String, default: "#6366f1" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "TeamMember" }],
    deadline: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
