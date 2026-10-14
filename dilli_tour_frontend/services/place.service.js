import apiClient from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';

export const placeService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `${API_ENDPOINTS.places}?${query}`
      : API_ENDPOINTS.places;
    return apiClient.get(endpoint);
  },

  getBySlug: (slug) => {
    return apiClient.get(`${API_ENDPOINTS.places}/${slug}`);
  },

  create: (data) => {
    return apiClient.post(API_ENDPOINTS.places, data);
  },

  update: (id, data) => {
    return apiClient.put(`${API_ENDPOINTS.places}/${id}`, data);
  },

  delete: (id) => {
    return apiClient.delete(`${API_ENDPOINTS.places}/${id}`);
  },
};

export default placeService;
