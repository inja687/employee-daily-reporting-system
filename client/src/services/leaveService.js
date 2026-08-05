import api from './api';

export const applyLeaveApi = async (data) => {
  const response = await api.post('/leaves', data);
  return response.data;
};

export const getMyLeavesApi = async (params = {}) => {
  const response = await api.get('/leaves/my', { params });
  return response.data;
};

export const getAllLeavesApi = async (params = {}) => {
  const response = await api.get('/leaves', { params });
  return response.data;
};

export const approveLeaveApi = async (id) => {
  const response = await api.patch(`/leaves/${id}/approve`);
  return response.data;
};

export const rejectLeaveApi = async (id, rejectionReason = '') => {
  const response = await api.patch(`/leaves/${id}/reject`, { rejectionReason });
  return response.data;
};

export const cancelLeaveApi = async (id) => {
  const response = await api.patch(`/leaves/${id}/cancel`);
  return response.data;
};
