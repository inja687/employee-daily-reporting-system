import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  getSuperAdminDashboardMetrics,
  getSuperAdminAnalytics,
  getCompanyList,
  toggleCompanyStatus,
  extendCompanyTrial,
  resetCompanyAdminPassword,
  manualSubscriptionActivation,
  broadcastAnnouncement,
  getAuditLogsList,
} from '../services/superAdminService.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const result = await getSuperAdminDashboardMetrics();
  res.status(200).json(new ApiResponse(200, result, 'Super Admin dashboard metrics retrieved'));
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const result = await getSuperAdminAnalytics();
  res.status(200).json(new ApiResponse(200, result, 'Super Admin analytics data retrieved'));
});

export const getCompanies = asyncHandler(async (req, res) => {
  const result = await getCompanyList(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Company list retrieved'));
});

export const updateCompanyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const result = await toggleCompanyStatus(req.user, req.params.id, status);
  res.status(200).json(new ApiResponse(200, result, `Company workspace status updated to ${status}`));
});

export const extendTrial = asyncHandler(async (req, res) => {
  const { days } = req.body;
  const result = await extendCompanyTrial(req.user, req.params.id, Number(days) || 7);
  res.status(200).json(new ApiResponse(200, result, `Trial extended by ${days} days`));
});

export const resetAdminPassword = asyncHandler(async (req, res) => {
  const result = await resetCompanyAdminPassword(req.user, req.params.id);
  res.status(200).json(new ApiResponse(200, result, 'Company Admin password reset successfully'));
});

export const manualActivation = asyncHandler(async (req, res) => {
  const result = await manualSubscriptionActivation(req.user, req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, result, 'Manual subscription activation successful'));
});

export const sendBroadcast = asyncHandler(async (req, res) => {
  const result = await broadcastAnnouncement(req.user, req.body);
  res.status(200).json(new ApiResponse(200, result, `Broadcast sent to ${result.recipientCount} users`));
});

export const getAuditLogs = asyncHandler(async (req, res) => {
  const result = await getAuditLogsList(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Super Admin audit logs retrieved'));
});
