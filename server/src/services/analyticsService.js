import DailyReport from '../models/DailyReport.js';
import Attendance from '../models/Attendance.js';

export const getMonthlyReportsAnalytics = async (tenantId, year = new Date().getFullYear()) => {
  if (!tenantId) return [];

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

  return await DailyReport.aggregate([
    {
      $match: {
        tenantId,
        date: { $gte: startDate, $lte: endDate },
        status: 'Submitted',
      },
    },
    {
      $group: {
        _id: { $month: '$date' },
        totalReports: { $sum: 1 },
        totalHoursWorked: { $sum: '$hoursWorked' },
        avgHoursWorked: { $avg: '$hoursWorked' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getWeeklyReportsAnalytics = async (tenantId) => {
  if (!tenantId) return [];

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return await DailyReport.aggregate([
    {
      $match: {
        tenantId,
        date: { $gte: thirtyDaysAgo },
        status: 'Submitted',
      },
    },
    {
      $group: {
        _id: { $week: '$date' },
        totalReports: { $sum: 1 },
        totalHoursWorked: { $sum: '$hoursWorked' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getProductivityGraphData = async (tenantId, days = 14) => {
  if (!tenantId) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  return await DailyReport.aggregate([
    {
      $match: {
        tenantId,
        date: { $gte: startDate },
        status: 'Submitted',
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        totalHours: { $sum: '$hoursWorked' },
        reportCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getAttendanceTrends = async (tenantId, days = 30) => {
  if (!tenantId) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  return await Attendance.aggregate([
    {
      $match: {
        tenantId,
        date: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgLateMinutes: { $avg: '$lateMinutes' },
      },
    },
  ]);
};
