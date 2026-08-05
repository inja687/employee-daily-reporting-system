import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getUserPaymentHistory,
  getInvoiceById,
} from '../services/paymentService.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { plan, amount } = req.body;
  const result = await createRazorpayOrder(req.user._id, plan, amount);
  res.status(201).json(new ApiResponse(201, result, 'Razorpay order created successfully'));
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const result = await verifyRazorpayPayment(
    req.user._id,
    req.user.tenantId,
    req.user.companyId,
    req.body
  );
  res.status(200).json(new ApiResponse(200, result, 'Payment verified and invoice generated'));
});

export const getPaymentHistory = asyncHandler(async (req, res) => {
  const result = await getUserPaymentHistory(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Payment history retrieved successfully'));
});

export const getInvoice = asyncHandler(async (req, res) => {
  const result = await getInvoiceById(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, result, 'Invoice details retrieved successfully'));
});
