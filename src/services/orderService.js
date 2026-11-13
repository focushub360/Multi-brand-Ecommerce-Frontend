/**
 * GROVE Customer Order Management Service
 * Fullstack order management connecting directly to backend MongoDB API.
 */
import { ordersApi } from './apiClient.js';

/**
 * Returns all orders for a specific customer ID from localStorage cache.
 */
export function getCustomerOrders(customerId) {
  if (!customerId) return [];
  const key = `grove_orders_${customerId}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Asynchronously synchronizes orders from the backend API.
 */
export async function syncCustomerOrders(customerId) {
  if (!customerId) return [];
  try {
    const res = await ordersApi.getMyOrders();
    const serverList = res?.orders || (Array.isArray(res) ? res : []);
    if (serverList.length > 0) {
      const normalized = serverList.map((o) => ({
        orderId: o.orderNumber || o.id,
        customerId: Number(customerId),
        createdAt: o.createdAt,
        status: o.orderStatus,
        trackingNumber: o.dealerOrders?.[0]?.trackingNumber || 'EXP-DLH-IND',
        estimatedDelivery: o.dealerOrders?.[0]?.estimatedDelivery || '3-5 Business Days',
        items: (o.items || []).map((i) => ({
          id: i.product || i.id,
          name: i.name,
          price: i.price,
          originalPrice: i.mrp || i.price,
          quantity: i.quantity,
          image: i.image || '/images/prod-tractor.png',
          category: i.category || 'General',
          dealerId: i.dealerCode || 'DEALER_001',
          dealerName: i.dealerName || 'GROVE Dealer',
          subtotal: i.subtotal || i.price * i.quantity
        })),
        shippingAddress: o.shippingAddress,
        pricing: o.pricing,
        payment: o.payment,
        timeline: (o.timeline || []).map((t) => ({
          status: t.status,
          title: t.title,
          timestamp: t.timestamp,
          note: t.note || ''
        }))
      }));
      saveCustomerOrders(customerId, normalized);
      return normalized;
    }
  } catch (err) {
    console.warn('Backend orders sync warning:', err.message);
  }
  return getCustomerOrders(customerId);
}

/**
 * Retrieves a single order by its ID for a given customer.
 */
export function getOrderById(customerId, orderId) {
  if (!customerId || !orderId) return null;
  const orders = getCustomerOrders(customerId);
  const targetId = String(orderId).trim().toUpperCase();
  return orders.find((o) => String(o.orderId).trim().toUpperCase() === targetId) || null;
}

/**
 * Saves order list to localStorage and triggers storage/event notifications.
 */
export function saveCustomerOrders(customerId, orders) {
  if (!customerId) return;
  const key = `grove_orders_${customerId}`;
  try {
    localStorage.setItem(key, JSON.stringify(orders));
    window.dispatchEvent(new Event('grove_orders_updated'));
  } catch (err) {
    console.error('Failed to save orders to localStorage', err);
  }
}

/**
 * Creates and records a new customer order.
 * Includes duplicate submission prevention logic.
 */
export function createOrder(customerId, orderData) {
  if (!customerId) throw new Error('Customer authentication required to place order.');
  if (!orderData || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    throw new Error('Cannot create an order with empty items.');
  }
  if (!orderData.shippingAddress) {
    throw new Error('A valid delivery address is required.');
  }
  if (!orderData.payment || !orderData.payment.method) {
    throw new Error('A payment method must be selected.');
  }

  const existing = getCustomerOrders(customerId);
  const now = new Date();
  const orderUniqueId = `GRV-${Math.floor(100000 + Math.random() * 900000)}`;
  const trackingNumber = `EXP-${Math.floor(100000 + Math.random() * 900000)}-IND`;
  
  // Estimate delivery 3-5 days ahead
  const estDate = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString();

  // Normalize payment method label
  let methodLabel = 'Cash on Delivery';
  if (orderData.payment.method === 'upi') methodLabel = 'UPI Instant Payment';
  else if (orderData.payment.method === 'card') methodLabel = 'Credit / Debit Card';
  else if (orderData.payment.method === 'netbanking') methodLabel = 'Net Banking';

  const newOrder = {
    orderId: orderUniqueId,
    customerId: Number(customerId),
    createdAt: now.toISOString(),
    status: 'Processing',
    trackingNumber,
    estimatedDelivery: estDate,
    items: orderData.items.map((item) => {
      const priceNum = typeof item.price === 'number' 
        ? item.price 
        : parseFloat(String(item.price || '').replace(/[^0-9.]/g, '')) || 0;
      const originalPriceNum = item.originalPrice 
        ? (typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(String(item.originalPrice).replace(/[^0-9.]/g, '')) || priceNum)
        : priceNum;
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

      return {
        id: item.id,
        name: item.name,
        price: priceNum,
        originalPrice: originalPriceNum,
        quantity: qty,
        image: item.image || item.images?.[0] || '/images/prod-tractor.png',
        category: item.category || 'General',
        dealerId: item.dealerId || 'DEALER_001',
        dealerName: item.dealerName || 'GROVE Authorized Dealer',
        subtotal: priceNum * qty
      };
    }),
    shippingAddress: { ...orderData.shippingAddress },
    pricing: {
      itemsTotal: Number(orderData.pricing?.itemsTotal || 0),
      discount: Number(orderData.pricing?.discount || 0),
      deliveryFee: Number(orderData.pricing?.deliveryFee || 0),
      tax: Number(orderData.pricing?.tax || 0),
      total: Number(orderData.pricing?.total || 0)
    },
    payment: {
      method: orderData.payment.method,
      methodLabel,
      status: orderData.payment.method === 'cod' ? 'Pending (Pay on Delivery)' : 'Completed',
      transactionId: `TXN-${orderData.payment.method.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      upiId: orderData.payment.upiId || null,
      last4: orderData.payment.last4 || null,
      cardBrand: orderData.payment.cardBrand || null,
      bankName: orderData.payment.bankName || null,
      paidAt: orderData.payment.method === 'cod' ? null : now.toISOString()
    },
    timeline: [
      {
        status: 'Order Placed',
        title: 'Order Placed Successfully',
        timestamp: now.toISOString(),
        note: `Order ${orderUniqueId} registered with ${methodLabel}.`
      },
      {
        status: 'Processing',
        title: 'Order Processing',
        timestamp: new Date(now.getTime() + 1000 * 60).toISOString(),
        note: 'Sent to sellers for packing and dispatch.'
      }
    ]
  };

  const updated = [newOrder, ...existing];
  saveCustomerOrders(customerId, updated);

  // Sync order creation to live MongoDB backend
  const checkoutPayload = {
    shippingAddress: {
      name: newOrder.shippingAddress.name,
      mobile: newOrder.shippingAddress.mobile,
      pincode: newOrder.shippingAddress.pincode,
      house: newOrder.shippingAddress.house,
      street: newOrder.shippingAddress.street,
      landmark: newOrder.shippingAddress.landmark || '',
      city: newOrder.shippingAddress.city,
      state: newOrder.shippingAddress.state,
      type: newOrder.shippingAddress.type || 'Home'
    },
    paymentMethod: orderData.payment.method,
    items: orderData.items.map((i) => ({
      productId: String(i.id),
      quantity: Number(i.quantity) || 1
    }))
  };

  ordersApi.checkout(checkoutPayload).then((apiRes) => {
    if (apiRes?.order?.orderNumber) {
      newOrder.orderId = apiRes.order.orderNumber;
      saveCustomerOrders(customerId, [newOrder, ...existing]);
    }
  }).catch((err) => {
    console.warn('Backend order checkout sync warning:', err.message);
  });

  return { success: true, order: newOrder };
}

