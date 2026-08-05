import Subscription from '../models/Subscription.js';
import ApiError from '../utils/ApiError.js';

export const checkTrialAndSubscriptionAccess = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  // Super Admin is exempt from subscription trial lockouts
  if (req.user.role === 'Super Admin') {
    return next();
  }

  // Whitelisted endpoints accessible even when trial is expired (Billing, Pricing, Profile, Logout)
  const allowedPaths = [
    '/pricing',
    '/billing',
    '/payment',
    '/profile',
    '/logout',
    '/api/subscription',
    '/api/auth/logout',
    '/api/saas',
  ];

  const isAllowedPath = allowedPaths.some((path) => req.originalUrl.includes(path));
  if (isAllowedPath) {
    return next();
  }

  if (!req.user.tenantId) {
    return next();
  }

  let subscription = await Subscription.findOne({ tenantId: req.user.tenantId });
  if (!subscription) {
    return next();
  }

  const now = new Date();
  const diffTime = new Date(subscription.endDate) - now;
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = subscription.status !== 'Active' && (remainingDays <= 0 || subscription.status === 'Expired');

  if (isExpired) {
    if (subscription.status !== 'Expired') {
      subscription.status = 'Expired';
      await subscription.save();
    }

    return next(
      new ApiError(
        403,
        'Your 14-day free trial or workspace subscription has expired. Renew your subscription under Billing to continue using ReportPulse.',
        [],
        'SUBSCRIPTION_EXPIRED'
      )
    );
  }

  req.subscription = subscription;
  next();
};

