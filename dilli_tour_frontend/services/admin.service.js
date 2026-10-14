import apiClient from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';

export const adminService = {
  getStats: () => {
    return apiClient.get(API_ENDPOINTS.admin.stats);
  },

  getAllUsers: () => {
    return apiClient.get(API_ENDPOINTS.admin.users);
  },

  getUserById: (id) => {
    return apiClient.get(`${API_ENDPOINTS.admin.users}/${id}`);
  },

  createUser: (data) => {
    return apiClient.post(API_ENDPOINTS.admin.users, data);
  },

  updateUser: (id, data) => {
    return apiClient.put(`${API_ENDPOINTS.admin.users}/${id}`, data);
  },

  deleteUser: (id) => {
    return apiClient.delete(`${API_ENDPOINTS.admin.users}/${id}`);
  },
};

export default adminService;
