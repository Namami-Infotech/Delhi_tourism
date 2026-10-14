import apiClient from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';

export const itineraryService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `${API_ENDPOINTS.itineraries}?${query}`
      : API_ENDPOINTS.itineraries;
    return apiClient.get(endpoint);
  },

  getBySlug: (slug) => {
    return apiClient.get(`${API_ENDPOINTS.itineraries}/${slug}`);
  },

  create: (data) => {
    return apiClient.post(API_ENDPOINTS.itineraries, data);
  },

  update: (id, data) => {
    return apiClient.put(`${API_ENDPOINTS.itineraries}/${id}`, data);
  },

  delete: (id) => {
    return apiClient.delete(`${API_ENDPOINTS.itineraries}/${id}`);
  },
};

export default itineraryService;
