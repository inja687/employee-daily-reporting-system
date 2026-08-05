import api from './api';

export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const registerSaaSWorkspaceApi = async (workspaceData) => {
  const response = await api.post('/saas/register', workspaceData);
  return response.data;
};

export const loginSaaSApi = async (credentials) => {
  const response = await api.post('/saas/login', credentials);
  return response.data;
};

export const googleAuthApi = async (googleData) => {
  const response = await api.post('/saas/google', googleData);
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const refreshTokenApi = async () => {
  const response = await api.post('/auth/refresh-token');
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const forgotPasswordApi = async (data) => {
  const response = await api.post('/auth/forgot-password', data);
  return response.data;
};

export const resetPasswordApi = async (data) => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

