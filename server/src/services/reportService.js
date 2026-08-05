import DailyReport from '../models/DailyReport.js';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/apiFeatures.js';

export const createReport = async (user, data, isSubmit = false) => {
  const reportData = {
    ...data,
    user: user._id,
    tenantId: user.tenantId,
    companyId: user.companyId?._id || user.companyId || null,
    status: isSubmit ? 'Submitted' : 'Draft',
    submittedAt: isSubmit ? new Date() : null,
  };

  return await DailyReport.create(reportData);
};

export const getMyReports = async (userId, queryString) => {
  const features = new ApiFeatures(DailyReport.find({ user: userId }), queryString)
    .filter()
    .search(['workSummary', 'blockers', 'remarks'])
    .sort();

  const pagination = await features.paginate();
  const reports = await features.query;

  return { reports, pagination };
};

export const getAllReports = async (tenantId, queryString) => {
  if (!tenantId) {
    return { reports: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }

  const features = new ApiFeatures(
    DailyReport.find({ tenantId }).populate('user', 'name email employeeId department designation'),
    queryString
  )
    .filter()
    .search(['workSummary', 'blockers', 'remarks'])
    .sort();

  const pagination = await features.paginate();
  const reports = await features.query;

  return { reports, pagination };
};

export const getReportById = async (reportId, user) => {
  const query = user.role === 'Super Admin' ? { _id: reportId } : { _id: reportId, tenantId: user.tenantId };
  const report = await DailyReport.findOne(query).populate('user', 'name email employeeId');
  if (!report) {
    throw new ApiError(404, 'Daily report not found');
  }

  if (user.role === 'Employee' && report.user._id.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to view this report');
  }

  return report;
};

export const updateReport = async (reportId, user, data) => {
  const query = user.role === 'Super Admin' ? { _id: reportId } : { _id: reportId, tenantId: user.tenantId };
  const report = await DailyReport.findOne(query);
  if (!report) {
    throw new ApiError(404, 'Daily report not found');
  }

  if (user.role === 'Employee' && report.user.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this report');
  }

  if (report.status === 'Submitted' && user.role === 'Employee') {
    throw new ApiError(400, 'Submitted reports cannot be edited by employees');
  }

  Object.assign(report, data);
  return await report.save();
};

export const submitReport = async (reportId, userId) => {
  const report = await DailyReport.findById(reportId);
  if (!report) {
    throw new ApiError(404, 'Daily report not found');
  }

  if (report.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to submit this report');
  }

  report.status = 'Submitted';
  report.submittedAt = new Date();
  return await report.save();
};

export const deleteReport = async (reportId, user) => {
  const query = user.role === 'Super Admin' ? { _id: reportId } : { _id: reportId, tenantId: user.tenantId };
  const report = await DailyReport.findOne(query);
  if (!report) {
    throw new ApiError(404, 'Daily report not found');
  }

  if (user.role === 'Employee' && report.user.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to delete this report');
  }

  await DailyReport.findByIdAndDelete(report._id);
};
