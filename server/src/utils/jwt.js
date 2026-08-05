import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  const userId = user._id || user.id || user;
  const companyId = user.companyId?._id || user.companyId || null;

  return jwt.sign(
    {
      _id: userId,
      userId: userId,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      companyId: companyId,
      employeeId: user.employeeId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    }
  );
};

export const generateRefreshToken = (user) => {
  const userId = user._id || user.id || user;

  return jwt.sign(
    {
      _id: userId,
      userId: userId,
    },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
};
