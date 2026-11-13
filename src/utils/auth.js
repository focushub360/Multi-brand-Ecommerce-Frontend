import { authApi, cartApi, wishlistApi } from '../services/apiClient.js';

// Dedicated localStorage keys for strict role and feature isolation
export const CUSTOMER_AUTH_KEY = 'grove_current_user';
export const DEALER_AUTH_KEY = 'grove_dealer_user';
export const PENDING_ACTION_KEY = 'grove_pending_action';

// Legacy export for backward compatibility
export const AUTH_STORAGE_KEY = CUSTOMER_AUTH_KEY;

/* ==========================================================================
   1. CUSTOMER SESSION MANAGEMENT (grove_current_user)
   ========================================================================== */

/**
 * Retrieves the currently logged-in customer session.
 * Strictly validates that the stored session belongs to role 'customer'.
 * Returns sanitized object { id, name, email, role: 'customer' } or null.
 */
export function getStoredCustomer() {
  try {
    const raw = localStorage.getItem(CUSTOMER_AUTH_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user && typeof user === 'object' && user.role === 'customer' && user.id) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'customer',
        token: user.token || localStorage.getItem('grove_auth_token')
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Stores authenticated customer session in localStorage.
 * Strictly excludes plaintext passwords.
 */
export function setStoredCustomer(customer) {
  try {
    if (!customer) return;
    const sanitized = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      role: 'customer',
      token: customer.token
    };
    localStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify(sanitized));
    if (customer.token) {
      localStorage.setItem('grove_auth_token', customer.token);
    }
    window.dispatchEvent(new Event('grove_auth_changed'));
  } catch (err) {
    console.error('Failed to store customer session', err);
  }
}

/**
 * Clears only the customer session from localStorage.
 * Preserves dealer and admin sessions.
 */
export function clearStoredCustomer() {
  try {
    localStorage.removeItem(CUSTOMER_AUTH_KEY);
    localStorage.removeItem('grove_auth_token');
    window.dispatchEvent(new Event('grove_auth_changed'));
  } catch (err) {
    console.error('Failed to clear customer session', err);
  }
}

/**
 * Checks whether an authenticated customer session is currently active.
 */
export function isCustomerAuthenticated() {
  return Boolean(getStoredCustomer());
}

/* ==========================================================================
   2. DEALER SESSION MANAGEMENT (grove_dealer_user)
   ========================================================================== */

/**
 * Retrieves the currently logged-in dealer session.
 * Strictly validates that the stored session belongs to role 'dealer'.
 * Automatically resolves dealerId if missing.
 */
