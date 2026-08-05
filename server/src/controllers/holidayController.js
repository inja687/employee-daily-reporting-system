import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as holidayService from '../services/holidayService.js';

export const createHoliday = asyncHandler(async (req, res) => {
  const holiday = await holidayService.createHoliday(req.body);
  res.status(201).json(new ApiResponse(201, holiday, 'Holiday created successfully'));
});

export const getHolidays = asyncHandler(async (req, res) => {
  const result = await holidayService.getHolidays(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Holidays retrieved successfully'));
});

export const getHolidayById = asyncHandler(async (req, res) => {
  const holiday = await holidayService.getHolidayById(req.params.id);
  res.status(200).json(new ApiResponse(200, holiday, 'Holiday details retrieved'));
});

export const updateHoliday = asyncHandler(async (req, res) => {
  const holiday = await holidayService.updateHoliday(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, holiday, 'Holiday updated successfully'));
});

export const deleteHoliday = asyncHandler(async (req, res) => {
  await holidayService.deleteHoliday(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Holiday deleted successfully'));
});
