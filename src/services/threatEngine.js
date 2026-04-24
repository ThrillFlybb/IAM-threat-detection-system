const Threat = require('../models/Threat.model');

// ===============================
// Helper: Prevent duplicate alerts
// ===============================
const alreadyExistsRecently = async (userId, type, minutes = 60) => {
  return await Threat.findOne({
    userId,
    type,
    createdAt: { $gte: new Date(Date.now() - minutes * 60 * 1000) }
  });
};

// ===============================
// Main Threat Detection Function
// ===============================
const detectThreats = async ({ user, ip }) => {
  try {
    const hour = new Date().getHours();

    // ===============================
    // 1. OFF HOURS ACCESS
    // ===============================
    if (hour < 6 || hour > 23) {
      const exists = await alreadyExistsRecently(user._id, "OFF_HOURS_ACCESS", 60);

      if (!exists) {
        await Threat.create({
          userId: user._id,
          userName: user.name,
          type: "OFF_HOURS_ACCESS",
          severity: "medium",
          title: "Login at unusual time",
          detail: `Hour: ${hour}`,
          ipAddress: ip,
        });
      }
    }

    // ===============================
    // 2. BRUTE FORCE DETECTION
    // ===============================
    if (user.failedLoginAttempts >= 5) {
      const exists = await alreadyExistsRecently(user._id, "BRUTE_FORCE", 30);

      if (!exists) {
        await Threat.create({
          userId: user._id,
          userName: user.name,
          type: "BRUTE_FORCE",
          severity: "high",
          title: "Multiple Failed Logins",
          detail: `Attempts: ${user.failedLoginAttempts}`,
          ipAddress: ip,
        });
      }
    }

    // ===============================
    // 3. MULTI-LOCATION (IP CHANGE)
    // ===============================
    if (user.lastLoginIp && user.lastLoginIp !== ip) {
      const exists = await alreadyExistsRecently(user._id, "MULTI_LOCATION", 60);

      if (!exists) {
        await Threat.create({
          userId: user._id,
          userName: user.name,
          type: "MULTI_LOCATION",
          severity: "medium",
          title: "Login from new IP",
          detail: `Previous: ${user.lastLoginIp}, Current: ${ip}`,
          ipAddress: ip,
        });
      }
    }

  } catch (err) {
    console.error("Threat detection error:", err.message);
  }
};

module.exports = detectThreats;