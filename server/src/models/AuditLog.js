import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actorName: {
      type: String,
      default: 'Super Admin',
    },
    targetCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyName: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      required: true, // e.g. SUSPEND_COMPANY, ACTIVATE_COMPANY, EXTEND_TRIAL, RESET_ADMIN_PASSWORD, MANUAL_ACTIVATION, BROADCAST_ANNOUNCEMENT
    },
    details: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
