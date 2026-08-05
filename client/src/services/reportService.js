import api from './api';

export const createReportApi = async (data) => {
  const response = await api.post('/reports', data);
  return response.data;
};

export const getMyReportsApi = async (params = {}) => {
  const response = await api.get('/reports/my', { params });
  return response.data;
};

export const getAllReportsApi = async (params = {}) => {
  const response = await api.get('/reports', { params });
  return response.data;
};

export const getReportByIdApi = async (id) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

export const updateReportApi = async (id, data) => {
  const response = await api.put(`/reports/${id}`, data);
  return response.data;
};

export const submitReportApi = async (id) => {
  const response = await api.patch(`/reports/${id}/submit`);
  return response.data;
};

export const deleteReportApi = async (id) => {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
};
