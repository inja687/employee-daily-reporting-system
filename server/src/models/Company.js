import mongoose from 'mongoose';
import crypto from 'crypto';

const companySchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      unique: true,
      required: [true, 'Company ID is required'],
    },
    companyCode: {
      type: String,
      unique: true,
      required: [true, 'Company Code is required'],
      trim: true,
      uppercase: true,
    },
    tenantId: {
      type: String,
      unique: true,
      default: () => crypto.randomUUID(),
      required: [true, 'Tenant ID (UUID) is required'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    ownerName: {
      type: String,
      required: [true, 'Owner full name is required'],
      trim: true,
    },
    ownerEmail: {
      type: String,
      required: [true, 'Owner email is required'],
      lowercase: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    subscription: {
      status: {
        type: String,
        enum: ['Trial', 'Active', 'Cancelled', 'Expired'],
        default: 'Trial',
      },
      trialDays: {
        type: Number,
        default: 14,
      },
      trialStartDate: {
        type: Date,
        default: Date.now,
      },
      trialEndDate: {
        type: Date,
        default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      plan: {
        type: String,
        default: 'Free Trial',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', companySchema);

export default Company;
