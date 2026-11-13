/**
 * ==============================================================================
 * GROVE Fullstack REST API Client
 * ==============================================================================
 * Centralized HTTP client connecting the React frontend directly to the
 * production Express / MongoDB backend. Supports Bearer token authorization,
 * standardized payload unwrapping, query string serialization, and error parsing.
 * ==============================================================================
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Unified token storage keys
export const TOKEN_STORAGE_KEY = 'grove_auth_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'grove_refresh_token';

/**
 * Retrieves the currently active authorization token.
 * Checks primary token key, with fallbacks to role-specific storage keys.
 */
export function getAuthToken() {
  try {
    const directToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (directToken) return directToken;

    // Fallbacks if token was stored in a session object
    const customer = localStorage.getItem('grove_current_user');
    if (customer) {
      const parsed = JSON.parse(customer);
      if (parsed.token) return parsed.token;
    }

    const dealer = localStorage.getItem('grove_dealer_user');
    if (dealer) {
      const parsed = JSON.parse(dealer);
      if (parsed.token) return parsed.token;
    }

    const admin = localStorage.getItem('grove_admin_user');
    if (admin) {
      const parsed = JSON.parse(admin);
      if (parsed.token) return parsed.token;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Sets the active authentication token.
 */
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

/**
 * Removes all active authentication tokens.
 */
export function clearAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

/**
 * Serializes an object into URL search parameters
 */
function buildQueryString(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, String(val));
    }
  });
  const str = query.toString();
  return str ? `?${str}` : '';
}

let refreshPromise = null;

/**
 * Core HTTP Request Dispatcher
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = getAuthToken();
  const headers = {
    Accept: 'application/json',
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // allows refresh token cookies
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(url, config);

    // Handle 204 No Content
    if (res.status === 204) {
      return { success: true };
    }

    // Auto-refresh on 401 Unauthorized (TokenExpiredError)
    if (res.status === 401 && !options._retry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh-token')) {
      options._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ refreshToken: storedRefreshToken || undefined })
            });

            if (!refreshRes.ok) {
              throw new Error('Refresh failed');
            }

            const refreshJson = await refreshRes.json();
            const newAccessToken = refreshJson?.data?.accessToken;
            if (newAccessToken) {
              setAuthToken(newAccessToken);
              if (refreshJson?.data?.refreshToken) {
                localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshJson.data.refreshToken);
              }

              // Update token inside customer session storage
              const rawCust = localStorage.getItem('grove_current_user');
              if (rawCust) {
                try {
                  const cust = JSON.parse(rawCust);
                  cust.token = newAccessToken;
                  localStorage.setItem('grove_current_user', JSON.stringify(cust));
                } catch {}
              }
              return newAccessToken;
            }
            throw new Error('No access token returned');
          })();
        }

        const freshToken = await refreshPromise;
        refreshPromise = null;

        // Replay original request with fresh token
        return request(endpoint, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${freshToken}`
          }
        });
      } catch (refreshErr) {
        refreshPromise = null;
        // Session cannot be refreshed: clear invalid stale tokens
        clearAuthToken();
        localStorage.removeItem('grove_current_user');
        window.dispatchEvent(new Event('grove_auth_changed'));
      }
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        data?.message ||
        data?.error ||
        (Array.isArray(data?.errors) ? data.errors.map((e) => e.message).join(', ') : null) ||
        `HTTP Error ${res.status}: ${res.statusText}`;

      const error = new Error(message);
      error.status = res.status;
      error.code = data?.code;
      error.data = data;
      throw error;
    }

    // Unwrap standardized ApiResponse format { success: true, data: ..., pagination: ... }
    return data;
  } catch (err) {
    // Re-throw with descriptive context
    throw err;
  }
}

export const apiClient = {
  get: (endpoint, params, headers) =>
    request(`${endpoint}${buildQueryString(params)}`, { method: 'GET', headers }),

  post: (endpoint, body, headers) =>
    request(endpoint, { method: 'POST', body, headers }),

  put: (endpoint, body, headers) =>
    request(endpoint, { method: 'PUT', body, headers }),

  patch: (endpoint, body, headers) =>
    request(endpoint, { method: 'PATCH', body, headers }),

  delete: (endpoint, headers) =>
    request(endpoint, { method: 'DELETE', headers })
};

/* ==========================================================================
   MODULE-SPECIFIC API CONSUMPTION METHODS
   ========================================================================== */

