const express = require("express");
const router = express.Router();
const { getDocuments, createDocument, deleteDocument } = require("../controllers/documentController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getDocuments).post(createDocument);
router.route("/:id").delete(deleteDocument);

module.exports = router;
