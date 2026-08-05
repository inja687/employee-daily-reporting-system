import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as planService from '../services/subscriptionPlanService.js';

export const getPublicPlans = asyncHandler(async (req, res) => {
  const plans = await planService.getPublicPlans();
  res.status(200).json(new ApiResponse(200, plans, 'Active subscription plans retrieved successfully'));
});

export const getAllPlans = asyncHandler(async (req, res) => {
  const plans = await planService.getAllPlans();
  res.status(200).json(new ApiResponse(200, plans, 'All subscription plans retrieved for Super Admin'));
});

export const createPlan = asyncHandler(async (req, res) => {
  const plan = await planService.createPlan(req.user, req.body);
  res.status(201).json(new ApiResponse(201, plan, 'Subscription plan created successfully'));
});

export const updatePlan = asyncHandler(async (req, res) => {
  const plan = await planService.updatePlan(req.user, req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, plan, 'Subscription plan updated successfully'));
});

export const deletePlan = asyncHandler(async (req, res) => {
  await planService.deletePlan(req.user, req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Subscription plan deleted successfully'));
});

export const duplicatePlan = asyncHandler(async (req, res) => {
  const plan = await planService.duplicatePlan(req.user, req.params.id);
  res.status(201).json(new ApiResponse(201, plan, 'Subscription plan duplicated successfully'));
});
