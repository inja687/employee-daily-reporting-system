import crypto from 'crypto';
import razorpayInstance from '../config/razorpay.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import Subscription from '../models/Subscription.js';
import Company from '../models/Company.js';
import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';

// 1. Get all active plans from MongoDB Atlas (Dynamic Pricing)
export const getActivePlans = async () => {
  const plans = await SubscriptionPlan.find({ status: 'Active' }).sort({ displayOrder: 1 });
  return plans;
};

// 2. Get current tenant subscription status with remaining trial/active days
export const getTenantSubscriptionStatus = async (tenantId, companyId) => {
  let subscription = await Subscription.findOne({ tenantId });

  if (!subscription) {
    // Automatically provision trial if missing
    subscription = await Subscription.create({
      companyId,
      tenantId,
      plan: 'Free Trial',
      status: 'Trial',
      isTrial: true,
      trialEnded: false,
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      trialDays: 14,
    });

    if (companyId) {
      await Notification.create({
        recipient: companyId,
        title: '14-Day Free Trial Started',
        message: 'Your 14-day free trial workspace is now active. Explore all features!',
        type: 'System',
      }).catch(() => null);
    }
  }

  const now = new Date();
  const diffTime = new Date(subscription.endDate) - now;
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Check for expiration
  if (remainingDays <= 0 && subscription.status !== 'Expired' && subscription.status !== 'Active') {
    subscription.status = 'Expired';
    await subscription.save();

    if (companyId) {
      await Notification.create({
        recipient: companyId,
        title: 'Trial Expired',
        message: 'Your 14-day free trial has expired. Please upgrade to continue accessing features.',
        type: 'System',
      }).catch(() => null);
    }
  }

  return {
    subscription,
    remainingDays: remainingDays > 0 ? remainingDays : 0,
    isExpired: remainingDays <= 0 && subscription.status !== 'Active',
  };
};

// 3. Create Razorpay order for plan upgrade or renewal
export const createSubscriptionRazorpayOrder = async (userId, tenantId, companyId, { planName, billingCycle = 'monthly' }) => {
  const plan = await Plan.findOne({ name: planName, isActive: true });
  if (!plan) {
    throw new ApiError(404, `Selected subscription plan "${planName}" not found in database`);
  }

  const amount = billingCycle === 'annual' || billingCycle === 'yearly' ? plan.priceAnnual : plan.priceMonthly;
  const amountInPaise = Math.round(amount * 100);

  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: `sub_${Date.now()}`,
    notes: {
      tenantId,
      companyId: companyId ? companyId.toString() : '',
      planName,
      billingCycle,
    },
  };

  const razorpayOrder = await razorpayInstance.orders.create(options);

  const payment = await Payment.create({
    user: userId,
    companyId,
    tenantId,
    orderId: razorpayOrder.id,
    amount,
    currency: 'INR',
    plan: planName,
    status: 'Created',
  });

  return {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    planName,
    billingCycle,
    paymentId: payment._id,
  };
};

// 4. Verify Razorpay Payment, Activate Subscription, Update Company Workspace & Generate Invoice
export const verifySubscriptionRazorpayPayment = async (
  userId,
  tenantId,
  companyId,
  { razorpay_order_id, razorpay_payment_id, razorpay_signature, planName, amount, billingCycle = 'monthly' }
) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'IewZ26qnnhqxysT1XelrmyfE';

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { status: 'Failed' }
    );
    throw new ApiError(400, 'Razorpay HMAC signature verification failed');
  }

  // 1. Update Payment Record
  const invoiceNum = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const payment = await Payment.findOneAndUpdate(
    { orderId: razorpay_order_id },
    {
      paymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'Paid',
      plan: planName,
      invoiceNumber: invoiceNum,
      paidAt: new Date(),
    },
    { new: true }
  );

  // 2. Calculate 18% GST & Create Invoice
  const gstAmount = Math.round(amount * 0.18 * 100) / 100;
  const invoice = await Invoice.create({
    invoiceNumber: invoiceNum,
    companyId,
    tenantId,
    planName,
    amount,
    gstAmount,
    paymentMethod: 'Razorpay Test Mode',
  });

  // 3. Atomically Update/Upsert Single Authoritative Subscription Document for Tenant
  const extensionDays = billingCycle === 'annual' || billingCycle === 'yearly' ? 365 : 30;
  let subscription = await Subscription.findOne({ tenantId });
  const subscriptionBefore = subscription ? subscription.toObject() : null;

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + extensionDays * 24 * 60 * 60 * 1000);

  if (!subscription) {
    subscription = await Subscription.create({
      companyId,
      tenantId,
      plan: planName,
      status: 'Active',
      isTrial: false,
      trialEnded: true,
      trialDays: 0,
      billingCycle: billingCycle === 'annual' || billingCycle === 'yearly' ? 'yearly' : 'monthly',
      startDate,
      endDate,
    });
  } else {
    subscription.plan = planName;
    subscription.status = 'Active';
    subscription.isTrial = false;
    subscription.trialEnded = true;
    subscription.trialDays = 0;
    subscription.billingCycle = billingCycle === 'annual' || billingCycle === 'yearly' ? 'yearly' : 'monthly';
    subscription.startDate = startDate;
    subscription.endDate = endDate;
    await subscription.save();
  }

  // 4. Update Company Document
  if (companyId) {
    await Company.findByIdAndUpdate(companyId, {
      'subscription.status': 'Active',
      'subscription.plan': planName,
    }).catch(() => null);
  }

  // Debug Logging
  console.log(`\n=============================================`);
  console.log(`[PAYMENT VERIFIED] Company ID: ${companyId}, Tenant ID: ${tenantId}, Purchased Plan: ${planName}`);
  console.log(`[SUBSCRIPTION BEFORE UPDATE]:`, subscriptionBefore);
  console.log(`[SUBSCRIPTION AFTER UPDATE]:`, subscription.toObject());
  console.log(`=============================================\n`);

  // 5. Send Notifications
  if (userId) {
    await Notification.create({
      recipient: userId,
      title: 'Payment Successful',
      message: `Your payment of ₹${amount} for ${planName} Plan was verified successfully.`,
      type: 'System',
    }).catch(() => null);

    await Notification.create({
      recipient: userId,
      title: 'Invoice Generated',
      message: `Invoice #${invoiceNum} generated with 18% GST (₹${gstAmount}). Download anytime under Billing.`,
      type: 'System',
    }).catch(() => null);

    await Notification.create({
      recipient: userId,
      title: 'Subscription Activated',
      message: `Your ${planName} Plan is active until ${new Date(subscription.endDate).toLocaleDateString()}.`,
      type: 'System',
    }).catch(() => null);
  }

  return {
    subscription,
    invoice,
    payment,
  };
};

// 5. Cancel Subscription
export const cancelTenantSubscription = async (tenantId) => {
  const subscription = await Subscription.findOne({ tenantId });
  if (!subscription) {
    throw new ApiError(404, 'Subscription record not found');
  }

  subscription.status = 'Cancelled';
  await subscription.save();

  return subscription;
};

// 6. Get Billing History & Download Invoice
export const getTenantBillingHistory = async (tenantId) => {
  const invoices = await Invoice.find({ tenantId }).sort({ createdAt: -1 });
  const payments = await Payment.find({ tenantId }).sort({ createdAt: -1 });
  return { invoices, payments };
};

export const getInvoiceByIdOrNum = async (tenantId, invoiceId) => {
  const invoice = await Invoice.findOne({ _id: invoiceId, tenantId }).populate('companyId');
  if (!invoice) {
    throw new ApiError(404, 'Invoice not found');
  }
  return invoice;
};
