import api from './api';

export const getNoticesApi = async (params = {}) => {
  const response = await api.get('/notices', { params });
  return response.data;
};

export const createNoticeApi = async (data) => {
  const response = await api.post('/notices', data);
  return response.data;
};

export const updateNoticeApi = async (id, data) => {
  const response = await api.put(`/notices/${id}`, data);
  return response.data;
};

export const deleteNoticeApi = async (id) => {
  const response = await api.delete(`/notices/${id}`);
  return response.data;
};
