const asyncHandler = require("express-async-handler");
const Document = require("../models/Document");

const getDocuments = asyncHandler(async (req, res) => {
  const { project, search, type } = req.query;
  const filter = { user: req.user._id };
  if (project) filter.project = project;
  if (type) filter.type = type;
  if (search) filter.name = { $regex: search, $options: "i" };

  const docs = await Document.find(filter)
    .populate("project", "name color")
    .populate("uploadedBy", "name avatarColor")
    .sort({ createdAt: -1 });
  res.json(docs);
});

const createDocument = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Document name is required");
  }
  const doc = await Document.create({ ...req.body, user: req.user._id });
  res.status(201).json(doc);
});

const deleteDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!doc) {
    res.status(404);
    throw new Error("Document not found");
  }
  res.json({ message: "Document deleted", id: req.params.id });
});

module.exports = { getDocuments, createDocument, deleteDocument };
