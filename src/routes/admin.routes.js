const express = require("express");
const router = express.Router();

const {
  getUsers,
  unlockUser,
} = require("../controllers/admin.controller");

// GET USERS
router.get("/users", getUsers);

// UNLOCK USER
router.post("/unlock", unlockUser);

module.exports = router;