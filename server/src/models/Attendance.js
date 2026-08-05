import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    tenantId: {
      type: String,
      required: [true, 'Tenant ID is required for multi-tenant isolation'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    date: {
      type: Date,
      required: [true, 'Attendance date is required'],
      default: () => new Date().setHours(0, 0, 0, 0),
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    workDurationHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Half Day', 'On Leave'],
      default: 'Present',
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    lateMinutes: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index per tenant, user, date
attendanceSchema.index({ tenantId: 1, user: 1, date: 1 }, { unique: true });
attendanceSchema.index({ tenantId: 1, status: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
