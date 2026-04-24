const AuditLog = require('../models/AuditLog.model');

const logAction = async (req, action, detail, status = 'info') => {
  await AuditLog.create({
    userId: req.user?._id || null,
    userName: req.user?.name || 'guest',
    action,
    detail,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    status,
  });
};

module.exports = logAction;