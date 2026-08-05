import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/jwt.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized to access this route, token missing');
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded._id).populate('companyId');

    if (!user) {
      throw new ApiError(401, 'User belonging to this token no longer exists');
    }

    if (user.status !== 'Active') {
      throw new ApiError(403, 'Your account is not active. Please contact administrator.');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Not authorized, invalid or expired token');
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'User authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role '${req.user.role}' is not authorized to access this route`
      );
    }

    next();
  };
};
