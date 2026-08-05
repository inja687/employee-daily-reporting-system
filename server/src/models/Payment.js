import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    orderId: {
      type: String,
      required: [true, 'Razorpay Order ID is required'],
    },
    paymentId: {
      type: String,
      default: '',
    },
    razorpaySignature: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    plan: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay Test Mode',
    },
    status: {
      type: String,
      enum: ['Created', 'Paid', 'Failed'],
      default: 'Created',
    },
    invoiceNumber: {
      type: String,
      default: '',
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
