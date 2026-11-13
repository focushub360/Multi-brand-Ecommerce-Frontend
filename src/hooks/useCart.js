import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStoredCustomer, setPendingAction, clearStoredCustomer } from '../utils/auth';
import { cartApi } from '../services/apiClient.js';

export function useCart() {
  const navigate = useNavigate();
  const location = useLocation();

  const getCustomerCart = useCallback(() => {
    const customer = getStoredCustomer();
    if (!customer?.id) return [];
    try {
      const stored = localStorage.getItem(`grove_cart_${customer.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const [cart, setCart] = useState(getCustomerCart);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  // Synchronize cart with live MongoDB database
  useEffect(() => {
    const customer = getStoredCustomer();
    if (customer?.id) {
      cartApi.get()
        .then((res) => {
          if (res?.items) {
            const cartKey = `grove_cart_${customer.id}`;
            localStorage.setItem(cartKey, JSON.stringify(res.items));
            setCart(res.items);
          }
        })
        .catch((err) => {
          if (err.status === 401) {
            clearStoredCustomer();
          } else {
            console.warn('Backend cart sync warning:', err.message);
          }
        });
    }

    const syncCart = () => {
      setCart(getCustomerCart());
    };

    window.addEventListener('grove_cart_updated', syncCart);
    window.addEventListener('grove_auth_changed', syncCart);
    window.addEventListener('storage', syncCart);

    return () => {
      window.removeEventListener('grove_cart_updated', syncCart);
      window.removeEventListener('grove_auth_changed', syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, [getCustomerCart]);

  /**
   * Adds an item to the current customer's cart and saves directly to database.
   * If unauthenticated, blocks action, saves pending action, and redirects to /login.
   */
  const addToCart = (product, quantity = 1) => {
    if (!product) return false;

    const customer = getStoredCustomer();
    if (!customer?.id) {
      const currentUrl = location.pathname + location.search;
      setPendingAction({
        type: 'add_to_cart',
        product,
        productId: product.id || product._id,
        quantity: Math.max(1, parseInt(quantity, 10) || 1),
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

    const cartKey = `grove_cart_${customer.id}`;
    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    let currentCart = [];
    try {
      const stored = localStorage.getItem(cartKey);
      currentCart = stored ? JSON.parse(stored) : [];
    } catch {
      currentCart = cart;
    }

    const targetId = String(product.id || product._id);
    const existingIdx = currentCart.findIndex((item) => String(item.id || item._id) === targetId);
    let updatedCart;
    if (existingIdx >= 0) {
      updatedCart = currentCart.map((item, idx) =>
        idx === existingIdx ? { ...item, quantity: item.quantity + qtyToAdd } : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, id: targetId, quantity: qtyToAdd }];
    }

    try {
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }

    setCart(updatedCart);
    setLastAddedItem(product);
    window.dispatchEvent(new Event('grove_cart_updated'));

    // Persist immediately in MongoDB Atlas
    cartApi.addItem(product.id || product._id, qtyToAdd)
      .then((res) => {
        if (res?.items) {
          localStorage.setItem(cartKey, JSON.stringify(res.items));
          setCart(res.items);
        }
      })
      .catch((err) => {
        console.warn('Failed to persist cart item to database:', err.message);
      });

    setTimeout(() => {
      setLastAddedItem(null);
    }, 3000);

    return true;
  };

  /**
   * Removes an item from the customer's cart in database and state.
   */
  const removeFromCart = (productId) => {
    const customer = getStoredCustomer();
    if (!customer?.id) return;

    const cartKey = `grove_cart_${customer.id}`;
    const pidStr = String(productId);
    const updated = cart.filter((item) => String(item.id || item._id) !== pidStr);

    try {
      localStorage.setItem(cartKey, JSON.stringify(updated));
    } catch {}

    setCart(updated);
    window.dispatchEvent(new Event('grove_cart_updated'));

    // Remove from MongoDB database
    cartApi.removeItem(productId)
      .then((res) => {
        if (res?.items) {
          localStorage.setItem(cartKey, JSON.stringify(res.items));
          setCart(res.items);
        }
      })
      .catch((err) => {
        console.warn('Failed to remove cart item from database:', err.message);
      });
  };

  /**
   * Updates item quantity in the customer's cart in database and state.
   */
  const updateQuantity = (productId, delta) => {
    const customer = getStoredCustomer();
    if (!customer?.id) return;

    const cartKey = `grove_cart_${customer.id}`;
    const pidStr = String(productId);

    let newTargetQty = 0;
    const updated = cart
      .map((item) => {
        if (String(item.id || item._id) === pidStr) {
          const newQty = item.quantity + delta;
          newTargetQty = newQty;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    try {
      localStorage.setItem(cartKey, JSON.stringify(updated));
    } catch {}

    setCart(updated);
    window.dispatchEvent(new Event('grove_cart_updated'));

    // Persist quantity change in MongoDB database
    if (newTargetQty > 0) {
      cartApi.updateQuantity(productId, newTargetQty)
        .then((res) => {
          if (res?.items) {
            localStorage.setItem(cartKey, JSON.stringify(res.items));
            setCart(res.items);
          }
        })
        .catch((err) => {
          console.warn('Failed to update cart quantity in database:', err.message);
        });
    } else {
      cartApi.removeItem(productId)
        .then((res) => {
          if (res?.items) {
            localStorage.setItem(cartKey, JSON.stringify(res.items));
            setCart(res.items);
          }
        })
        .catch((err) => {
          console.warn('Failed to delete zero-quantity cart item from database:', err.message);
        });
    }
  };

  /**
   * Clears the current customer's cart in database and state.
   */
  const clearCart = () => {
    const customer = getStoredCustomer();
    if (!customer?.id) return;

    const cartKey = `grove_cart_${customer.id}`;
    try {
      localStorage.removeItem(cartKey);
    } catch {}

    setCart([]);
    window.dispatchEvent(new Event('grove_cart_updated'));

    // Clear cart in MongoDB database
    cartApi.clear()
      .catch((err) => {
        console.warn('Failed to clear cart in database:', err.message);
      });
  };

  const totalCartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  return { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalCartCount, 
    lastAddedItem 
  };
}
