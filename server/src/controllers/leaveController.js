import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as leaveService from '../services/leaveService.js';

export const applyLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.applyLeave(req.user, req.body);
  res.status(201).json(new ApiResponse(201, leave, 'Leave application submitted successfully'));
});

export const getMyLeaves = asyncHandler(async (req, res) => {
  const result = await leaveService.getMyLeaves(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Your leave requests retrieved successfully'));
});

export const getAllLeaves = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? req.query.tenantId || req.user.tenantId : req.user.tenantId;
  const result = await leaveService.getAllLeaves(tenantId, req.query);
  res.status(200).json(new ApiResponse(200, result, 'All leave requests retrieved successfully'));
});

export const approveLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.approveLeave(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, leave, 'Leave request approved successfully'));
});

export const rejectLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.rejectLeave(req.params.id, req.user, req.body.rejectionReason);
  res.status(200).json(new ApiResponse(200, leave, 'Leave request rejected successfully'));
});

export const cancelLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.cancelLeave(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, leave, 'Leave request cancelled successfully'));
});
