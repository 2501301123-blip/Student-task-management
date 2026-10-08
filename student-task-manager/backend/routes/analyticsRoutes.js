const express = require("express");
const router = express.Router();
const { getOverview, getTrend } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/overview", getOverview);
router.get("/trend", getTrend);

module.exports = router;
