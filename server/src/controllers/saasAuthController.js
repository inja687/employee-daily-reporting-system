import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { registerCompanyWorkspace, saasLogin, googleSaaSAuth } from '../services/saasAuthService.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const registerWorkspace = asyncHandler(async (req, res) => {
  const result = await registerCompanyWorkspace(req.body);

  res
    .status(201)
    .cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        201,
        {
          company: result.company,
          user: result.user,
          owner: result.owner,
          adminCredentials: result.adminCredentials,
          accessToken: result.accessToken,
          isNewCompany: true,
        },
        'Company workspace and 14-day trial provisioned successfully'
      )
    );
});

export const loginSaaSUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await saasLogin(email, password);

  res
    .status(200)
    .cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        200,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        'Multi-tenant authentication successful'
      )
    );
});

export const googleAuth = asyncHandler(async (req, res) => {
  const result = await googleSaaSAuth(req.body);

  res
    .status(200)
    .cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        200,
        {
          user: result.user,
          accessToken: result.accessToken,
          isNewCompany: result.isNewCompany,
        },
        result.isNewCompany
          ? 'Company created and Google authentication successful'
          : 'Google authentication successful'
      )
    );
});

