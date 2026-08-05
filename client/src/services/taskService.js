import api from './api';

export const getMyTasksApi = async (params = {}) => {
  const response = await api.get('/tasks/my', { params });
  return response.data;
};

export const getAllTasksApi = async (params = {}) => {
  const response = await api.get('/tasks', { params });
  return response.data;
};

export const createTaskApi = async (data) => {
  const response = await api.post('/tasks', data);
  return response.data;
};

export const updateTaskStatusApi = async (id, status) => {
  const response = await api.patch(`/tasks/${id}/status`, { status });
  return response.data;
};

export const deleteTaskApi = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