export function getStoredDealer() {
  try {
    // 1. Check primary dealer storage key
    const raw = localStorage.getItem(DEALER_AUTH_KEY);
    if (raw) {
      const dealer = JSON.parse(raw);
      if (dealer && typeof dealer === 'object' && dealer.role === 'dealer' && dealer.id) {
        return dealer;
      }
    }

    // 2. Check legacy key if dealer previously authenticated there
    const legacyRaw = localStorage.getItem(CUSTOMER_AUTH_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      if (legacy && typeof legacy === 'object' && legacy.role === 'dealer') {
        return legacy;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Stores authenticated dealer session in localStorage.
 * Ensures dealerId is always resolved and present. Strictly excludes password.
 */
export function setStoredDealer(dealer) {
  try {
    if (!dealer) return;
    const lowerEmail = (dealer.email || '').toLowerCase();
    const resolvedDealerId = dealer.dealerId || (
      lowerEmail.includes('dealer2') ? 'DEALER_002' :
      lowerEmail.includes('dealer3') ? 'DEALER_003' :
      lowerEmail.includes('dealer4') ? 'DEALER_004' :
      (lowerEmail.includes('hub') || lowerEmail.includes('kisan')) ? 'DEALER_002' :
      'DEALER_001'
    );

    const sanitized = {
      id: dealer.id,
      name: dealer.name,
      email: dealer.email,
      role: 'dealer',
      dealerId: resolvedDealerId,
      primaryCategory: dealer.primaryCategory || null,
      token: dealer.token
    };

    localStorage.setItem(DEALER_AUTH_KEY, JSON.stringify(sanitized));
    if (dealer.token) {
      localStorage.setItem('grove_auth_token', dealer.token);
    }

    // Clear legacy storage if dealer was saved in customer slot
    try {
      const legacyRaw = localStorage.getItem(CUSTOMER_AUTH_KEY);
      if (legacyRaw) {
        const legacy = JSON.parse(legacyRaw);
        if (legacy?.role === 'dealer') {
          localStorage.removeItem(CUSTOMER_AUTH_KEY);
        }
      }
    } catch {}

    window.dispatchEvent(new Event('grove_dealer_auth_changed'));
  } catch (err) {
    console.error('Failed to store dealer session', err);
  }
}

/**
 * Clears only the dealer session from localStorage.
 * Preserves customer and admin sessions.
 */
export function clearStoredDealer() {
  try {
    localStorage.removeItem(DEALER_AUTH_KEY);
    localStorage.removeItem('grove_auth_token');
    try {
      const legacyRaw = localStorage.getItem(CUSTOMER_AUTH_KEY);
      if (legacyRaw) {
        const legacy = JSON.parse(legacyRaw);
        if (legacy?.role === 'dealer') {
          localStorage.removeItem(CUSTOMER_AUTH_KEY);
        }
      }
    } catch {}
    window.dispatchEvent(new Event('grove_dealer_auth_changed'));
  } catch (err) {
    console.error('Failed to clear dealer session', err);
  }
}

/**
 * Checks whether an authenticated dealer session is currently active.
 */
export function isDealerAuthenticated() {
  return Boolean(getStoredDealer());
}

/**
 * Returns the currently active dealer ID ('DEALER_001', 'DEALER_002', etc.)
 * Defaults to 'DEALER_001' if unauthenticated.
 */
export function getActiveDealerId() {
  const dealer = getStoredDealer();
  if (dealer?.dealerId) return dealer.dealerId;
  return 'DEALER_001';
}

/* ==========================================================================
   3. GENERIC / BACKWARD-COMPATIBLE UTILITIES
   ========================================================================== */

/**
 * Generic getter used across legacy components.
 * Prioritizes dealer on dealer views, or customer on marketplace views.
 */
export function getStoredUser() {
  return getStoredDealer() || getStoredCustomer() || null;
}

/**
 * Generic setter delegating by role.
 */
export function setStoredUser(user) {
  if (!user) return;
  if (user.role === 'dealer') {
    setStoredDealer(user);
  } else if (user.role === 'customer') {
    setStoredCustomer(user);
  }
}

/**
 * Generic clear clearing active session.
 */
export function clearStoredUser() {
  clearStoredDealer();
  clearStoredCustomer();
}

export function isAuthenticated() {
  return Boolean(getStoredCustomer() || getStoredDealer());
}

export function getUserRole() {
  return getStoredCustomer()?.role || getStoredDealer()?.role || null;
}

/* ==========================================================================
   4. PENDING ACTION PRESERVATION & EXECUTION
   ========================================================================== */

/**
 * Retrieves the pending shopping action saved before login redirect.
 */
export function getPendingAction() {
  try {
    const raw = localStorage.getItem(PENDING_ACTION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Saves a pending shopping action (Add to Cart, Wishlist, Buy Now) for execution after login.
 */
export function setPendingAction(action) {
  try {
    if (!action) return;
    localStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(action));
  } catch {}
}

/**
 * Clears the pending shopping action.
 */
export function clearPendingAction() {
  try {
    localStorage.removeItem(PENDING_ACTION_KEY);
  } catch {}
}

/**
 * Executes pending action for the newly authenticated customer.
 * Saves to customer-specific cart or wishlist, clears pending action,
 * and returns the intended destination URL.
 */
export function executePendingAction(customer) {
  if (!customer?.id) return null;
  const pending = getPendingAction();
  if (!pending) return null;

  // Immediately clear to prevent duplicate execution
  clearPendingAction();

  const cartKey = `grove_cart_${customer.id}`;
  const wishlistKey = `grove_wishlist_${customer.id}`;

  if (pending.type === 'buy_now') {
    const product = pending.product;
    const qty = Math.max(1, parseInt(pending.quantity, 10) || 1);
    if (product) {
      try {
        sessionStorage.setItem('grove_buynow_item', JSON.stringify({ product, quantity: qty }));
      } catch {}
      return '/checkout?mode=buynow';
    }
  } else if (pending.type === 'add_to_cart') {
    const product = pending.product;
    const qtyToAdd = Math.max(1, parseInt(pending.quantity, 10) || 1);

    if (product) {
      let currentCart = [];
      try {
        const stored = localStorage.getItem(cartKey);
        currentCart = stored ? JSON.parse(stored) : [];
      } catch {
        currentCart = [];
      }

      const existingIdx = currentCart.findIndex((i) => String(i.id) === String(product.id));
      if (existingIdx >= 0) {
        currentCart[existingIdx].quantity += qtyToAdd;
      } else {
        currentCart.push({ ...product, quantity: qtyToAdd });
      }

      try {
        localStorage.setItem(cartKey, JSON.stringify(currentCart));
        window.dispatchEvent(new Event('grove_cart_updated'));
      } catch {}

      cartApi.addItem(product.id || product._id, qtyToAdd).catch(() => {});
    }
  } else if (pending.type === 'toggle_wishlist') {
    const productId = pending.productId;
    if (productId) {
      let currentWishlist = [];
      try {
        const stored = localStorage.getItem(wishlistKey);
        currentWishlist = stored ? JSON.parse(stored) : [];
      } catch {
        currentWishlist = [];
      }

      const pidStr = String(productId);
      if (!currentWishlist.some((id) => String(id) === pidStr)) {
        currentWishlist.push(productId);
        try {
          localStorage.setItem(wishlistKey, JSON.stringify(currentWishlist));
          window.dispatchEvent(new Event('grove_wishlist_updated'));
        } catch {}

        wishlistApi.toggle(productId).catch(() => {});
      }
    }
  }

  return pending.returnUrl || null;
}

/* ==========================================================================
   5. AUTHENTICATION SERVICE (Backend MongoDB API)
   ========================================================================== */

/**
 * Authenticates user credentials directly against the live MongoDB backend API.
 * All credentials are authenticated strictly via the database.
 */
export async function authenticateUser(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const apiRes = await authApi.login(cleanEmail, password);
    if (apiRes?.user) {
      const backendUser = apiRes.user;
      let role = 'customer';
      if (backendUser.role === 'SUPER_ADMIN') role = 'admin';
      else if (backendUser.role === 'DEALER') role = 'dealer';
      else if (backendUser.role === 'USER') role = 'customer';

      const userObj = {
        id: backendUser.id || backendUser._id,
        name: backendUser.name,
        email: backendUser.email,
        role,
        dealerId: apiRes.dealer?.dealerCode || backendUser.dealerCode || (role === 'dealer' ? (
          backendUser.email?.includes('dealer2') ? 'DEALER_002' :
          backendUser.email?.includes('dealer3') ? 'DEALER_003' :
          backendUser.email?.includes('dealer4') ? 'DEALER_004' :
          'DEALER_001'
        ) : undefined),
        primaryCategory: apiRes.dealer?.primaryCategoryName || null,
        token: apiRes.accessToken
      };

      return { success: true, user: userObj, token: apiRes.accessToken };
    }
    return { success: false, error: 'Invalid email or password. Please verify your credentials.' };
  } catch (apiErr) {
    if (apiErr.status === 401 || apiErr.status === 400) {
      return { success: false, error: apiErr.message || 'Invalid email or password.' };
    }
    return { success: false, error: apiErr.message || 'Unable to connect to authentication server. Please try again.' };
  }
}
