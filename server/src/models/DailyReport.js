import mongoose from 'mongoose';

const taskCompletedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  timeSpentHours: {
    type: Number,
    min: [0, 'Time spent cannot be negative'],
    default: 0,
  },
});

const dailyReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Report user reference is required'],
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
      required: [true, 'Report date is required'],
      default: Date.now,
    },
    workSummary: {
      type: String,
      required: [true, 'Work summary is required'],
      trim: true,
    },
    tasksCompleted: [taskCompletedSchema],
    blockers: {
      type: String,
      trim: true,
      default: '',
    },
    hoursWorked: {
      type: Number,
      min: [0, 'Hours worked cannot be negative'],
      default: 8,
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted'],
      default: 'Draft',
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to optimize report lookups per tenant, user, date
dailyReportSchema.index({ tenantId: 1, user: 1, date: 1 });
dailyReportSchema.index({ tenantId: 1, status: 1 });

const DailyReport = mongoose.model('DailyReport', dailyReportSchema);

export default DailyReport;
