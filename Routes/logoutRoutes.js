const express = require("express");
const router = express.Router();
const { logout } = require("../Controllers/logoutController");

// POST /api/logout
router.post("/logout", logout);

module.exports = router;