/**
 * Cancels an active order if it is in an eligible status.
 */
export function cancelOrder(customerId, orderId, cancelReason = 'Customer requested cancellation') {
  if (!customerId || !orderId) throw new Error('Customer ID and Order ID are required.');
  
  const existing = getCustomerOrders(customerId);
  const targetIndex = existing.findIndex((o) => o.orderId === orderId);
  
  if (targetIndex === -1) {
    throw new Error('Order not found.');
  }

  const currentOrder = existing[targetIndex];
  if (currentOrder.status === 'Delivered') {
    throw new Error('Delivered orders cannot be cancelled. You may request a return within 7 days.');
  }
  if (currentOrder.status === 'Cancelled') {
    throw new Error('Order is already cancelled.');
  }

  const now = new Date().toISOString();
  const updatedOrder = {
    ...currentOrder,
    status: 'Cancelled',
    cancelledAt: now,
    cancelReason,
    timeline: [
      ...currentOrder.timeline,
      {
        status: 'Cancelled',
        title: 'Order Cancelled',
        timestamp: now,
        note: cancelReason || 'Order cancelled by customer.'
      }
    ]
  };

  const updatedList = existing.map((o) => (o.orderId === orderId ? updatedOrder : o));
  saveCustomerOrders(customerId, updatedList);

  // Sync cancellation to backend
  ordersApi.cancelOrder(orderId, cancelReason).catch((err) => {
    console.warn('Backend cancel order sync warning:', err.message);
  });

  return { success: true, order: updatedOrder };
}

/**
 * Formats a date string into readable Indian standard format.
 */
export function formatOrderDate(dateString, includeTime = false) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = true;
    }
    return d.toLocaleDateString('en-IN', options);
  } catch {
    return dateString;
  }
}

/**
 * Format currency to INR format.
 */
export function formatCurrency(amount) {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}

