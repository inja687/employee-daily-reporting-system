import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: [true, 'Tenant ID is required for multi-tenant isolation'],
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Notice content is required'],
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetRoles: [
      {
        type: String,
        enum: ['Super Admin', 'Admin', 'Employee'],
      },
    ],
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

noticeSchema.index({ tenantId: 1 });

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;
