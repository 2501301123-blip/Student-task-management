const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const Project = require("../models/Project");
const TeamMember = require("../models/TeamMember");

// @desc Aggregate analytics/overview stats for the logged-in user
const getOverview = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [totalTasks, doneTasks, totalProjects, activeProjects, totalMembers] = await Promise.all([
    Task.countDocuments({ user: userId }),
    Task.countDocuments({ user: userId, status: "done" }),
    Project.countDocuments({ user: userId }),
    Project.countDocuments({ user: userId, status: "active" }),
    TeamMember.countDocuments({ user: userId }),
  ]);

  const byStatus = await Task.aggregate([
    { $match: { user: userId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const byPriority = await Task.aggregate([
    { $match: { user: userId } },
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);

  const now = new Date();
  const overdue = await Task.countDocuments({
    user: userId,
    dueDate: { $lt: now },
    status: { $ne: "done" },
  });

  res.json({
    totalTasks,
    doneTasks,
    completionRate: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0,
    totalProjects,
    activeProjects,
    totalMembers,
    overdue,
    byStatus,
    byPriority,
  });
});

// @desc Task completion trend over the last N days, for the logged-in user
const getTrend = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 14;
  const start = new Date();
  start.setDate(start.getDate() - days);

  const trend = await Task.aggregate([
    { $match: { user: req.user._id, createdAt: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        created: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(trend);
});

module.exports = { getOverview, getTrend };
