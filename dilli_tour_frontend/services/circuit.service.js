import apiClient from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';

export const circuitService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `${API_ENDPOINTS.circuits}?${query}`
      : API_ENDPOINTS.circuits;
    return apiClient.get(endpoint);
  },

  getBySlug: (slug) => {
    return apiClient.get(`${API_ENDPOINTS.circuits}/${slug}`);
  },

  create: (data) => {
    return apiClient.post(API_ENDPOINTS.circuits, data);
  },

  update: (id, data) => {
    return apiClient.put(`${API_ENDPOINTS.circuits}/${id}`, data);
  },

  delete: (id) => {
    return apiClient.delete(`${API_ENDPOINTS.circuits}/${id}`);
  },
};

export default circuitService;
