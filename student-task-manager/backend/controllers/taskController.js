const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");

// @desc  Get all tasks belonging to the logged-in user (supports filters via query params)
// @route GET /api/tasks
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, project, assignee, search, dueBefore, dueAfter } = req.query;
  const filter = { user: req.user._id };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (project) filter.project = project;
  if (assignee) filter.assignee = assignee;
  if (search) filter.title = { $regex: search, $options: "i" };
  if (dueBefore || dueAfter) {
    filter.dueDate = {};
    if (dueBefore) filter.dueDate.$lte = new Date(dueBefore);
    if (dueAfter) filter.dueDate.$gte = new Date(dueAfter);
  }

  const tasks = await Task.find(filter)
    .populate("project", "name color")
    .populate("assignee", "name avatarColor")
    .sort({ createdAt: -1 });

  res.json(tasks);
});

const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id })
    .populate("project", "name color")
    .populate("assignee", "name avatarColor");
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  res.json(task);
});

const createTask = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }
  const task = await Task.create({ ...req.body, user: req.user._id });
  const populated = await task.populate([
    { path: "project", select: "name color" },
    { path: "assignee", select: "name avatarColor" },
  ]);
  res.status(201).json(populated);
});

const updateTask = asyncHandler(async (req, res) => {
  // Strip user from the body so a request can never reassign a task to someone else.
  const { user, ...updates } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  )
    .populate("project", "name color")
    .populate("assignee", "name avatarColor");

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  res.json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  res.json({ message: "Task deleted", id: req.params.id });
});

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