/**
 * 1. Authentication APIs
 */
export const authApi = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res?.data?.accessToken) {
      setAuthToken(res.data.accessToken);
    }
    if (res?.data?.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, res.data.refreshToken);
    }
    return res.data;
  },

  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    if (res?.data?.accessToken) {
      setAuthToken(res.data.accessToken);
    }
    if (res?.data?.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, res.data.refreshToken);
    }
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      clearAuthToken();
    }
  },

  registerDealer: async (applicationData) => {
    const res = await apiClient.post('/dealers/apply', applicationData);
    return res.data;
  }
};

/**
 * 2. Products APIs
 */
export const productsApi = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/products', params);
    // Returns { products: [...], pagination: { page, limit, total, pages } }
    return res.data;
  },

  getByIdOrSlug: async (idOrSlug) => {
    const res = await apiClient.get(`/products/${idOrSlug}`);
    return res.data;
  },

  getMyProducts: async (params = {}) => {
    const res = await apiClient.get('/products/dealer/my-products', params);
    return res.data;
  },

  create: async (productData) => {
    const res = await apiClient.post('/products', productData);
    return res.data;
  },

  update: async (id, updateData) => {
    const res = await apiClient.put(`/products/${id}`, updateData);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  }
};

/**
 * 3. Categories APIs
 */
export const categoriesApi = {
  getAll: async () => {
    const res = await apiClient.get('/categories');
    return res.data;
  },

  getBySlug: async (slug) => {
    const res = await apiClient.get(`/categories/${slug}`);
    return res.data;
  },

  create: async (categoryData) => {
    const res = await apiClient.post('/categories', categoryData);
    return res.data;
  },

  update: async (id, updateData) => {
    const res = await apiClient.put(`/categories/${id}`, updateData);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/categories/${id}`);
    return res.data;
  }
};

/**
 * 4. Orders APIs
 */
export const ordersApi = {
  checkout: async (orderPayload) => {
    const res = await apiClient.post('/orders/checkout', orderPayload);
    return res.data;
  },

  getMyOrders: async () => {
    const res = await apiClient.get('/orders/my-orders');
    return res.data;
  },

  getMyOrderById: async (orderId) => {
    const res = await apiClient.get(`/orders/my-orders/${orderId}`);
    return res.data;
  },

  cancelOrder: async (orderId, reason = 'Customer request') => {
    const res = await apiClient.post(`/orders/my-orders/${orderId}/cancel`, { reason });
    return res.data;
  },

  getDealerOrders: async () => {
    const res = await apiClient.get('/orders/dealer/my-orders');
    return res.data;
  },

  getDealerOrderById: async (id) => {
    const res = await apiClient.get(`/orders/dealer/my-orders/${id}`);
    return res.data;
  },

  updateDealerOrderStatus: async (id, statusData) => {
    const res = await apiClient.patch(`/orders/dealer/my-orders/${id}/status`, statusData);
    return res.data;
  },

  getAdminOrders: async () => {
    const res = await apiClient.get('/orders/admin');
    return res.data;
  },

  getAdminOrderById: async (id) => {
    const res = await apiClient.get(`/orders/admin/${id}`);
    return res.data;
  }
};

/**
 * 5. Delivery Addresses APIs
 */
export const addressesApi = {
  getAll: async () => {
    const res = await apiClient.get('/addresses');
    return res.data;
  },

  create: async (addressData) => {
    const res = await apiClient.post('/addresses', addressData);
    return res.data;
  },

  update: async (id, addressData) => {
    const res = await apiClient.put(`/addresses/${id}`, addressData);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/addresses/${id}`);
    return res.data;
  },

  setDefault: async (id) => {
    const res = await apiClient.patch(`/addresses/${id}/default`);
    return res.data;
  }
};

