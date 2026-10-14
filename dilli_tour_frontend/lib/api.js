/**
 * API client configuration for Delhi Tourism Platform.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('delhi_tourism_token');
      } catch {
        return null;
      }
    }
    return null;
  }

  setAuthToken(token) {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('delhi_tourism_token', token);
      } else {
        localStorage.removeItem('delhi_tourism_token');
      }
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

    const headers = {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...options.headers,
    };

    if (isFormData) {
      delete headers['Content-Type'];
    }

    const token = this.getAuthToken();
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: response.ok, message: text };
      }

      if (!response.ok) {
        const error = new Error(data.message || `API request failed with status ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // GET request
  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  // POST request
  post(endpoint, data, options = {}) {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  }

  // PUT request
  put(endpoint, data, options = {}) {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.request(endpoint, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  }

  // DELETE request
  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

export const apiClient = new ApiClient();
export default apiClient;