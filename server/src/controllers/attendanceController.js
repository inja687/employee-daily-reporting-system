import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as attendanceService from '../services/attendanceService.js';

export const checkIn = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.checkIn(req.user, req.body.notes);
  res.status(200).json(new ApiResponse(200, attendance, 'Check-in successful'));
});

export const checkOut = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.checkOut(req.user._id, req.body.notes);
  res.status(200).json(new ApiResponse(200, attendance, 'Check-out successful'));
});

export const getMyAttendance = asyncHandler(async (req, res) => {
  const result = await attendanceService.getMyAttendance(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Your attendance records retrieved'));
});

export const getAllAttendance = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? req.query.tenantId || req.user.tenantId : req.user.tenantId;
  const result = await attendanceService.getAllAttendance(tenantId, req.query);
  res.status(200).json(new ApiResponse(200, result, 'All attendance records retrieved'));
});