/**
 * 6. Cart APIs
 */
export const cartApi = {
  get: async () => {
    const res = await apiClient.get('/cart');
    return res.data;
  },

  addItem: async (productId, quantity = 1) => {
    const res = await apiClient.post('/cart/items', { productId, quantity });
    return res.data;
  },

  updateQty: async (productId, quantity) => {
    const res = await apiClient.patch(`/cart/items/${productId}`, { quantity });
    return res.data;
  },

  removeItem: async (productId) => {
    const res = await apiClient.delete(`/cart/items/${productId}`);
    return res.data;
  },

  clear: async () => {
    const res = await apiClient.delete('/cart');
    return res.data;
  }
};

/**
 * 7. Wishlist APIs
 */
export const wishlistApi = {
  get: async () => {
    const res = await apiClient.get('/wishlist');
    return res.data;
  },

  toggle: async (productId) => {
    const res = await apiClient.post('/wishlist/toggle', { productId });
    return res.data;
  },

  remove: async (productId) => {
    const res = await apiClient.delete(`/wishlist/${productId}`);
    return res.data;
  }
};

/**
 * 8. Dealer Operations APIs
 */
export const dealerApi = {
  getProfile: async () => {
    const res = await apiClient.get('/dealers/profile');
    return res.data;
  },

  updateStoreSettings: async (settings) => {
    const res = await apiClient.put('/dealers/store-settings', settings);
    return res.data;
  },

  getInventory: async () => {
    const res = await apiClient.get('/inventory/my-inventory');
    return res.data;
  },

  adjustStock: async (productId, payload) => {
    const res = await apiClient.patch(`/inventory/${productId}/stock`, payload);
    return res.data;
  },

  getSettlements: async () => {
    const res = await apiClient.get('/settlements/my-settlements');
    return res.data;
  },

  getAnalytics: async () => {
    const res = await apiClient.get('/analytics/dealer');
    return res.data;
  }
};

/**
 * 9. Admin Platform APIs
 */
export const adminApi = {
  getOverview: async () => {
    const res = await apiClient.get('/analytics/admin');
    return res.data;
  },

  getDealers: async () => {
    const res = await apiClient.get('/dealers');
    return res.data;
  },

  getDealerById: async (id) => {
    const res = await apiClient.get(`/dealers/${id}`);
    return res.data;
  },

  approveDealer: async (id, payload = {}) => {
    const res = await apiClient.post(`/admin/dealers/${id}/approve`, payload);
    return res.data;
  },

  rejectDealer: async (id, reason) => {
    const res = await apiClient.post(`/admin/dealers/${id}/reject`, { reason });
    return res.data;
  },

  toggleDealerStatus: async (id, status, reason = '') => {
    const res = await apiClient.patch(`/admin/dealers/${id}/status`, { status, reason });
    return res.data;
  },

  getInventory: async () => {
    const res = await apiClient.get('/inventory/global');
    return res.data;
  },

  getLocations: async () => {
    const res = await apiClient.get('/dealer-locations');
    return res.data;
  },

  getPayments: async () => {
    const res = await apiClient.get('/payments');
    return res.data;
  },

  getSettlements: async () => {
    const res = await apiClient.get('/settlements');
    return res.data;
  },

  releaseSettlement: async (id) => {
    const res = await apiClient.post(`/settlements/${id}/release`);
    return res.data;
  },

  getComplaints: async () => {
    const res = await apiClient.get('/complaints/admin/all');
    return res.data;
  },

  updateComplaintStatus: async (ticketId, status) => {
    const res = await apiClient.patch(`/complaints/admin/${ticketId}/status`, { status });
    return res.data;
  },

  getAuditLogs: async () => {
    const res = await apiClient.get('/admin/audit-logs');
    return res.data;
  },

  getSettings: async () => {
    const res = await apiClient.get('/admin/settings');
    return res.data;
  },

  updateSettings: async (settings) => {
    const res = await apiClient.put('/admin/settings', settings);
    return res.data;
  },

  getUsers: async () => {
    const res = await apiClient.get('/users');
    return res.data;
  }
};

export default apiClient;

