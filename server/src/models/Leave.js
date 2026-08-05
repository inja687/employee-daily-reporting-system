import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
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
    leaveType: {
      type: String,
      enum: ['Casual', 'Sick', 'Annual', 'Unpaid'],
      required: [true, 'Leave type is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    totalDays: {
      type: Number,
      required: [true, 'Total days calculation is required'],
      min: [0.5, 'Minimum leave duration is half a day'],
    },
    reason: {
      type: String,
      required: [true, 'Leave reason is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

leaveSchema.index({ tenantId: 1, user: 1 });
leaveSchema.index({ tenantId: 1, status: 1 });

const Leave = mongoose.model('Leave', leaveSchema);

export default Leave;
