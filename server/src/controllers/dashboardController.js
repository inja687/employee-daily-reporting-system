import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as dashboardService from '../services/dashboardService.js';

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getAdminDashboardData(req.user.tenantId);
  res.status(200).json(new ApiResponse(200, data, 'Admin dashboard metrics retrieved successfully'));
});

export const getEmployeeDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getEmployeeDashboardData(req.user._id);
  res.status(200).json(new ApiResponse(200, data, 'Employee dashboard metrics retrieved successfully'));
});
