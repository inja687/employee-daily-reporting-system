import Leave from '../models/Leave.js';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/apiFeatures.js';

export const applyLeave = async (user, data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (end < start) {
    throw new ApiError(400, 'End date cannot be prior to start date');
  }

  const diffTime = Math.abs(end - start);
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const leave = await Leave.create({
    ...data,
    user: user._id,
    tenantId: user.tenantId,
    companyId: user.companyId?._id || user.companyId || null,
    totalDays,
    status: 'Pending',
  });

  return leave;
};

export const getMyLeaves = async (userId, queryString) => {
  const features = new ApiFeatures(Leave.find({ user: userId }), queryString)
    .filter()
    .search(['reason', 'leaveType', 'status'])
    .sort('-createdAt');

  const pagination = await features.paginate();
  const leaves = await features.query;

  return { leaves, pagination };
};

export const getAllLeaves = async (tenantId, queryString) => {
  if (!tenantId) {
    return { leaves: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }

  const features = new ApiFeatures(
    Leave.find({ tenantId })
      .populate('user', 'name email employeeId department designation')
      .populate('approvedBy', 'name email'),
    queryString
  )
    .filter()
    .search(['reason', 'leaveType', 'status'])
    .sort('-createdAt');

  const pagination = await features.paginate();
  const leaves = await features.query;

  return { leaves, pagination };
};

export const approveLeave = async (leaveId, adminUser) => {
  const query = adminUser.role === 'Super Admin' ? { _id: leaveId } : { _id: leaveId, tenantId: adminUser.tenantId };
  const leave = await Leave.findOne(query);
  if (!leave) {
    throw new ApiError(404, 'Leave request not found');
  }

  if (leave.status !== 'Pending') {
    throw new ApiError(400, `Leave is already ${leave.status.toLowerCase()}`);
  }

  leave.status = 'Approved';
  leave.approvedBy = adminUser._id;
  await leave.save();

  return leave;
};

export const rejectLeave = async (leaveId, adminUser, rejectionReason) => {
  const query = adminUser.role === 'Super Admin' ? { _id: leaveId } : { _id: leaveId, tenantId: adminUser.tenantId };
  const leave = await Leave.findOne(query);
  if (!leave) {
    throw new ApiError(404, 'Leave request not found');
  }

  if (leave.status !== 'Pending') {
    throw new ApiError(400, `Leave is already ${leave.status.toLowerCase()}`);
  }

  leave.status = 'Rejected';
  leave.approvedBy = adminUser._id;
  leave.rejectionReason = rejectionReason || 'Rejected by administrator';
  await leave.save();

  return leave;
};

export const cancelLeave = async (leaveId, userId) => {
  const leave = await Leave.findById(leaveId);
  if (!leave) {
    throw new ApiError(404, 'Leave request not found');
  }

  if (leave.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to cancel this leave request');
  }

  if (leave.status !== 'Pending') {
    throw new ApiError(400, 'Only pending leave requests can be cancelled');
  }

  leave.status = 'Cancelled';
  await leave.save();

  return leave;
};
