import api from './api';

export const getMonthlyAnalyticsApi = async (year) => {
  const response = await api.get('/analytics/monthly-reports', { params: { year } });
  return response.data;
};

export const getWeeklyAnalyticsApi = async () => {
  const response = await api.get('/analytics/weekly-reports');
  return response.data;
};

export const getProductivityAnalyticsApi = async (days = 14) => {
  const response = await api.get('/analytics/productivity', { params: { days } });
  return response.data;
};

export const getAttendanceTrendsApi = async (days = 30) => {
  const response = await api.get('/analytics/attendance-trends', { params: { days } });
  return response.data;
};
