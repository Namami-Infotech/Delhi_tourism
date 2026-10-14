import apiClient from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';

export const eventService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `${API_ENDPOINTS.events}?${query}`
      : API_ENDPOINTS.events;
    return apiClient.get(endpoint);
  },

  getBySlug: (slug) => {
    return apiClient.get(`${API_ENDPOINTS.events}/${slug}`);
  },

  create: (data) => {
    return apiClient.post(API_ENDPOINTS.events, data);
  },

  update: (id, data) => {
    return apiClient.put(`${API_ENDPOINTS.events}/${id}`, data);
  },

  delete: (id) => {
    return apiClient.delete(`${API_ENDPOINTS.events}/${id}`);
  },
};

export default eventService;
