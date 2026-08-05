import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: [true, 'Invoice number is required'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    tenantId: {
      type: String,
      required: [true, 'Tenant ID is required'],
    },
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Total amount is required'],
    },
    gstAmount: {
      type: Number,
      required: [true, 'GST amount is required'], // 18% GST
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay Test Mode',
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
