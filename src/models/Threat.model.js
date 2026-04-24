const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  userName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['BRUTE_FORCE', 'OFF_HOURS_ACCESS', 'PRIVILEGE_ESCALATION', 'MULTI_LOCATION', 'ANOMALOUS_BEHAVIOR', 'ACCOUNT_TAKEOVER'],
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    default: 'unknown',
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

threatSchema.index({ resolved: 1, createdAt: -1 });
threatSchema.index({ severity: 1, resolved: 1 });

module.exports = mongoose.model('Threat', threatSchema);
