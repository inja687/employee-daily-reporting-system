import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as taskService from '../services/taskService.js';

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user, req.body);
  res.status(201).json(new ApiResponse(201, task, 'Task assigned successfully'));
});

export const getMyTasks = asyncHandler(async (req, res) => {
  const result = await taskService.getMyTasks(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Your assigned tasks retrieved'));
});

export const getAllTasks = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? req.query.tenantId || req.user.tenantId : req.user.tenantId;
  const result = await taskService.getAllTasks(tenantId, req.query);
  res.status(200).json(new ApiResponse(200, result, 'All tasks retrieved successfully'));
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, task, 'Task details retrieved'));
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await taskService.updateTaskStatus(req.params.id, req.user, req.body.status);
  res.status(200).json(new ApiResponse(200, task, 'Task status updated successfully'));
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.user, req.body);
  res.status(200).json(new ApiResponse(200, task, 'Task updated successfully'));
});

export const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, null, 'Task deleted successfully'));
});
