import Attendance from '../models/Attendance.js';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/apiFeatures.js';

const SHIFT_START_HOUR = 9;
const SHIFT_START_MINUTE = 30; // 9:30 AM expected check-in time

export const checkIn = async (user, notes = '') => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await Attendance.findOne({ user: user._id, date: today });
  if (existing && existing.checkInTime) {
    throw new ApiError(400, 'You have already checked in today');
  }

  const now = new Date();
  const shiftStart = new Date(now);
  shiftStart.setHours(SHIFT_START_HOUR, SHIFT_START_MINUTE, 0, 0);

  let isLate = false;
  let lateMinutes = 0;

  if (now > shiftStart) {
    isLate = true;
    lateMinutes = Math.floor((now - shiftStart) / (1000 * 60));
  }

  const attendance = await Attendance.create({
    user: user._id,
    tenantId: user.tenantId,
    companyId: user.companyId?._id || user.companyId || null,
    date: today,
    checkInTime: now,
    status: isLate ? 'Late' : 'Present',
    isLate,
    lateMinutes,
    notes,
  });

  return attendance;
};

export const checkOut = async (userId, notes = '') => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await Attendance.findOne({ user: userId, date: today });
  if (!attendance || !attendance.checkInTime) {
    throw new ApiError(400, 'No check-in record found for today');
  }

  if (attendance.checkOutTime) {
    throw new ApiError(400, 'You have already checked out today');
  }

  const now = new Date();
  attendance.checkOutTime = now;

  const durationMs = now - new Date(attendance.checkInTime);
  const durationHours = parseFloat((durationMs / (1000 * 60 * 60)).toFixed(2));
  attendance.workDurationHours = durationHours;

  if (durationHours < 4 && attendance.status !== 'Late') {
    attendance.status = 'Half Day';
  }

  if (notes) {
    attendance.notes = attendance.notes ? `${attendance.notes} | ${notes}` : notes;
  }

  await attendance.save();
  return attendance;
};

export const getMyAttendance = async (userId, queryString) => {
  const features = new ApiFeatures(Attendance.find({ user: userId }), queryString)
    .filter()
    .search(['notes', 'status'])
    .sort('-date');

  const pagination = await features.paginate();
  const attendanceRecords = await features.query;

  return { attendance: attendanceRecords, pagination };
};

export const getAllAttendance = async (tenantId, queryString) => {
  if (!tenantId) {
    return { attendance: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }

  const features = new ApiFeatures(
    Attendance.find({ tenantId }).populate('user', 'name email employeeId department designation'),
    queryString
  )
    .filter()
    .search(['notes', 'status'])
    .sort('-date');

  const pagination = await features.paginate();
  const attendanceRecords = await features.query;

  return { attendance: attendanceRecords, pagination };
};
