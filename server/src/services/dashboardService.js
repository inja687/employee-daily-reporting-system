import User from '../models/User.js';
import DailyReport from '../models/DailyReport.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Department from '../models/Department.js';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';

export const getAdminDashboardData = async (tenantId) => {
  if (!tenantId) {
    throw new ApiError(403, 'Tenant ID is required for company dashboard access');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalEmployees,
    activeEmployees,
    todayAttendance,
    todayReports,
    pendingLeaves,
    approvedLeaves,
    rejectedLeaves,
    departmentStats,
    openTasksCount,
    totalDepartmentsCount,
  ] = await Promise.all([
    User.countDocuments({ role: 'Employee', tenantId }),
    User.countDocuments({ role: 'Employee', status: 'Active', tenantId }),
    Attendance.countDocuments({ date: today, status: { $in: ['Present', 'Late', 'Half Day'] }, tenantId }),
    DailyReport.countDocuments({ date: { $gte: today, $lt: tomorrow }, tenantId }),
    Leave.countDocuments({ status: 'Pending', tenantId }),
    Leave.countDocuments({ status: 'Approved', tenantId }),
    Leave.countDocuments({ status: 'Rejected', tenantId }),
    User.aggregate([
      { $match: { role: 'Employee', tenantId } },
      {
        $group: {
          _id: '$department',
          employeeCount: { $sum: 1 },
        },
      },
      { $sort: { employeeCount: -1 } },
    ]),
    Task.countDocuments({ status: { $in: ['Pending', 'In Progress'] }, tenantId }),
    Department.countDocuments({ tenantId }),
  ]);

  return {
    totalEmployees,
    activeEmployees,
    todayAttendance,
    todayReports,
    openTasksCount,
    totalDepartmentsCount,
    leaves: {
      pending: pendingLeaves,
      approved: approvedLeaves,
      rejected: rejectedLeaves,
    },
    departmentStats,
  };
};

export const getEmployeeDashboardData = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    todayAttendance,
    recentReports,
    approvedLeaveDays,
    unreadNotificationsCount,
    pendingTasksCount,
  ] = await Promise.all([
    Attendance.findOne({ user: userId, date: today }),
    DailyReport.find({ user: userId }).sort('-date').limit(5),
    Leave.aggregate([
      { $match: { user: userId, status: 'Approved' } },
      { $group: { _id: '$leaveType', totalDays: { $sum: '$totalDays' } } },
    ]),
    Notification.countDocuments({ recipient: userId, isRead: false }),
    Task.countDocuments({ assignedTo: userId, status: { $in: ['Pending', 'In Progress'] } }),
  ]);

  // Default leave allocations
  const leaveAllocations = { Casual: 10, Sick: 10, Annual: 14 };
  const leaveUsage = { Casual: 0, Sick: 0, Annual: 0 };

  approvedLeaveDays.forEach((item) => {
    if (leaveUsage[item._id] !== undefined) {
      leaveUsage[item._id] = item.totalDays;
    }
  });

  const leaveBalance = {
    Casual: leaveAllocations.Casual - leaveUsage.Casual,
    Sick: leaveAllocations.Sick - leaveUsage.Sick,
    Annual: leaveAllocations.Annual - leaveUsage.Annual,
  };

  return {
    todayAttendance,
    recentReports,
    leaveBalance,
    unreadNotificationsCount,
    pendingTasksCount,
  };
};
