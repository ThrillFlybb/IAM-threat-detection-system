const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  userName: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['LOGIN', 'LOGOUT', 'FAILED_LOGIN', 'ACCESS', 'CREATE', 'UPDATE', 'DELETE', 'ROLE_CHANGE', 'LOCK', 'UNLOCK', 'THREAT'],
  },
  resource: {
    type: String,
    default: null,
  },
  detail: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    default: 'unknown',
  },
  userAgent: {
    type: String,
    default: 'unknown',
  },
  status: {
    type: String,
    enum: ['success', 'warning', 'danger', 'info'],
    default: 'info',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Index for fast queries
auditSchema.index({ userId: 1, createdAt: -1 });
auditSchema.index({ action: 1, createdAt: -1 });
auditSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditSchema);
