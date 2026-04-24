const User = require("../models/User.model");

// =========================
// GET ALL USERS
// =========================
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users); // MUST return array
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// =========================
// UNLOCK USER
// =========================
exports.unlockUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    return res.json({
      message: "User unlocked successfully",
      userId: user._id,
    });

  } catch (err) {
    console.error("UNLOCK ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};