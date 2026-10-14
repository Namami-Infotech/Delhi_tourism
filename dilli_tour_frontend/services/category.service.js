import apiClient from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';

export const categoryService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `${API_ENDPOINTS.categories}?${query}`
      : API_ENDPOINTS.categories;
    return apiClient.get(endpoint);
  },

  getBySlug: (slug) => {
    return apiClient.get(`${API_ENDPOINTS.categories}/${slug}`);
  },

  create: (data) => {
    return apiClient.post(API_ENDPOINTS.categories, data);
  },

  update: (id, data) => {
    return apiClient.put(`${API_ENDPOINTS.categories}/${id}`, data);
  },

  delete: (id) => {
    return apiClient.delete(`${API_ENDPOINTS.categories}/${id}`);
  },
};

export default categoryService;
