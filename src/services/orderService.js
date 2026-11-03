/**
 * GROVE Customer Order Management Service
 * Frontend-only order persistence and management using localStorage.
 */

// Demo pre-seeded orders for Customer ID 3 (Harish Patel)
const createInitialDemoOrders = () => {
  const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();
  const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      orderId: 'GRV-923841',
      customerId: 3,
      createdAt: oneDayAgo,
      status: 'Shipped',
      trackingNumber: 'EXP-923841-IND',
      estimatedDelivery: inThreeDays,
      items: [
        {
          id: 'prod-amoled-smartwatch',
          name: 'Field Telemetry Smartwatch V4',
          price: 3999,
          originalPrice: 5899,
          quantity: 1,
          image: '/images/prod-smartwatch.png',
          category: 'Electronics & Gadgets',
          dealerId: 'DEALER_002',
          dealerName: 'Apex Machinery & Equipment',
          subtotal: 3999
        },
        {
          id: 'prod-hydraulic-shock',
          name: 'Hydraulic Coilover Shock Absorber',
          price: 3250,
          originalPrice: 4099,
          quantity: 2,
          image: '/images/prod-shockabsorber.png',
          category: 'Automotive & Spare Parts',
          dealerId: 'DEALER_002',
          dealerName: 'Apex Machinery & Equipment',
          subtotal: 6500
        }
      ],
      shippingAddress: {
        id: 'addr_demo_01',
        name: 'Harish Patel',
        mobile: '9876543210',
        pincode: '411001',
        house: 'Flat 402, Green Fields Enclave',
        street: 'Kisan Mandi Marg, Shivajinagar',
        landmark: 'Near Central Agricultural Depot',
        city: 'Pune',
        state: 'Maharashtra',
        type: 'Home'
      },
      pricing: {
        itemsTotal: 10499,
        discount: 3599,
        deliveryFee: 0,
        tax: 0,
        total: 10499
      },
      payment: {
        method: 'card',
        methodLabel: 'Credit / Debit Card',
        status: 'Completed',
        transactionId: 'TXN-CRD-772183',
        last4: '4242',
        cardBrand: 'Visa',
        paidAt: oneDayAgo
      },
      timeline: [
        {
          status: 'Order Placed',
          title: 'Order Placed & Verified',
          timestamp: oneDayAgo,
          note: 'Your order was placed successfully on GROVE.'
        },
        {
          status: 'Confirmed',
          title: 'Order Confirmed by Sellers',
          timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
          note: 'Items verified and prepared for dispatch.'
        },
        {
          status: 'Shipped',
          title: 'Dispatched via Express Cargo',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          note: 'In transit to Pune delivery facility (Tracking: EXP-923841-IND).'
        }
      ]
    },
    {
      orderId: 'GRV-849201',
      customerId: 3,
      createdAt: fourDaysAgo,
      status: 'Delivered',
      trackingNumber: 'EXP-849201-IND',
      estimatedDelivery: oneDayAgo,
      deliveredAt: oneDayAgo,
      items: [
        {
          id: 'prod-rotavator-agri',
          name: 'Heavy Duty Agro Rotavator 6 Feet',
          price: 48500,
          originalPrice: 54999,
          quantity: 1,
          image: '/images/prod-tractor.png',
          category: 'Agriculture & Farming',
          dealerId: 'DEALER_002',
          dealerName: 'Apex Machinery & Equipment',
          subtotal: 48500
        }
      ],
      shippingAddress: {
        id: 'addr_demo_01',
        name: 'Harish Patel',
        mobile: '9876543210',
        pincode: '411001',
        house: 'Flat 402, Green Fields Enclave',
        street: 'Kisan Mandi Marg, Shivajinagar',
        landmark: 'Near Central Agricultural Depot',
        city: 'Pune',
        state: 'Maharashtra',
        type: 'Home'
      },
      pricing: {
        itemsTotal: 48500,
        discount: 6499,
        deliveryFee: 0,
        tax: 0,
        total: 48500
      },
      payment: {
        method: 'upi',
        methodLabel: 'UPI Instant Payment',
        status: 'Completed',
        transactionId: 'TXN-UPI-994182',
        upiId: 'harish.patel@okhdfcbank',
        paidAt: fourDaysAgo
      },
      timeline: [
        {
          status: 'Order Placed',
          title: 'Order Placed',
          timestamp: fourDaysAgo,
          note: 'Payment received via UPI.'
        },
        {
          status: 'Confirmed',
          title: 'Seller Confirmed Order',
          timestamp: threeDaysAgo,
          note: 'Machinery inspected and crated for transport.'
        },
        {
          status: 'Shipped',
          title: 'Shipped via Heavy Haul Logistics',
          timestamp: twoDaysAgo,
          note: 'Handed over to carrier (Tracking: EXP-849201-IND).'
        },
        {
          status: 'Out for Delivery',
          title: 'Out for Delivery',
          timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
          note: 'Vehicle departed for destination address.'
        },
        {
          status: 'Delivered',
          title: 'Delivered Successfully',
          timestamp: oneDayAgo,
          note: 'Delivered and acknowledged by Harish Patel.'
        }
      ]
    }
  ];
};

/**
 * Returns all orders for a specific customer ID from localStorage.
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

    // Pre-seed demo orders for demo customer ID 3
    if (Number(customerId) === 3) {
      const seed = createInitialDemoOrders();
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }

    return [];
  } catch {
    return [];
  }
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

