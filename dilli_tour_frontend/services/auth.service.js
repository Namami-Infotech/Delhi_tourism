import apiClient from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';

export const authService = {
  login: async (email, password) => {
    const res = await apiClient.post(API_ENDPOINTS.auth.login, { email, password });
    if (res?.data?.token) {
      apiClient.setAuthToken(res.data.token);
    }
    return res;
  },

  getMe: () => {
    return apiClient.get(API_ENDPOINTS.auth.me);
  },

  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } finally {
      apiClient.setAuthToken(null);
    }
  },

  isAuthenticated: () => {
    return !!apiClient.getAuthToken();
  },
};

export default authService;
