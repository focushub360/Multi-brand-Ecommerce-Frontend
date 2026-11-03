import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStoredCustomer, setPendingAction } from '../utils/auth';

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

  useEffect(() => {
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
   * Adds an item to the current customer's cart.
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
        productId: product.id,
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

    const existingIdx = currentCart.findIndex((item) => String(item.id) === String(product.id));
    let updatedCart;
    if (existingIdx >= 0) {
      updatedCart = currentCart.map((item, idx) =>
        idx === existingIdx ? { ...item, quantity: item.quantity + qtyToAdd } : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, quantity: qtyToAdd }];
    }

    try {
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }

    setCart(updatedCart);
    setLastAddedItem(product);
    window.dispatchEvent(new Event('grove_cart_updated'));

    setTimeout(() => {
      setLastAddedItem(null);
    }, 3000);

    return true;
  };

  /**
   * Removes an item from the customer's cart.
   */
  const removeFromCart = (productId) => {
    const customer = getStoredCustomer();
    if (!customer?.id) return;

    const cartKey = `grove_cart_${customer.id}`;
    const pidStr = String(productId);
    const updated = cart.filter((item) => String(item.id) !== pidStr);

    try {
      localStorage.setItem(cartKey, JSON.stringify(updated));
    } catch {}

    setCart(updated);
    window.dispatchEvent(new Event('grove_cart_updated'));
  };

  /**
   * Updates item quantity in the customer's cart.
   */
  const updateQuantity = (productId, delta) => {
    const customer = getStoredCustomer();
    if (!customer?.id) return;

    const cartKey = `grove_cart_${customer.id}`;
    const pidStr = String(productId);

    const updated = cart
      .map((item) => {
        if (String(item.id) === pidStr) {
          const newQty = item.quantity + delta;
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
  };

  /**
   * Clears the current customer's cart.
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
