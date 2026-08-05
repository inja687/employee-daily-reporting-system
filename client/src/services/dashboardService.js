import api from './api';

export const getAdminDashboardApi = async () => {
  const response = await api.get('/dashboard/admin');
  return response.data;
};

export const getEmployeeDashboardApi = async () => {
  const response = await api.get('/dashboard/employee');
  return response.data;
};
