import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Plan slug is required'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    shortDescription: {
      type: String,
      default: '',
    },
    longDescription: {
      type: String,
      default: '',
    },
    monthlyPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    yearlyPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    currencySymbol: {
      type: String,
      default: '₹',
    },
    trialDays: {
      type: Number,
      default: 14,
    },
    employeeLimit: {
      type: Number,
      default: 50, // 0 = unlimited
    },
    departmentLimit: {
      type: Number,
      default: 10, // 0 = unlimited
    },
    storageLimit: {
      type: Number,
      default: 5, // in GB
    },
    features: {
      attendance: { type: Boolean, default: true },
      dailyReports: { type: Boolean, default: true },
      departments: { type: Boolean, default: true },
      leaveManagement: { type: Boolean, default: true },
      taskManagement: { type: Boolean, default: true },
      analytics: { type: Boolean, default: true },
      notifications: { type: Boolean, default: true },
      exportData: { type: Boolean, default: true },
      pdfReports: { type: Boolean, default: true },
      customBranding: { type: Boolean, default: false },
      prioritySupport: { type: Boolean, default: false },
      apiAccess: { type: Boolean, default: false },
      auditLogs: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Archived'],
      default: 'Active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 1,
    },
    theme: {
      color: { type: String, default: 'purple' },
      gradient: { type: String, default: 'from-purple-600 to-indigo-600' },
      icon: { type: String, default: 'FiZap' },
      ribbonText: { type: String, default: '' },
      buttonText: { type: String, default: 'Choose Plan' },
    },
  },
  { timestamps: true }
);

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

export default SubscriptionPlan;
