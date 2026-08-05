import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as authService from '../services/authService.js';

const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body, req.user);

  res
    .status(201)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user, accessToken },
        'User registered successfully'
      )
    );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

  res
    .status(200)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user, accessToken },
        'User logged in successfully'
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (req.user?._id) {
    await authService.logoutUser(req.user._id);
  } else if (incomingRefreshToken) {
    await authService.logoutUserByToken(incomingRefreshToken);
  }

  res
    .status(200)
    .clearCookie('refreshToken', cookieOptions)
    .clearCookie('accessToken', cookieOptions)
    .json(new ApiResponse(200, null, 'User logged out successfully'));
});

export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  const { accessToken, refreshToken } = await authService.refreshAuthToken(incomingRefreshToken);

  res
    .status(200)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken },
        'Access token refreshed successfully'
      )
    );
});

export const getMe = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: req.user },
        'Current user profile retrieved successfully'
      )
    );
});

export const getUsers = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? req.query.tenantId || req.user.tenantId : req.user.tenantId;
  const result = await authService.getWorkspaceEmployees(tenantId, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Workspace employees retrieved successfully'));
});
