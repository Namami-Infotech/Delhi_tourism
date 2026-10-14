import apiClient from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';

export const searchService = {
  search: (q) => {
    return apiClient.get(`${API_ENDPOINTS.search}?q=${encodeURIComponent(q)}`);
  },
};
