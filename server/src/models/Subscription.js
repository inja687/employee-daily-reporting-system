import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    tenantId: {
      type: String,
      required: [true, 'Tenant ID (UUID) is required'],
      unique: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['Free Trial', 'Starter', 'Professional', 'Enterprise'],
      default: 'Free Trial',
    },
    status: {
      type: String,
      enum: ['Trial', 'Active', 'Cancelled', 'Expired'],
      default: 'Trial',
    },
    isTrial: {
      type: Boolean,
      default: true,
    },
    trialEnded: {
      type: Boolean,
      default: false,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    trialDays: {
      type: Number,
      default: 14,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to calculate remaining trial/active days automatically
subscriptionSchema.virtual('remainingDays').get(function () {
  if (!this.endDate) return 0;
  const diffTime = new Date(this.endDate) - new Date();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
