import crypto from 'crypto';
import razorpayInstance from '../config/razorpay.js';
import Payment from '../models/Payment.js';
import Subscription from '../models/Subscription.js';
import Company from '../models/Company.js';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/apiFeatures.js';

export const createRazorpayOrder = async (userId, plan, amount) => {
  // Amount in Razorpay is sent in paise (1 INR = 100 Paise)
  const amountInPaise = Math.round(amount * 100);

  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
    notes: {
      userId: userId.toString(),
      plan,
    },
  };

  const razorpayOrder = await razorpayInstance.orders.create(options);

  const payment = await Payment.create({
    user: userId,
    orderId: razorpayOrder.id,
    amount,
    currency: 'INR',
    plan,
    status: 'Created',
  });

  return {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    paymentRecordId: payment._id,
  };
};

export const verifyRazorpayPayment = async (
  userId,
  tenantId,
  companyId,
  { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, amount, paymentMethod }
) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'IewZ26qnnhqxysT1XelrmyfE';

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const isSignatureValid = generatedSignature === razorpay_signature;

  const payment = await Payment.findOne({ orderId: razorpay_order_id });

  if (!payment) {
    throw new ApiError(404, 'Payment transaction record not found');
  }

  if (!isSignatureValid) {
    payment.status = 'Failed';
    await payment.save();
    throw new ApiError(400, 'Invalid Razorpay payment signature verification failed');
  }

  // Generate unique sequential invoice number
  const invoiceNum = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  payment.paymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  payment.status = 'Paid';
  payment.plan = plan || payment.plan;
  payment.paymentMethod = paymentMethod || 'Razorpay Test Mode';
  payment.invoiceNumber = invoiceNum;
  payment.paidAt = new Date();

  await payment.save();

  // ALSO Sync Subscription & Company Documents in MongoDB!
  const effectiveTenantId = tenantId || payment.tenantId;
  const effectiveCompanyId = companyId || payment.companyId;

  if (effectiveTenantId) {
    let subscription = await Subscription.findOne({ tenantId: effectiveTenantId });
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (!subscription) {
      subscription = await Subscription.create({
        companyId: effectiveCompanyId,
        tenantId: effectiveTenantId,
        plan: plan || payment.plan || 'Professional',
        status: 'Active',
        isTrial: false,
        trialEnded: true,
        trialDays: 0,
        billingCycle: 'monthly',
        startDate,
        endDate,
      });
    } else {
      subscription.plan = plan || payment.plan || 'Professional';
      subscription.status = 'Active';
      subscription.isTrial = false;
      subscription.trialEnded = true;
      subscription.trialDays = 0;
      subscription.startDate = startDate;
      subscription.endDate = endDate;
      await subscription.save();
    }

    if (effectiveCompanyId) {
      await Company.findByIdAndUpdate(effectiveCompanyId, {
        'subscription.status': 'Active',
        'subscription.plan': plan || payment.plan || 'Professional',
      }).catch(() => null);
    }

    console.log(`[PAYMENT SERVICE SYNC] Tenant ID: ${effectiveTenantId}, Plan: ${subscription.plan}, Status: ${subscription.status}`);
  }

  return payment;
};

export const getUserPaymentHistory = async (userId, queryString) => {
  const features = new ApiFeatures(Payment.find({ user: userId }), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const payments = await features.query;
  const total = await Payment.countDocuments({ user: userId });

  return {
    payments,
    pagination: {
      total,
      page: Number(queryString.page) || 1,
      limit: Number(queryString.limit) || 10,
      totalPages: Math.ceil(total / (Number(queryString.limit) || 10)),
    },
  };
};

export const getInvoiceById = async (userId, paymentId) => {
  const payment = await Payment.findOne({ _id: paymentId, user: userId }).populate(
    'user',
    'name email employeeId department designation phone'
  );

  if (!payment) {
    throw new ApiError(404, 'Invoice record not found');
  }

  return payment;
};
