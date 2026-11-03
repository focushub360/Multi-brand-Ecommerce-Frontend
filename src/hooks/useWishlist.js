import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStoredCustomer, setPendingAction } from '../utils/auth';

export function useWishlist() {
  const navigate = useNavigate();
  const location = useLocation();

  const getCustomerWishlist = useCallback(() => {
    const customer = getStoredCustomer();
    if (!customer?.id) return [];
    try {
      const stored = localStorage.getItem(`grove_wishlist_${customer.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const [wishlist, setWishlist] = useState(getCustomerWishlist);

  useEffect(() => {
    const syncWishlist = () => {
      setWishlist(getCustomerWishlist());
    };

    window.addEventListener('grove_wishlist_updated', syncWishlist);
    window.addEventListener('grove_auth_changed', syncWishlist);
    window.addEventListener('storage', syncWishlist);

    return () => {
      window.removeEventListener('grove_wishlist_updated', syncWishlist);
      window.removeEventListener('grove_auth_changed', syncWishlist);
      window.removeEventListener('storage', syncWishlist);
    };
  }, [getCustomerWishlist]);

  /**
   * Toggles product in customer's wishlist.
   * If unauthenticated, blocks action, saves pending action, and redirects to /login.
   */
  const toggleWishlist = (productId) => {
    if (!productId) return false;

    const customer = getStoredCustomer();
    if (!customer?.id) {
      const currentUrl = location.pathname + location.search;
      setPendingAction({
        type: 'toggle_wishlist',
        productId,
        returnUrl: currentUrl
      });
      navigate('/login', {
        state: {
          message: 'Please log in to continue.',
          from: currentUrl
        }
      });
      return false;
    }

    const wishlistKey = `grove_wishlist_${customer.id}`;
    let current = [];
    try {
      const stored = localStorage.getItem(wishlistKey);
      current = stored ? JSON.parse(stored) : [];
    } catch {
      current = wishlist;
    }

    const pidStr = String(productId);
    const exists = current.some((id) => String(id) === pidStr);

    let updated;
    if (exists) {
      updated = current.filter((id) => String(id) !== pidStr);
    } else {
      updated = [...current, productId];
    }

    try {
      localStorage.setItem(wishlistKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save wishlist to localStorage', err);
    }

    setWishlist(updated);
    window.dispatchEvent(new Event('grove_wishlist_updated'));
    return true;
  };

  /**
   * Explicitly removes a product from customer's wishlist.
   */
  const removeFromWishlist = (productId) => {
    if (!productId) return;
    const customer = getStoredCustomer();
    if (!customer?.id) return;

    const wishlistKey = `grove_wishlist_${customer.id}`;
    let current = [];
    try {
      const stored = localStorage.getItem(wishlistKey);
      current = stored ? JSON.parse(stored) : [];
    } catch {
      current = wishlist;
    }

    const pidStr = String(productId);
    const updated = current.filter((id) => String(id) !== pidStr);

    try {
      localStorage.setItem(wishlistKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update wishlist in localStorage', err);
    }

    setWishlist(updated);
    window.dispatchEvent(new Event('grove_wishlist_updated'));
  };

  /**
   * Clears the customer's wishlist.
   */
  const clearWishlist = () => {
    const customer = getStoredCustomer();
    if (!customer?.id) return;
    const wishlistKey = `grove_wishlist_${customer.id}`;
    try {
      localStorage.removeItem(wishlistKey);
    } catch {}
    setWishlist([]);
    window.dispatchEvent(new Event('grove_wishlist_updated'));
  };

  /**
   * Checks if a product is in the current customer's wishlist.
   */
  const isWishlisted = (productId) => {
    const customer = getStoredCustomer();
    if (!customer?.id) return false;
    const pidStr = String(productId);
    return wishlist.some((id) => String(id) === pidStr);
  };

  return { 
    wishlist, 
    wishlistCount: wishlist.length,
    toggleWishlist, 
    removeFromWishlist, 
    clearWishlist, 
    isWishlisted 
  };
}
