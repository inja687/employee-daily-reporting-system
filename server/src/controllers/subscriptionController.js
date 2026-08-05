import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  getActivePlans,
  getTenantSubscriptionStatus,
  createSubscriptionRazorpayOrder,
  verifySubscriptionRazorpayPayment,
  cancelTenantSubscription,
  getTenantBillingHistory,
  getInvoiceByIdOrNum,
} from '../services/subscriptionService.js';

export const getPlans = asyncHandler(async (req, res) => {
  const plans = await getActivePlans();
  res.status(200).json(new ApiResponse(200, plans, 'Subscription plans fetched from MongoDB'));
});

export const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId || req.user._id;
  const result = await getTenantSubscriptionStatus(req.user.tenantId, companyId);
  res.status(200).json(new ApiResponse(200, result, 'Subscription and trial status retrieved'));
});

export const createOrder = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId || req.user._id;
  const result = await createSubscriptionRazorpayOrder(
    req.user._id,
    req.user.tenantId,
    companyId,
    req.body
  );
  res.status(201).json(new ApiResponse(201, result, 'Razorpay order created for subscription'));
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId || req.user._id;
  const result = await verifySubscriptionRazorpayPayment(
    req.user._id,
    req.user.tenantId,
    companyId,
    req.body
  );
  res.status(200).json(new ApiResponse(200, result, 'Subscription payment verified and invoice generated'));
});

export const cancelSubscription = asyncHandler(async (req, res) => {
  const result = await cancelTenantSubscription(req.user.tenantId);
  res.status(200).json(new ApiResponse(200, result, 'Subscription cancelled successfully'));
});

export const getBillingHistory = asyncHandler(async (req, res) => {
  const result = await getTenantBillingHistory(req.user.tenantId);
  res.status(200).json(new ApiResponse(200, result, 'Billing history retrieved'));
});

export const downloadInvoice = asyncHandler(async (req, res) => {
  const invoice = await getInvoiceByIdOrNum(req.user.tenantId, req.params.id);
  res.status(200).json(new ApiResponse(200, invoice, 'Invoice details fetched'));
});
