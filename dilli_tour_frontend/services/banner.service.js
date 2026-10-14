import apiClient from '../lib/api';

export const bannerService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/banners${query ? `?${query}` : ''}`);
  },

  getById: (id) => {
    return apiClient.get(`/banners/${id}`);
  },

  create: (data) => {
    return apiClient.post('/banners', data);
  },

  update: (id, data) => {
    return apiClient.put(`/banners/${id}`, data);
  },

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/banners/upload', formData);
  },

  delete: (id) => {
    return apiClient.delete(`/banners/${id}`);
  },
};

export default bannerService;
