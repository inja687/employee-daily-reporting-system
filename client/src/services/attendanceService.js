import api from './api';

export const checkInApi = async (notes = '') => {
  const response = await api.post('/attendance/check-in', { notes });
  return response.data;
};

export const checkOutApi = async (notes = '') => {
  const response = await api.post('/attendance/check-out', { notes });
  return response.data;
};

export const getMyAttendanceApi = async (params = {}) => {
  const response = await api.get('/attendance/my', { params });
  return response.data;
};

export const getAllAttendanceApi = async (params = {}) => {
  const response = await api.get('/attendance/all', { params });
  return response.data;
};
