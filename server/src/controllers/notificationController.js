import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as notificationService from '../services/notificationService.js';

export const getMyNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getMyNotifications(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Notifications retrieved successfully'));
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user._id);
  res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, 'Notification deleted successfully'));
});
