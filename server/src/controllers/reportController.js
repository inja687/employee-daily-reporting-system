import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as reportService from '../services/reportService.js';

export const createReport = asyncHandler(async (req, res) => {
  const isSubmit = req.body.isSubmit === true || req.body.status === 'Submitted';
  const report = await reportService.createReport(req.user, req.body, isSubmit);
  res.status(201).json(new ApiResponse(201, report, 'Daily report created successfully'));
});

export const getMyReports = asyncHandler(async (req, res) => {
  const result = await reportService.getMyReports(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Your daily reports retrieved successfully'));
});

export const getAllReports = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? req.query.tenantId || req.user.tenantId : req.user.tenantId;
  const result = await reportService.getAllReports(tenantId, req.query);
  res.status(200).json(new ApiResponse(200, result, 'All daily reports retrieved successfully'));
});

export const getReportById = asyncHandler(async (req, res) => {
  const report = await reportService.getReportById(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, report, 'Daily report details retrieved'));
});

export const updateReport = asyncHandler(async (req, res) => {
  const report = await reportService.updateReport(req.params.id, req.user, req.body);
  res.status(200).json(new ApiResponse(200, report, 'Daily report updated successfully'));
});

export const submitReport = asyncHandler(async (req, res) => {
  const report = await reportService.submitReport(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, report, 'Daily report submitted successfully'));
});

export const deleteReport = asyncHandler(async (req, res) => {
  await reportService.deleteReport(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, null, 'Daily report deleted successfully'));
});
