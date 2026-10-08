const express = require("express");
const router = express.Router();
const { getTeam, createMember, updateMember, deleteMember } = require("../controllers/teamController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getTeam).post(createMember);
router.route("/:id").put(updateMember).delete(deleteMember);

module.exports = router;
