import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/apiFeatures.js';

export const getMyNotifications = async (userId, queryString) => {
  const features = new ApiFeatures(
    Notification.find({ recipient: userId }).populate('sender', 'name email role'),
    queryString
  )
    .filter()
    .search(['title', 'message', 'type'])
    .sort('-createdAt');

  const pagination = await features.paginate();
  const notifications = await features.query;

  return { notifications, pagination };
};

export const markAsRead = async (id, userId) => {
  const notification = await Notification.findById(id);
  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  if (notification.recipient.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to update this notification');
  }

  notification.isRead = true;
  await notification.save();

  return notification;
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
};

export const deleteNotification = async (id, userId) => {
  const notification = await Notification.findById(id);
  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  if (notification.recipient.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to delete this notification');
  }

  await Notification.findByIdAndDelete(id);
};
