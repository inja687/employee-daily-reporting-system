import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['Starter', 'Professional', 'Enterprise'],
      required: [true, 'Plan name is required'],
      unique: true,
    },
    priceMonthly: {
      type: Number,
      required: [true, 'Monthly price is required'],
    },
    priceAnnual: {
      type: Number,
      required: [true, 'Annual price is required'],
    },
    maxEmployees: {
      type: Number,
      required: [true, 'Max employees threshold is required'], // 25, 100, -1 for unlimited
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
