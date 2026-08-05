import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as noticeService from '../services/noticeService.js';

export const createNotice = asyncHandler(async (req, res) => {
  const notice = await noticeService.createNotice(req.user, req.body);
  res.status(201).json(new ApiResponse(201, notice, 'Notice posted successfully'));
});

export const getNotices = asyncHandler(async (req, res) => {
  const result = await noticeService.getNotices(req.user, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Notices retrieved successfully'));
});

export const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await noticeService.getNoticeById(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, notice, 'Notice details retrieved'));
});

export const updateNotice = asyncHandler(async (req, res) => {
  const notice = await noticeService.updateNotice(req.params.id, req.user, req.body);
  res.status(200).json(new ApiResponse(200, notice, 'Notice updated successfully'));
});

export const deleteNotice = asyncHandler(async (req, res) => {
  await noticeService.deleteNotice(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, null, 'Notice deleted successfully'));
});
