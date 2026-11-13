import { authApi } from '../services/apiClient.js';

export const ADMIN_AUTH_STORAGE_KEY = 'grove_admin_user';

/**
 * Retrieves the currently logged-in admin from localStorage.
 * Returns null if not authenticated or if JSON is invalid.
 */
export function getStoredAdmin() {
  try {
    const raw = localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
    if (!raw) return null;
    const admin = JSON.parse(raw);
    return admin && typeof admin === 'object' ? admin : null;
  } catch {
    return null;
  }
}

/**
 * Saves authenticated admin information to localStorage.
 * Strictly excludes password to ensure secure storage.
 */
export function setStoredAdmin(admin) {
  try {
    if (!admin) return;
    const { id, name, email, role, department, avatar, lastLogin } = admin;
    const sanitized = { 
      id, 
      name, 
      email, 
      role: role || 'Super Admin', 
      department: department || 'Platform Operations',
      avatar: avatar || 'GA',
      lastLogin: lastLogin || 'Just now',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (e) {
    console.error('Error storing admin session:', e);
  }
}

/**
 * Clears ONLY the admin user session from localStorage.
 * Never clears or interferes with customer or dealer session (grove_current_user).
 */
export function clearStoredAdmin() {
  try {
    localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event('grove_admin_auth_changed'));
  } catch (e) {
    console.error('Error clearing admin session:', e);
  }
}

/**
 * Checks if a valid admin session is active.
 * Strictly checks the dedicated grove_admin_user storage key.
 */
export function isAdminAuthenticated() {
  const admin = getStoredAdmin();
  return Boolean(admin && admin.email && admin.id && (admin.role === 'admin' || admin.role?.toLowerCase().includes('admin')));
}

/**
 * Validates admin credentials directly against the live backend API.
 * All credentials are authenticated strictly via the database.
 */
export async function validateAdminCredentials(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const apiRes = await authApi.login(cleanEmail, password);
    if (apiRes?.user) {
      const backendUser = apiRes.user;
      if (backendUser.role !== 'SUPER_ADMIN') {
        return { success: false, error: 'Access denied: Super Admin credentials required.' };
      }

      const adminObj = {
        id: backendUser.id || backendUser._id,
        name: backendUser.name,
        email: backendUser.email,
        role: 'Super Admin',
        department: 'Platform Operations',
        avatar: backendUser.avatar || 'GA',
        lastLogin: 'Just now',
        loginTime: new Date().toISOString(),
        token: apiRes.accessToken
      };

      setStoredAdmin(adminObj);
      return { success: true, admin: adminObj };
    }
    return { success: false, error: 'Authentication failed. Please verify your credentials.' };
  } catch (apiErr) {
    if (apiErr.status === 401 || apiErr.status === 400 || apiErr.status === 403) {
      return { success: false, error: apiErr.message || 'Invalid admin credentials.' };
    }
    return { success: false, error: apiErr.message || 'Unable to connect to authentication server. Please try again.' };
  }
}

/**
 * Admin logout action - clears admin session and returns redirect target.
 */
export function logoutAdmin() {
  clearStoredAdmin();
  return '/admin/login';
}
