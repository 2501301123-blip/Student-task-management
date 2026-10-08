const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    role: { type: String, default: "Member" },
    avatarColor: { type: String, default: "#6366f1" },
    status: { type: String, enum: ["online", "offline", "away"], default: "offline" },
  },
  { timestamps: true }
);

// Email only needs to be unique within a single user's own team roster,
// not globally across every account.
teamMemberSchema.index({ user: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("TeamMember", teamMemberSchema);
