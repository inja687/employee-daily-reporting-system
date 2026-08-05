import api from './api';

export const createOrderApi = async (data) => {
  const response = await api.post('/payments/create-order', data);
  return response.data;
};

export const verifyPaymentApi = async (data) => {
  const response = await api.post('/payments/verify-payment', data);
  return response.data;
};

export const getPaymentHistoryApi = async (params = {}) => {
  const response = await api.get('/payments/history', { params });
  return response.data;
};

export const getInvoiceApi = async (id) => {
  const response = await api.get(`/payments/invoice/${id}`);
  return response.data;
};
