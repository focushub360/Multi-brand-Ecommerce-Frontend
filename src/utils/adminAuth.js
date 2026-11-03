import adminUsers from '../data/adminUsers.json';

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
 * Validates admin credentials against the centralized admin seed data.
 * Demo credentials: admin@grove.com / Admin@123
 */
export function validateAdminCredentials(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const matchedAdmin = adminUsers.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === password
  );

  if (!matchedAdmin) {
    return { success: false, error: 'Invalid admin credentials. Please verify your email and password.' };
  }

  return { success: true, admin: matchedAdmin };
}

/**
 * Admin logout action - clears admin session and returns redirect target.
 */
export function logoutAdmin() {
  clearStoredAdmin();
  return '/admin/login';
}
