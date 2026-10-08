const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, default: "file" }, // pdf, doc, sheet, image, etc.
    size: { type: String, default: "0 KB" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "TeamMember", default: null },
    url: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
