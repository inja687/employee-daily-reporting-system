import crypto from 'crypto';
import Company from '../models/Company.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import ApiError from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

// Helper function to generate unique Company Code (e.g., COMP-AB123)
const generateCompanyCode = () => {
  return `COMP-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
};

export const registerCompanyWorkspace = async ({
  fullName,
  companyName,
  email,
  mobileNumber,
  companyAddress,
  password,
}) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(400, 'User with this email address already exists');
  }

  const tenantId = `TEN-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const companyId = `CMP-${Math.floor(100000 + Math.random() * 900000)}`;
  const companyCode = generateCompanyCode();

  const trialStartDate = new Date();
  const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  // Create Company Record
  const company = await Company.create({
    companyId,
    companyCode,
    tenantId,
    companyName,
    ownerName: fullName,
    ownerEmail: email.toLowerCase(),
    mobileNumber: mobileNumber || 'N/A',
    subscription: {
      status: 'Trial',
      trialDays: 14,
      trialStartDate,
      trialEndDate,
      plan: 'Free Trial',
    },
  });

  // Create Subscription Document
  await Subscription.create({
    companyId: company._id,
    tenantId,
    plan: 'Free Trial',
    status: 'Trial',
    isTrial: true,
    trialEnded: false,
    startDate: trialStartDate,
    endDate: trialEndDate,
    trialDays: 14,
  }).catch(() => null);

  // Create SINGLE Company Owner Account (Role: Company Admin)
  const ownerUser = await User.create({
    name: fullName,
    email: email.toLowerCase(),
    password, // pre-save hook will hash this!
    employeeId: `OWNER-${companyId}`,
    tenantId,
    companyId: company._id,
    phone: mobileNumber || '',
    role: 'Company Admin',
    status: 'Active',
    department: 'Executive',
    designation: 'Company Owner',
  });

  const accessToken = generateAccessToken(ownerUser);
  const refreshToken = generateRefreshToken(ownerUser);

  ownerUser.refreshToken = refreshToken;
  await ownerUser.save({ validateBeforeSave: false });

  const populatedUser = await User.findById(ownerUser._id).populate('companyId');

  return {
    company: {
      id: company._id,
      companyId: company.companyId,
      companyCode: company.companyCode,
      tenantId: company.tenantId,
      companyName: company.companyName,
      ownerName: company.ownerName,
      ownerEmail: company.ownerEmail,
      subscription: company.subscription,
    },
    user: populatedUser,
    accessToken,
    refreshToken,
    isNewCompany: true,
  };
};

export const saasLogin = async (email, password) => {
  const inputEmail = email.toLowerCase().trim();
  const searchEmail = inputEmail === 'superadmin12' ? 'superadmin12@system.com' : inputEmail;

  // Demo Super Admin account auto-seeding if missing
  if (inputEmail === 'superadmin12' || searchEmail === 'superadmin12@system.com') {
    let superAdmin = await User.findOne({ email: 'superadmin12@system.com' }).select('+password +refreshToken');

    if (!superAdmin) {
      superAdmin = await User.create({
        name: 'Super Admin Owner',
        email: 'superadmin12@system.com',
        password: 'Super44', // pre-save hook will hash this!
        role: 'Super Admin',
        employeeId: 'SUPER-ADMIN-12',
        status: 'Active',
        department: 'Executive Governance',
        designation: 'Software Owner',
      });
      superAdmin = await User.findById(superAdmin._id).select('+password +refreshToken');
    }

    const isMatch = await superAdmin.comparePassword(password);
    if (isMatch) {
      const accessToken = generateAccessToken(superAdmin._id);
      const refreshToken = generateRefreshToken(superAdmin._id);

      superAdmin.refreshToken = refreshToken;
      await superAdmin.save({ validateBeforeSave: false });

      superAdmin.password = undefined;
      superAdmin.refreshToken = undefined;

      return {
        user: superAdmin,
        accessToken,
        refreshToken,
      };
    }
  }

  const user = await User.findOne({
    $or: [{ email: searchEmail }, { email: inputEmail }],
  })
    .select('+password +refreshToken')
    .populate('companyId');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.status !== 'Active') {
    throw new ApiError(403, 'Account is inactive. Please contact support.');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  user.password = undefined;
  user.refreshToken = undefined;

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const googleSaaSAuth = async ({ email, name, googleId, picture, companyName }) => {
  if (!email) {
    throw new ApiError(400, 'Google account email is required');
  }

  const normalizedEmail = email.toLowerCase();
  let user = await User.findOne({ email: normalizedEmail }).populate('companyId');

  let isNewCompany = false;

  if (!user) {
    // Automatically create Company, Tenant, Owner & Subscription trial for Google signup
    isNewCompany = true;
    const finalCompanyName = companyName || `${name || 'My'}'s Company`;
    const tenantId = `TEN-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const companyId = `CMP-${Math.floor(100000 + Math.random() * 900000)}`;
    const companyCode = generateCompanyCode();
    const trialStartDate = new Date();
    const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const company = await Company.create({
      companyId,
      companyCode,
      tenantId,
      companyName: finalCompanyName,
      ownerName: name || 'Google User',
      ownerEmail: normalizedEmail,
      mobileNumber: 'N/A',
      subscription: {
        status: 'Trial',
        trialDays: 14,
        trialStartDate,
        trialEndDate,
        plan: 'Free Trial',
      },
    });

    await Subscription.create({
      companyId: company._id,
      tenantId,
      plan: 'Free Trial',
      status: 'Trial',
      isTrial: true,
      trialEnded: false,
      startDate: trialStartDate,
      endDate: trialEndDate,
      trialDays: 14,
    }).catch(() => null);

    const randomPassword = crypto.randomBytes(8).toString('hex') + '1A!';
    user = await User.create({
      name: name || 'Google User',
      email: normalizedEmail,
      password: randomPassword,
      employeeId: `OWNER-${companyId}`,
      tenantId,
      companyId: company._id,
      profilePhoto: picture || '',
      role: 'Company Admin',
      status: 'Active',
      department: 'Executive',
      designation: 'Company Owner',
    });

    user = await User.findById(user._id).populate('companyId');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  user.password = undefined;
  user.refreshToken = undefined;

  return {
    user,
    accessToken,
    refreshToken,
    isNewCompany,
  };
};



