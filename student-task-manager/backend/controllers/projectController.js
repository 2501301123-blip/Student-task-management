const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");
const Task = require("../models/Task");

const getProjects = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;
  if (search) filter.name = { $regex: search, $options: "i" };

  const projects = await Project.find(filter).populate("members", "name avatarColor").sort({ createdAt: -1 });

  // attach task counts (scoped to this user's own tasks)
  const withCounts = await Promise.all(
    projects.map(async (p) => {
      const taskCount = await Task.countDocuments({ project: p._id, user: req.user._id });
      const doneCount = await Task.countDocuments({ project: p._id, user: req.user._id, status: "done" });
      return { ...p.toObject(), taskCount, doneCount };
    })
  );

  res.json(withCounts);
});

const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, user: req.user._id }).populate("members", "name avatarColor");
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.json(project);
});

const createProject = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Project name is required");
  }
  const project = await Project.create({ ...req.body, user: req.user._id });
  res.status(201).json(project);
});

const updateProject = asyncHandler(async (req, res) => {
  const { user, ...updates } = req.body;
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.json(project);
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.json({ message: "Project deleted", id: req.params.id });
});

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
