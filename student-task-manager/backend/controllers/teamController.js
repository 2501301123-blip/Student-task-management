const asyncHandler = require("express-async-handler");
const TeamMember = require("../models/TeamMember");

const getTeam = asyncHandler(async (req, res) => {
  const members = await TeamMember.find({ user: req.user._id }).sort({ name: 1 });
  res.json(members);
});

const createMember = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }
  const exists = await TeamMember.findOne({ user: req.user._id, email });
  if (exists) {
    res.status(400);
    throw new Error("You already have a team member with this email");
  }
  const member = await TeamMember.create({ ...req.body, user: req.user._id });
  res.status(201).json(member);
});

const updateMember = asyncHandler(async (req, res) => {
  const { user, ...updates } = req.body;
  const member = await TeamMember.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );
  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }
  res.json(member);
});

const deleteMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }
  res.json({ message: "Member deleted", id: req.params.id });
});

module.exports = { getTeam, createMember, updateMember, deleteMember };
