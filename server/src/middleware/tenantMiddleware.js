import ApiError from '../utils/ApiError.js';

export const enforceTenantIsolation = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required for tenant isolation'));
  }

  // Super Admin can access all tenant data
  if (req.user.role === 'Super Admin') {
    return next();
  }

  if (!req.user.tenantId) {
    return next(new ApiError(403, 'Tenant access denied: No tenant ID associated with user account'));
  }

  req.tenantId = req.user.tenantId;
  next();
};
