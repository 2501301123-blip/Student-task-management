const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");

const getMessages = asyncHandler(async (req, res) => {
  const { channel } = req.query;
  const filter = { user: req.user._id };
  if (channel) filter.channel = channel;
  const messages = await Message.find(filter).populate("sender", "name avatarColor").sort({ createdAt: 1 });
  res.json(messages);
});

const createMessage = asyncHandler(async (req, res) => {
  const { text, sender } = req.body;
  if (!text || !sender) {
    res.status(400);
    throw new Error("Text and sender are required");
  }
  const message = await Message.create({ ...req.body, user: req.user._id });
  const populated = await message.populate("sender", "name avatarColor");
  res.status(201).json(populated);
});

module.exports = { getMessages, createMessage };
