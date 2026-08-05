import api from './api';

export const getSubscriptionPlansApi = async () => {
  const response = await api.get('/subscription/plans');
  return response.data;
};

export const getSubscriptionStatusApi = async () => {
  const response = await api.get('/subscription/status');
  return response.data;
};

export const createSubscriptionOrderApi = async (data) => {
  const response = await api.post('/subscription/create-order', data);
  return response.data;
};

export const verifySubscriptionPaymentApi = async (data) => {
  const response = await api.post('/subscription/verify-payment', data);
  return response.data;
};
