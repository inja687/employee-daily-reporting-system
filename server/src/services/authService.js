import User from '../models/User.js';
import Company from '../models/Company.js';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/apiFeatures.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';

export const registerUser = async (userData, creatorUser = null) => {
  const { name, email, password, employeeId, department, designation, phone, profilePhoto, role } = userData;

  // Global check for duplicate email
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    throw new ApiError(400, 'User with this email already exists');
  }

  let tenantId = creatorUser?.tenantId || userData.tenantId;
  let companyId = creatorUser?.companyId?._id || creatorUser?.companyId || userData.companyId || null;

  // Resolve tenantId & companyId from companyCode/companyId if missing
  if (!tenantId && (userData.companyCode || userData.companyId)) {
    const comp = await Company.findOne({
      $or: [
        { companyCode: (userData.companyCode || '').toUpperCase() },
        { companyId: userData.companyId },
      ].filter(Boolean),
    });
    if (comp) {
      tenantId = comp.tenantId;
      companyId = comp._id;
    }
  }

  // Fallback to latest registered company workspace or default system tenant if missing
  if (!tenantId) {
    const defaultComp = await Company.findOne().sort({ createdAt: -1 });
    if (defaultComp) {
      tenantId = defaultComp.tenantId;
      companyId = defaultComp._id;
    } else {
      tenantId = 'default-system-tenant';
    }
  }

  // Generate or sanitize employeeId and check duplicate scoped to tenant
  const finalEmpId = employeeId ? employeeId.toUpperCase() : `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
  const existingEmployeeId = await User.findOne({
    tenantId,
    employeeId: finalEmpId,
  });
  if (existingEmployeeId) {
    throw new ApiError(400, 'An employee with this Employee ID already exists in your workspace');
  }

  const user = await User.create({
    name,
    email,
    password,
    employeeId: finalEmpId,
    tenantId,
    companyId,
    department,
    designation,
    phone,
    profilePhoto,
    role: role || 'Employee',
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const createdUser = await User.findById(user._id).populate('companyId');

  return { user: createdUser, accessToken, refreshToken };
};

export const loginUser = async (email, password) => {
  const inputEmail = email.toLowerCase().trim();
  const searchEmail = inputEmail === 'superadmin12' ? 'superadmin12@system.com' : inputEmail;

  let user = await User.findOne({
    $or: [{ email: searchEmail }, { email: inputEmail }],
  }).select('+password +refreshToken').populate('companyId');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.status !== 'Active') {
    throw new ApiError(403, 'Your account is inactive or pending approval');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const userResponse = await User.findById(user._id).populate('companyId');

  return { user: userResponse, accessToken, refreshToken };
};

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
};

export const logoutUserByToken = async (refreshToken) => {
  if (!refreshToken) return;
  await User.findOneAndUpdate(
    { refreshToken },
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
};

export const refreshAuthToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token missing');
  }

  try {
    const decoded = verifyRefreshToken(incomingRefreshToken);
    const user = await User.findById(decoded._id).select('+refreshToken').populate('companyId');

    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
};

export const getWorkspaceEmployees = async (tenantId, queryString) => {
  if (!tenantId) return { users: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };

  const features = new ApiFeatures(
    User.find({ tenantId, role: { $ne: 'Super Admin' } }).select('-password -refreshToken').populate('companyId'),
    queryString
  )
    .filter()
    .search(['name', 'email', 'employeeId', 'department', 'designation'])
    .sort('-createdAt');

  const pagination = await features.paginate();
  const users = await features.query;

  return { users, pagination };
};
