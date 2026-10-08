const asyncHandler = require("express-async-handler");
const Event = require("../models/Event");

const getEvents = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const filter = { user: req.user._id };
  if (month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
    filter.date = { $gte: start, $lte: end };
  }
  const events = await Event.find(filter).populate("project", "name color").sort({ date: 1 });
  res.json(events);
});

const createEvent = asyncHandler(async (req, res) => {
  const { title, date } = req.body;
  if (!title || !date) {
    res.status(400);
    throw new Error("Title and date are required");
  }
  const event = await Event.create({ ...req.body, user: req.user._id });
  res.status(201).json(event);
});

const updateEvent = asyncHandler(async (req, res) => {
  const { user, ...updates } = req.body;
  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  res.json(event);
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  res.json({ message: "Event deleted", id: req.params.id });
});

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
