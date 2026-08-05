import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/apiFeatures.js';

export const createTask = async (assignedByUser, data) => {
  const task = await Task.create({
    ...data,
    assignedBy: assignedByUser._id,
    tenantId: assignedByUser.tenantId,
    companyId: assignedByUser.companyId?._id || assignedByUser.companyId || null,
  });

  // Notify assigned employee with tenant isolation
  await Notification.create({
    recipient: data.assignedTo,
    sender: assignedByUser._id,
    tenantId: assignedByUser.tenantId,
    companyId: assignedByUser.companyId?._id || assignedByUser.companyId || null,
    title: 'New Task Assigned',
    message: `You have been assigned a new task: '${task.title}'`,
    type: 'Task',
  });

  return task;
};

export const getMyTasks = async (userId, queryString) => {
  const features = new ApiFeatures(
    Task.find({ assignedTo: userId }).populate('assignedBy', 'name email role'),
    queryString
  )
    .filter()
    .search(['title', 'description', 'priority', 'status'])
    .sort('-createdAt');

  const pagination = await features.paginate();
  const tasks = await features.query;

  return { tasks, pagination };
};

export const getAllTasks = async (tenantId, queryString) => {
  if (!tenantId) {
    return { tasks: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }

  const features = new ApiFeatures(
    Task.find({ tenantId })
      .populate('assignedTo', 'name email employeeId department')
      .populate('assignedBy', 'name email role'),
    queryString
  )
    .filter()
    .search(['title', 'description', 'priority', 'status'])
    .sort('-createdAt');

  const pagination = await features.paginate();
  const tasks = await features.query;

  return { tasks, pagination };
};

export const getTaskById = async (id, user) => {
  const query = user.role === 'Super Admin' ? { _id: id } : { _id: id, tenantId: user.tenantId };
  const task = await Task.findOne(query)
    .populate('assignedTo', 'name email employeeId')
    .populate('assignedBy', 'name email role');

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (
    user.role === 'Employee' &&
    task.assignedTo._id.toString() !== user._id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to view this task');
  }

  return task;
};

export const updateTaskStatus = async (id, user, status) => {
  const query = user.role === 'Super Admin' ? { _id: id } : { _id: id, tenantId: user.tenantId };
  const task = await Task.findOne(query);
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (
    user.role === 'Employee' &&
    task.assignedTo.toString() !== user._id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to update this task status');
  }

  task.status = status;
  await task.save();

  return task;
};

export const updateTask = async (id, user, data) => {
  const query = user.role === 'Super Admin' ? { _id: id } : { _id: id, tenantId: user.tenantId };
  const task = await Task.findOneAndUpdate(query, data, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return task;
};

export const deleteTask = async (id, user) => {
  const query = user.role === 'Super Admin' ? { _id: id } : { _id: id, tenantId: user.tenantId };
  const task = await Task.findOneAndDelete(query);
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
};
