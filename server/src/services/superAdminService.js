import Company from '../models/Company.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import AuditLog from '../models/AuditLog.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/apiFeatures.js';

// Helper to generate strong random password
const generateStrongPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789#@!';
  let pwd = '';
  for (let i = 0; i < 9; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
};

// 1. Get High-Level Super Admin Dashboard Metrics
export const getSuperAdminDashboardMetrics = async () => {
  const totalCompanies = await Company.countDocuments();
  const trialCompanies = await Subscription.countDocuments({ status: 'Trial' });
  const activeCompanies = await Subscription.countDocuments({ status: 'Active' });
  const expiredCompanies = await Subscription.countDocuments({ status: 'Expired' });

  const totalUsers = await User.countDocuments();
  const totalEmployees = await User.countDocuments({ role: 'Employee' });
  const totalCompanyAdmins = await User.countDocuments({ role: 'Company Admin' });

  // Revenue Aggregations
  const totalRevenueResult = await Payment.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalRevenue = totalRevenueResult[0]?.total || 0;

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthlyRevenueResult = await Payment.aggregate([
    { $match: { status: 'Paid', createdAt: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayRevenueResult = await Payment.aggregate([
    { $match: { status: 'Paid', createdAt: { $gte: startOfToday } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const todayRevenue = todayRevenueResult[0]?.total || 0;

  // Recent 5 Companies & Payments
  const recentCompanies = await Company.find().sort({ createdAt: -1 }).limit(5);
  const recentPayments = await Payment.find({ status: 'Paid' }).sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

  return {
    metrics: {
      totalCompanies,
      activeCompanies,
      trialCompanies,
      expiredCompanies,
      totalUsers,
      totalEmployees,
      totalCompanyAdmins,
      totalRevenue,
      monthlyRevenue,
      todayRevenue,
    },
    recentCompanies,
    recentPayments,
  };
};

// 2. Get Super Admin Analytics
export const getSuperAdminAnalytics = async () => {
  const planDistribution = await Subscription.aggregate([
    { $group: { _id: '$plan', count: { $sum: 1 } } },
  ]);

  const monthlyRevenueTrend = await Payment.aggregate([
    { $match: { status: 'Paid' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const totalTrials = await Subscription.countDocuments({ status: { $in: ['Trial', 'Active', 'Expired'] } });
  const convertedActive = await Subscription.countDocuments({ status: 'Active' });
  const trialConversionRate = totalTrials > 0 ? ((convertedActive / totalTrials) * 100).toFixed(1) : 0;

  return {
    planDistribution,
    monthlyRevenueTrend,
    trialConversionRate: `${trialConversionRate}%`,
  };
};

// 3. Get All Companies List with Search & Filtering
export const getCompanyList = async (queryString = {}) => {
  let query = Company.find();

  if (queryString.search) {
    const regex = new RegExp(queryString.search, 'i');
    query = query.find({
      $or: [{ companyName: regex }, { companyId: regex }, { ownerEmail: regex }],
    });
  }

  if (queryString.status && queryString.status !== 'ALL') {
    query = query.find({ status: queryString.status });
  }

  const companies = await query.sort({ createdAt: -1 });
  const total = companies.length;

  return {
    companies,
    pagination: {
      total,
      page: Number(queryString.page) || 1,
      limit: Number(queryString.limit) || 100,
      totalPages: Math.ceil(total / (Number(queryString.limit) || 100)) || 1,
    },
  };
};

// 4. Suspend / Activate Company Workspace
export const toggleCompanyStatus = async (adminUser, companyId, status) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(404, 'Company workspace not found');
  }

  const userStatus = status === 'Active' ? 'Active' : 'Inactive';
  await User.updateMany({ tenantId: company.tenantId }, { status: userStatus });

  // Update subscription status if suspending
  if (status === 'Suspended') {
    await Subscription.findOneAndUpdate({ tenantId: company.tenantId }, { status: 'Expired' });
  }

  await AuditLog.create({
    actor: adminUser._id,
    actorName: adminUser.name,
    targetCompany: company._id,
    companyName: company.companyName,
    action: status === 'Active' ? 'ACTIVATE_COMPANY' : 'SUSPEND_COMPANY',
    details: `Company workspace set to ${status} by Super Admin`,
  });

  return company;
};

// 5. Extend Trial Days
export const extendCompanyTrial = async (adminUser, companyId, daysToAdd) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(404, 'Company workspace not found');
  }

  let subscription = await Subscription.findOne({ tenantId: company.tenantId });
  if (!subscription) {
    subscription = await Subscription.create({
      companyId: company._id,
      tenantId: company.tenantId,
      plan: 'Free Trial',
      status: 'Trial',
      startDate: new Date(),
      endDate: new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000),
    });
  } else {
    const baseDate = new Date(subscription.endDate) > new Date() ? new Date(subscription.endDate) : new Date();
    subscription.endDate = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    subscription.status = 'Trial';
    await subscription.save();
  }

  await AuditLog.create({
    actor: adminUser._id,
    actorName: adminUser.name,
    targetCompany: company._id,
    companyName: company.companyName,
    action: 'EXTEND_TRIAL',
    details: `Trial extended by ${daysToAdd} days`,
  });

  return subscription;
};

// 6. Reset Company Admin Password
export const resetCompanyAdminPassword = async (adminUser, companyId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(404, 'Company workspace not found');
  }

  const companyAdmin = await User.findOne({
    tenantId: company.tenantId,
    role: 'Company Admin',
  });

  if (!companyAdmin) {
    throw new ApiError(404, 'Company Admin user not found for this workspace');
  }

  const newPassword = generateStrongPassword();
  companyAdmin.password = newPassword;
  await companyAdmin.save();

  await AuditLog.create({
    actor: adminUser._id,
    actorName: adminUser.name,
    targetCompany: company._id,
    companyName: company.companyName,
    action: 'RESET_ADMIN_PASSWORD',
    details: `Reset password for Company Admin email: ${companyAdmin.email}`,
  });

  return {
    adminEmail: companyAdmin.email,
    newPassword,
  };
};

// 7. Manual Subscription Activation
export const manualSubscriptionActivation = async (adminUser, companyId, { planName, days = 30 }) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(404, 'Company workspace not found');
  }

  let subscription = await Subscription.findOne({ tenantId: company.tenantId });
  const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  if (!subscription) {
    subscription = await Subscription.create({
      companyId: company._id,
      tenantId: company.tenantId,
      plan: planName,
      status: 'Active',
      startDate: new Date(),
      endDate,
    });
  } else {
    subscription.plan = planName;
    subscription.status = 'Active';
    subscription.startDate = new Date();
    subscription.endDate = endDate;
    await subscription.save();
  }

  await AuditLog.create({
    actor: adminUser._id,
    actorName: adminUser.name,
    targetCompany: company._id,
    companyName: company.companyName,
    action: 'MANUAL_ACTIVATION',
    details: `Manually activated ${planName} Plan for ${days} days`,
  });

  return subscription;
};

// 8. Broadcast Announcement Notifications
export const broadcastAnnouncement = async (adminUser, { title, message, targetTenantId }) => {
  let query = {};
  if (targetTenantId) {
    query.tenantId = targetTenantId;
  }

  const users = await User.find(query);

  const notifications = users.map((u) => ({
    recipient: u._id,
    title: `[Announcement] ${title}`,
    message,
    type: 'System',
  }));

  await Notification.insertMany(notifications);

  await AuditLog.create({
    actor: adminUser._id,
    actorName: adminUser.name,
    action: 'BROADCAST_ANNOUNCEMENT',
    details: `Broadcast sent to ${users.length} user(s): "${title}"`,
  });

  return { recipientCount: users.length };
};

// 9. Get Audit Logs
export const getAuditLogsList = async (queryString = {}) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 });
  const total = logs.length;

  return {
    logs,
    pagination: {
      total,
      page: Number(queryString.page) || 1,
      limit: Number(queryString.limit) || 100,
      totalPages: Math.ceil(total / (Number(queryString.limit) || 100)) || 1,
    },
  };
};
