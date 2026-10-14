import apiClient from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';

export const galleryService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `${API_ENDPOINTS.galleries}?${query}`
      : API_ENDPOINTS.galleries;
    return apiClient.get(endpoint);
  },

  getById: (id) => {
    return apiClient.get(`${API_ENDPOINTS.galleries}/${id}`);
  },

  create: (data) => {
    return apiClient.post(API_ENDPOINTS.galleries, data);
  },

  update: (id, data) => {
    return apiClient.put(`${API_ENDPOINTS.galleries}/${id}`, data);
  },

  delete: (id) => {
    return apiClient.delete(`${API_ENDPOINTS.galleries}/${id}`);
  },
};

export default galleryService;
