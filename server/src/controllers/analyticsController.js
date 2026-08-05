import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as analyticsService from '../services/analyticsService.js';

export const getMonthlyReportsAnalytics = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? req.query.tenantId || req.user.tenantId : req.user.tenantId;
  const year = req.query.year ? parseInt(req.query.year, 10) : undefined;
  const data = await analyticsService.getMonthlyReportsAnalytics(tenantId, year);
  res.status(200).json(new ApiResponse(200, data, 'Monthly reports analytics retrieved'));
});

export const getWeeklyReportsAnalytics = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? req.query.tenantId || req.user.tenantId : req.user.tenantId;
  const data = await analyticsService.getWeeklyReportsAnalytics(tenantId);
  res.status(200).json(new ApiResponse(200, data, 'Weekly reports analytics retrieved'));
});

export const getProductivityGraphData = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? req.query.tenantId || req.user.tenantId : req.user.tenantId;
  const days = req.query.days ? parseInt(req.query.days, 10) : 14;
  const data = await analyticsService.getProductivityGraphData(tenantId, days);
  res.status(200).json(new ApiResponse(200, data, 'Productivity graph data retrieved'));
});

export const getAttendanceTrends = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? req.query.tenantId || req.user.tenantId : req.user.tenantId;
  const days = req.query.days ? parseInt(req.query.days, 10) : 30;
  const data = await analyticsService.getAttendanceTrends(tenantId, days);
  res.status(200).json(new ApiResponse(200, data, 'Attendance trends analytics retrieved'));
});
