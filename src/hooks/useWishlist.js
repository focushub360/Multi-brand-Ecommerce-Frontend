import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStoredCustomer, setPendingAction, clearStoredCustomer } from '../utils/auth';
import { wishlistApi } from '../services/apiClient.js';

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

  // Synchronize wishlist with live MongoDB database
  useEffect(() => {
    const customer = getStoredCustomer();
    if (customer?.id) {
      wishlistApi.get()
        .then((res) => {
          if (Array.isArray(res?.products)) {
            const ids = res.products.map((p) => String(p._id || p.id));
            const wishlistKey = `grove_wishlist_${customer.id}`;
            localStorage.setItem(wishlistKey, JSON.stringify(ids));
            setWishlist(ids);
          }
        })
        .catch((err) => {
          if (err.status === 401) {
            clearStoredCustomer();
          } else {
            console.warn('Backend wishlist sync warning:', err.message);
          }
        });
    }

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
   * Toggles product in customer's wishlist and persists directly in database.
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
      updated = [...current, pidStr];
    }

    try {
      localStorage.setItem(wishlistKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save wishlist to localStorage', err);
    }

    setWishlist(updated);
    window.dispatchEvent(new Event('grove_wishlist_updated'));

    // Persist toggle in MongoDB database
    wishlistApi.toggle(productId)
      .then((res) => {
        // Sync fresh list from database if returned
        if (res?.productId) {
          const freshId = String(res.productId);
          if (res.action === 'added' && !updated.includes(freshId)) {
            const next = [...updated, freshId];
            localStorage.setItem(wishlistKey, JSON.stringify(next));
            setWishlist(next);
          } else if (res.action === 'removed' && updated.includes(freshId)) {
            const next = updated.filter((id) => id !== freshId);
            localStorage.setItem(wishlistKey, JSON.stringify(next));
            setWishlist(next);
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to persist wishlist item to database:', err.message);
      });

    return true;
  };

  /**
   * Explicitly removes a product from customer's wishlist in database and state.
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

    // Remove from MongoDB database
    wishlistApi.remove(productId)
      .catch((err) => {
        console.warn('Failed to remove wishlist item from database:', err.message);
      });
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
