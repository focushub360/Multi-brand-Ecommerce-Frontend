import { adminApi, productsApi, ordersApi, categoriesApi } from './apiClient.js';

const defaultDashboardData = {
  kpis: {
    grossMerchandiseValue: '₹4,82,50,000',
    grossMerchandiseValueRaw: 48250000,
    gmvTrendPercentage: '+14.2%',
    activeDealers: 12,
    activeDealersTrend: '+2 this month',
    totalOrders: 1420,
    totalOrdersTrend: '+8.5%',
    slaFulfillmentRate: '98.6%',
    slaTrend: '+0.4%',
    pendingKYCApprovals: 3,
    openDisputes: 5
  },
  salesOverview: {
    '30D': { totalSales: 48250000, orders: 1420, averageOrderValue: 33978 },
    '90D': { totalSales: 138500000, orders: 4120, averageOrderValue: 33616 },
    '1Y': { totalSales: 542000000, orders: 16800, averageOrderValue: 32261 }
  },
  revenueTrend: [
    { month: 'Jan', revenue: 3200000, orders: 95 },
    { month: 'Feb', revenue: 3800000, orders: 110 },
    { month: 'Mar', revenue: 4500000, orders: 130 },
    { month: 'Apr', revenue: 4200000, orders: 120 },
    { month: 'May', revenue: 5100000, orders: 150 },
    { month: 'Jun', revenue: 5800000, orders: 170 }
  ],
  orderStatusSummary: {
    placed: 12,
    confirmed: 18,
    processing: 25,
    shipped: 32,
    delivered: 1320,
    cancelled: 13
  },
  topSellingProducts: [],
  dealerPerformance: [],
  recentOrders: [],
  recentTickets: []
};

const defaultAdminSettings = {
  general: {
    platformName: 'GROVE Multi-Brand Marketplace',
    supportEmail: 'support@grove.com',
    helplineNumber: '+91 1800 200 4567',
    defaultCurrency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST)',
    maintenanceMode: false
  },
  commissions: {
    defaultCommissionRate: 5.0,
    agricultureCommissionRate: 4.5,
    electronicsCommissionRate: 7.0,
    automotiveCommissionRate: 6.0,
    payoutCycleDays: 7,
    autoApproveKYC: false
  },
  security: {
    twoFactorAdmin: true,
    sessionTimeoutMinutes: 60,
    passwordExpirationDays: 90,
    enforceStrongPasswords: true
  }
};

const STORAGE_KEYS = {
  DASHBOARD_DATA: 'grove_admin_dashboard_data',
  DEALERS_LIST: 'grove_admin_dealers_list',
  PRODUCTS_LIST: 'grove_admin_products_list',
  ORDERS_LIST: 'grove_admin_orders_list',
  CUSTOMERS_LIST: 'grove_admin_customers_list',
  LOCATIONS_LIST: 'grove_admin_locations_list',
  CATEGORIES_LIST: 'grove_admin_categories_list',
  ANALYTICS_DATA: 'grove_admin_analytics_data',
  PAYMENTS_DATA: 'grove_admin_payments_data',
  SUPPORT_TICKETS: 'grove_admin_support_tickets',
  REPORTS_DATA: 'grove_admin_reports_data',
  SETTINGS_DATA: 'grove_admin_settings_data',
  INVENTORY_LOGS: 'grove_admin_inventory_logs'
};

/**
 * Asynchronously synchronizes all admin collections from the live backend MongoDB API.
 */
export async function syncAdminDataFromApi() {
  try {
    const [dealersRes, prodsRes, ordersRes, catsRes, locsRes, setsRes, complsRes, logsRes, settingsRes, usersRes] =
      await Promise.allSettled([
        adminApi.getDealers(),
        productsApi.getAll({ limit: 100 }),
        ordersApi.getAdminOrders(),
        categoriesApi.getAll(),
        adminApi.getLocations(),
        adminApi.getSettlements(),
        adminApi.getComplaints(),
        adminApi.getAuditLogs(),
        adminApi.getSettings(),
        adminApi.getUsers()
      ]);

    if (dealersRes.status === 'fulfilled') {
      const dealers = dealersRes.value?.dealers || (Array.isArray(dealersRes.value) ? dealersRes.value : []);
      if (dealers.length > 0) {
        saveAdminDealers(dealers.map((d) => ({
          ...d,
          id: d.dealerCode || d.id || d._id,
          status: d.status === 'APPROVED' ? 'Active' : d.status === 'PENDING' ? 'Pending KYC' : 'Suspended'
        })));
      }
    }

    if (prodsRes.status === 'fulfilled') {
      const prods = prodsRes.value?.products || prodsRes.value?.data?.products || prodsRes.value?.data || (Array.isArray(prodsRes.value) ? prodsRes.value : []);
      if (prods.length > 0) {
        saveAdminProducts(prods.map((p) => ({
          ...p,
          id: p.id || p._id,
          category: p.categoryName || p.category,
          dealerId: p.dealerCode || 'DEALER_001',
          stock: p.stock,
          price: p.price,
          mrp: p.mrp || p.price
        })));
      }
    }

    if (ordersRes.status === 'fulfilled') {
      const orders = ordersRes.value?.orders || (Array.isArray(ordersRes.value) ? ordersRes.value : []);
      if (orders.length > 0) {
        saveAdminOrders(orders.map((o) => ({
          ...o,
          id: o.orderNumber || o.id,
          amount: o.pricing?.total || o.amount,
          amountFormatted: `₹${Number(o.pricing?.total || o.amount || 0).toLocaleString('en-IN')}`,
          orderStatus: o.orderStatus,
          paymentStatus: o.payment?.status === 'Completed' ? 'Paid' : 'Pending',
          date: o.createdAt
        })));
      }
    }

    if (catsRes.status === 'fulfilled') {
      const categories = catsRes.value?.categories || (Array.isArray(catsRes.value) ? catsRes.value : []);
      if (categories.length > 0) {
        saveAdminCategories(categories.map((c) => ({
          ...c,
          id: c.slug || c.id || c._id
        })));
      }
    }

    if (locsRes.status === 'fulfilled') {
      const locs = locsRes.value?.locations || (Array.isArray(locsRes.value) ? locsRes.value : []);
      if (locs.length > 0) {
        saveAdminLocations(locs.map((l) => ({
          ...l,
          id: l.hubCode || l.id || l._id
        })));
      }
    }

    if (complsRes.status === 'fulfilled') {
      const tickets = complsRes.value?.tickets || (Array.isArray(complsRes.value) ? complsRes.value : []);
      if (tickets.length > 0) {
        saveAdminSupportTickets(tickets.map((t) => ({
          ...t,
          id: t.ticketId || t.id || t._id
        })));
      }
    }

    if (logsRes.status === 'fulfilled') {
      const logs = logsRes.value?.auditLogs || (Array.isArray(logsRes.value) ? logsRes.value : []);
      if (logs.length > 0) {
        const current = getAdminReportsData();
        saveAdminReportsData({
          ...current,
          auditLogs: logs.map((l) => ({
            ...l,
            id: l.logId || l.id || l._id,
            timestamp: l.createdAt || 'Today'
          }))
        });
      }
    }

    if (settingsRes.status === 'fulfilled' && settingsRes.value?.settings) {
      saveAdminSettings(settingsRes.value.settings);
    }

    if (usersRes.status === 'fulfilled') {
      const users = usersRes.value?.users || (Array.isArray(usersRes.value) ? usersRes.value : []);
      if (users.length > 0) {
        saveAdminCustomers(users.map((u) => ({
          ...u,
          id: u.id || u._id,
          name: u.name,
          email: u.email,
          phone: u.phone || '—',
          status: u.isActive !== false ? 'Active' : 'Suspended',
          ordersCount: u.ordersCount || 0,
          totalSpent: u.totalSpent || 0
        })));
      }
    }
  } catch (err) {
    console.warn('Backend admin sync warning:', err.message);
  }
}

// ==========================================
// 1. DASHBOARD OVERVIEW SERVICE
// ==========================================

export function getAdminDashboardData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DASHBOARD_DATA);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && parsed.kpis) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading admin dashboard data:', e);
  }
  return defaultDashboardData;
}

export function saveAdminDashboardData(data) {
  try {
    localStorage.setItem(STORAGE_KEYS.DASHBOARD_DATA, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving admin dashboard data:', e);
  }
}

export function getAdminKPIs() {
  const data = getAdminDashboardData();
  return data.kpis;
}

export function getAdminSalesOverview(range = '30D') {
  const data = getAdminDashboardData();
  const salesByRange = data.salesOverview || {};
  return salesByRange[range] || salesByRange['30D'];
}

export function getAdminRevenueTrend() {
  const data = getAdminDashboardData();
  return data.revenueTrend || [];
}

export function getAdminOrderStatusSummary() {
  const data = getAdminDashboardData();
  return data.orderStatusSummary || [];
}

export function getAdminTopSellingProducts() {
  const data = getAdminDashboardData();
  return data.topSellingProducts || [];
}

export function getAdminDealerPerformance() {
  const data = getAdminDashboardData();
  return data.dealerPerformance || [];
}

export function getAdminRecentOrders() {
  const data = getAdminDashboardData();
  return data.recentOrders || [];
}

export function getAdminRecentTickets() {
  const data = getAdminDashboardData();
  return data.recentTickets || [];
}

// ==========================================
// 2. DEALER MANAGEMENT SERVICE
// ==========================================

export function getAdminDealers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DEALERS_LIST);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading admin dealers:', e);
  }
  return [];
}

export function saveAdminDealers(dealers) {
  try {
    localStorage.setItem(STORAGE_KEYS.DEALERS_LIST, JSON.stringify(dealers));
  } catch (e) {
    console.error('Error saving admin dealers:', e);
  }
}

export function getAdminDealerById(id) {
  const dealers = getAdminDealers();
  return dealers.find((d) => d.id === id) || null;
}

export function createAdminDealer(dealerData) {
  const dealers = getAdminDealers();
  const nextNumber = dealers.length + 1;
  const newId = `DEALER_${String(nextNumber).padStart(3, '0')}`;

  const newDealer = {
    id: newId,
    businessName: dealerData.businessName || 'New Agro Dealership Enterprise',
    contactPerson: dealerData.contactPerson || 'Authorized Representative',
    email: dealerData.email || 'dealer@grove.com',
    phone: dealerData.phone || '+91 98000 00000',
    city: dealerData.city || 'Pune',
    state: dealerData.state || 'Maharashtra',
    pincode: dealerData.pincode || '411001',
    warehouseAddress: dealerData.warehouseAddress || `${dealerData.city || 'Pune'} Regional Logistics Depot`,
    gstin: (dealerData.gstin || '27XXXXX0000X0Z0').toUpperCase(),
    pan: (dealerData.pan || 'XXXXX0000X').toUpperCase(),
    tier: dealerData.tier || 'Bronze Tier',
    status: dealerData.status || 'Pending KYC',
    commissionRate: parseFloat(dealerData.commissionRate) || 5.0,
    activeListings: 0,
    totalOrders: 0,
    grossRevenue: '₹0',
    grossRevenueNumeric: 0,
    fulfillmentSLA: '100.0%',
    payoutHold: dealerData.status === 'Pending KYC',
    bankDetails: {
      accountName: dealerData.bankAccountName || dealerData.businessName || 'Merchant Enterprise Account',
      accountNumber: dealerData.bankAccountNumber || '—',
      ifsc: (dealerData.bankIfsc || '—').toUpperCase(),
      bankName: dealerData.bankName || 'State Bank of India'
    },
    kycDocuments: [
      { name: 'GSTIN Registration Certificate', status: dealerData.status === 'Active' ? 'Verified' : 'Under Review', uploadDate: 'Just now' },
      { name: 'Bank Cancelled Cheque', status: dealerData.status === 'Active' ? 'Verified' : 'Under Review', uploadDate: 'Just now' },
      { name: 'Warehouse Lease Deed', status: dealerData.status === 'Active' ? 'Verified' : 'Pending Upload', uploadDate: '—' }
    ],
    joinedDate: 'Today'
  };

  const updated = [newDealer, ...dealers];
  saveAdminDealers(updated);
  return newDealer;
}

export function updateAdminDealer(id, updatedFields) {
  const dealers = getAdminDealers();
  const updated = dealers.map((d) => (d.id === id ? { ...d, ...updatedFields } : d));
  saveAdminDealers(updated);
  return updated.find((d) => d.id === id);
}

export function toggleDealerStatus(id) {
  const dealers = getAdminDealers();
  const target = dealers.find((d) => d.id === id);
  if (!target) return null;
  const newStatus = target.status === 'Active' ? 'Suspended' : 'Active';
  const updated = dealers.map((d) => (d.id === id ? { ...d, status: newStatus } : d));
  saveAdminDealers(updated);
  return updated.find((d) => d.id === id);
}

export function approveDealerKYC(id) {
  const dealers = getAdminDealers();
  const updated = dealers.map((d) => {
    if (d.id === id) {
      return {
        ...d,
        status: 'Active',
        payoutHold: false,
        kycDocuments: (d.kycDocuments || []).map((doc) => ({ ...doc, status: 'Verified' }))
      };
    }
    return d;
  });
  saveAdminDealers(updated);
  return updated.find((d) => d.id === id);
}

export function toggleDealerPayoutHold(id) {
  const dealers = getAdminDealers();
  const updated = dealers.map((d) => {
    if (d.id === id) {
      return { ...d, payoutHold: !d.payoutHold };
    }
    return d;
  });
  saveAdminDealers(updated);
  return updated.find((d) => d.id === id);
}

// ==========================================
// 3. PRODUCT MANAGEMENT SERVICE
// ==========================================

export function getAdminProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS_LIST);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading admin products:', e);
  }
  return [];
}

export function saveAdminProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS_LIST, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving admin products:', e);
  }
}

export function getAdminProductById(id) {
  const products = getAdminProducts();
  return products.find((p) => p.id === id) || null;
}

export function createAdminProduct(productData) {
  const products = getAdminProducts();
  const nextNum = products.length + 1;
  const newProduct = {
    id: `PROD_${String(nextNum).padStart(3, '0')}`,
    sku: productData.sku || `SKU-AGR-${nextNum}`,
    name: productData.name || 'New Catalog Product',
    description: productData.description || 'Commercial agriculture specification listing.',
    category: productData.category || 'Agriculture & Farming',
    subcategory: productData.subcategory || 'General Equipment',
    dealerId: productData.dealerId || 'DEALER_001',
    dealerName: productData.dealerName || 'Apex Agri-Tech & Machinery',
    price: Number(productData.price) || 1000,
    mrp: Number(productData.mrp) || Math.round((Number(productData.price) || 1000) * 1.2),
    stock: Number(productData.stock) || 50,
    threshold: Number(productData.threshold) || 10,
    status: productData.status || 'Active',
    image: productData.image || '/images/prod-drip.png',
    rating: 4.8,
    totalSales: 0,
    location: productData.location || 'Depot A • Bay 01',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updated = [newProduct, ...products];
  saveAdminProducts(updated);
  recordAdminAuditLog('Product Created', 'Products', `Created listing: ${newProduct.name} (#${newProduct.sku})`);
  return newProduct;
}

export function updateAdminProduct(id, updatedFields) {
  const products = getAdminProducts();
  const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
  saveAdminProducts(updated);
  recordAdminAuditLog('Product Updated', 'Products', `Updated product #${id}`);
  return updated.find((p) => p.id === id);
}

export function deleteAdminProduct(id) {
  const products = getAdminProducts();
  const target = products.find((p) => p.id === id);
  const updated = products.filter((p) => p.id !== id);
  saveAdminProducts(updated);
  if (target) {
    recordAdminAuditLog('Product Deleted', 'Products', `Deleted listing: ${target.name} (#${id})`);
  }
  return true;
}

export function approveProductListing(id) {
  return updateAdminProduct(id, { status: 'Active' });
}

export function rejectProductListing(id, reason = 'MSRP compliance failure') {
  return updateAdminProduct(id, { status: 'Rejected', rejectionReason: reason });
}

// ==========================================
// 4. INVENTORY MANAGEMENT SERVICE
// ==========================================

export function getAdminInventorySummary() {
  const products = getAdminProducts();
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= (p.threshold || 10)).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const inStockCount = products.filter((p) => p.stock > (p.threshold || 10)).length;

  return {
    totalStockUnits,
    totalSkus: products.length,
    lowStockCount,
    outOfStockCount,
    inStockCount
  };
}

export function getAdminInventoryMovementLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVENTORY_LOGS);
    if (raw) return JSON.parse(raw);
  } catch {}

  const defaultLogs = [
    { id: 'LOG-101', sku: 'AG-DRP-801', productName: 'HydroHarvest Drip Kit', dealer: 'Apex Agri-Tech', delta: '+20', newStock: 340, reason: 'Physical stock reconciliation', timestamp: 'Today, 10:15 AM', admin: 'Operations Lead' },
    { id: 'LOG-102', sku: 'AU-ALT-404', productName: 'Duramax Tractor Alternator', dealer: 'Apex Agri-Tech', delta: '-8', newStock: 0, reason: 'Bulk warranty replacement write-off', timestamp: 'Yesterday, 04:30 PM', admin: 'GROVE Admin' },
    { id: 'LOG-103', sku: 'AG-TRC-025', productName: 'Mini Tractor 25 HP', dealer: 'Kisan Agro Hub', delta: '+4', newStock: 8, reason: 'Inbound manufacturer shipment', timestamp: 'Oct 22, 11:00 AM', admin: 'GROVE Admin' },
    { id: 'LOG-104', sku: 'AU-BRK-FRT', productName: 'Heavy-Duty Front Brake Pad Set', dealer: 'Kisan Agro Hub', delta: '-12', newStock: 3, reason: 'Wholesale order dispatch (#GRV-7704)', timestamp: 'Oct 21, 02:15 PM', admin: 'Operations Lead' }
  ];

  try {
    localStorage.setItem(STORAGE_KEYS.INVENTORY_LOGS, JSON.stringify(defaultLogs));
  } catch {}
  return defaultLogs;
}

export function adjustAdminInventoryStock(productId, newQuantity, reason, adminName = 'GROVE Admin') {
  const products = getAdminProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  const oldStock = product.stock;
  const delta = newQuantity - oldStock;
  const deltaStr = delta >= 0 ? `+${delta}` : `${delta}`;

  // Update product
  updateAdminProduct(productId, { stock: newQuantity });

  // Record inventory log
  const currentLogs = getAdminInventoryMovementLogs();
  const newLog = {
    id: `LOG-${Date.now().toString().slice(-4)}`,
    sku: product.sku,
    productName: product.name,
    dealer: product.dealerName,
    delta: deltaStr,
    newStock: newQuantity,
    reason: reason || 'Manual Admin stock adjustment',
    timestamp: 'Just now',
    admin: adminName
  };

  const updatedLogs = [newLog, ...currentLogs];
  try {
    localStorage.setItem(STORAGE_KEYS.INVENTORY_LOGS, JSON.stringify(updatedLogs));
  } catch {}

  recordAdminAuditLog('Stock Adjusted', 'Inventory', `${product.name} (${product.sku}): ${oldStock} → ${newQuantity} (${deltaStr})`);
  return newLog;
}

// ==========================================
// 5. ORDER MANAGEMENT SERVICE
// ==========================================

export function getAdminOrders() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS_LIST);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading admin orders:', e);
  }
  return [];
}

export function saveAdminOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS_LIST, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving admin orders:', e);
  }
}

export function getAdminOrderById(id) {
  const orders = getAdminOrders();
  return orders.find((o) => o.id === id) || null;
}

export function updateAdminOrderStatus(id, newStatus, trackingNumber = '', carrier = '') {
  const orders = getAdminOrders();
  const updated = orders.map((o) => {
    if (o.id === id) {
      return {
        ...o,
        orderStatus: newStatus,
        trackingNumber: trackingNumber || o.trackingNumber,
        carrier: carrier || o.carrier
      };
    }
    return o;
  });
  saveAdminOrders(updated);
  recordAdminAuditLog('Order Status Updated', 'Orders', `Order #${id} status changed to ${newStatus}`);
  return updated.find((o) => o.id === id);
}

export function getAdminOrderKPIs() {
  const orders = getAdminOrders();
  const totalCount = orders.length;
  const totalAmount = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const placedCount = orders.filter((o) => o.orderStatus === 'Placed').length;
  const processingCount = orders.filter((o) => o.orderStatus === 'Processing').length;
  const shippedCount = orders.filter((o) => o.orderStatus === 'Shipped').length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;

  return {
    totalCount,
    totalAmountFormatted: `₹${totalAmount.toLocaleString('en-IN')}`,
    placedCount,
    processingCount,
    shippedCount,
    deliveredCount
  };
}

// ==========================================
// 6. USER / CUSTOMER MANAGEMENT SERVICE
// ==========================================

export function getAdminCustomers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS_LIST);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading admin customers:', e);
  }
  return [];
}

export function saveAdminCustomers(customers) {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS_LIST, JSON.stringify(customers));
  } catch (e) {
    console.error('Error saving admin customers:', e);
  }
}

export function toggleCustomerStatus(id) {
  const customers = getAdminCustomers();
  const updated = customers.map((c) => {
    if (c.id === id) {
      const next = c.status === 'Active' ? 'Inactive' : 'Active';
      return { ...c, status: next };
    }
    return c;
  });
  saveAdminCustomers(updated);
  recordAdminAuditLog('Customer Status Toggled', 'Users', `Customer #${id} status changed`);
  return updated.find((c) => c.id === id);
}

// ==========================================
// 7. DEALER LOCATIONS SERVICE
// ==========================================

export function getAdminLocations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOCATIONS_LIST);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading admin locations:', e);
  }
  return [];
}

export function saveAdminLocations(locations) {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS_LIST, JSON.stringify(locations));
  } catch (e) {
    console.error('Error saving admin locations:', e);
  }
}

export function createAdminLocation(locationData) {
  const locations = getAdminLocations();
  const nextNum = locations.length + 1;
  const newLoc = {
    id: `LOC_${String(nextNum).padStart(3, '0')}`,
    hubCode: locationData.hubCode || `HUB-DEP-${nextNum}`,
    dealerId: locationData.dealerId || 'DEALER_001',
    dealerName: locationData.dealerName || 'Apex Agri-Tech & Machinery',
    hubType: locationData.hubType || 'Regional Spares Depot',
    city: locationData.city || 'Pune',
    state: locationData.state || 'Maharashtra',
    pincode: locationData.pincode || '411001',
    address: locationData.address || `${locationData.city} Industrial Zone`,
    contactPhone: locationData.contactPhone || '+91 98000 00000',
    capacityTons: Number(locationData.capacityTons) || 200,
    serviceRadiusKm: Number(locationData.serviceRadiusKm) || 120,
    activePinCodesCount: Number(locationData.activePinCodesCount) || 30,
    status: locationData.status || 'Operational'
  };

  const updated = [newLoc, ...locations];
  saveAdminLocations(updated);
  recordAdminAuditLog('Location Added', 'Locations', `Registered depot ${newLoc.hubCode} in ${newLoc.city}`);
  return newLoc;
}

export function updateAdminLocation(id, fields) {
  const locations = getAdminLocations();
  const updated = locations.map((loc) => (loc.id === id ? { ...loc, ...fields } : loc));
  saveAdminLocations(updated);
  recordAdminAuditLog('Location Updated', 'Locations', `Updated location #${id}`);
  return updated.find((loc) => loc.id === id);
}

export function deleteAdminLocation(id) {
  const locations = getAdminLocations();
  const updated = locations.filter((loc) => loc.id !== id);
  saveAdminLocations(updated);
  recordAdminAuditLog('Location Deleted', 'Locations', `Deleted location #${id}`);
  return true;
}

// ==========================================
// 8. CATEGORY MANAGEMENT SERVICE
// ==========================================

export function getAdminCategories() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES_LIST);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading admin categories:', e);
  }
  return [];
}

export function saveAdminCategories(categories) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES_LIST, JSON.stringify(categories));
  } catch (e) {
    console.error('Error saving admin categories:', e);
  }
}

export function createAdminCategory(catData) {
  const categories = getAdminCategories();
  const nextId = `cat-${catData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 8)}`;
  const newCat = {
    id: nextId,
    name: catData.name,
    slug: catData.slug || nextId,
    description: catData.description || 'Specialized catalog classification.',
    icon: catData.icon || 'Layers',
    commissionRate: parseFloat(catData.commissionRate) || 5.0,
    productCount: 0,
    status: 'Active',
    subcategories: []
  };

  const updated = [...categories, newCat];
  saveAdminCategories(updated);
  recordAdminAuditLog('Category Created', 'Categories', `Created category: ${newCat.name}`);
  return newCat;
}

export function updateAdminCategory(id, fields) {
  const categories = getAdminCategories();
  const updated = categories.map((c) => (c.id === id ? { ...c, ...fields } : c));
  saveAdminCategories(updated);
  recordAdminAuditLog('Category Updated', 'Categories', `Updated category: ${id}`);
  return updated.find((c) => c.id === id);
}

export function addSubcategory(catId, subcat) {
  const categories = getAdminCategories();
  const updated = categories.map((c) => {
    if (c.id === catId) {
      const subId = `sub-${catId}-${Date.now().toString().slice(-3)}`;
      const newSub = {
        id: subId,
        name: subcat.name,
        slug: subcat.slug || subcat.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        productCount: 0,
        status: 'Active'
      };
      return { ...c, subcategories: [...c.subcategories, newSub] };
    }
    return c;
  });
  saveAdminCategories(updated);
  recordAdminAuditLog('Subcategory Added', 'Categories', `Added subcategory ${subcat.name} to ${catId}`);
  return updated.find((c) => c.id === catId);
}

export function deleteAdminCategory(id) {
  const categories = getAdminCategories();
  const target = categories.find((c) => c.id === id);
  const updated = categories.filter((c) => c.id !== id);
  saveAdminCategories(updated);
  if (target) {
    recordAdminAuditLog('Category Deleted', 'Categories', `Deleted category: ${target.name} (#${id})`);
  }
  return true;
}

// ==========================================
// 9. SALES & ANALYTICS SERVICE
// ==========================================

export function getAdminAnalytics(period = 'monthly') {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ANALYTICS_DATA);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.kpis) return parsed;
    }
  } catch {}
  return { overview: { totalRevenue: 48250000, totalOrders: 1420 } };
}

// ==========================================
// 10. PAYMENTS & SETTLEMENTS SERVICE
// ==========================================

export function getAdminPaymentSummary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS_DATA);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { totalEscrow: '₹18,50,000', pendingPayouts: 3, settlements: [] };
}

export function releaseDealerPayout(batchId) {
  const data = getAdminPaymentSummary();
  const settlements = data.dealerSettlements || [];
  const updatedSettlements = settlements.map((s) => {
    if (s.id === batchId) {
      return { ...s, status: 'Settled', payoutDate: 'Today' };
    }
    return s;
  });

  const updatedData = { ...data, dealerSettlements: updatedSettlements };
  try {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS_DATA, JSON.stringify(updatedData));
  } catch {}

  recordAdminAuditLog('Payout Released', 'Payments', `Released payout batch #${batchId}`);
  return updatedSettlements.find((s) => s.id === batchId);
}

// ==========================================
// 11. SUPPORT & COMPLAINTS SERVICE
// ==========================================

export function getAdminSupportTickets() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SUPPORT_TICKETS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
}

export function saveAdminSupportTickets(tickets) {
  try {
    localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(tickets));
  } catch (e) {
    console.error('Error saving support tickets:', e);
  }
}

export function updateTicketStatus(id, newStatus, newPriority = null) {
  const tickets = getAdminSupportTickets();
  const updated = tickets.map((t) => {
    if (t.id === id) {
      return {
        ...t,
        status: newStatus || t.status,
        priority: newPriority || t.priority,
        lastUpdated: 'Just now'
      };
    }
    return t;
  });
  saveAdminSupportTickets(updated);
  recordAdminAuditLog('Ticket Status Updated', 'Support', `Ticket #${id} marked as ${newStatus}`);
  return updated.find((t) => t.id === id);
}

export function addAdminReplyToTicket(id, message, isInternalNote = false) {
  const tickets = getAdminSupportTickets();
  const updated = tickets.map((t) => {
    if (t.id === id) {
      if (isInternalNote) {
        return {
          ...t,
          internalNotes: [...(t.internalNotes || []), message],
          lastUpdated: 'Just now'
        };
      } else {
        const newMsg = {
          id: `m_${Date.now()}`,
          sender: 'GROVE Admin Operations',
          senderRole: 'admin',
          timestamp: 'Just now',
          text: message
        };
        return {
          ...t,
          messages: [...(t.messages || []), newMsg],
          lastUpdated: 'Just now'
        };
      }
    }
    return t;
  });
  saveAdminSupportTickets(updated);
  return updated.find((t) => t.id === id);
}

// ==========================================
// 12. REPORTS & AUDIT LOGS SERVICE
// ==========================================

export function getAdminReportsList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS_DATA);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.availableReports) return parsed.availableReports;
    }
  } catch {}
  return [];
}

export function getAdminAuditLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS_DATA);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.auditLogs) return parsed.auditLogs;
    }
  } catch {}
  return [];
}

export function recordAdminAuditLog(action, module, details) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS_DATA);
    const data = raw ? JSON.parse(raw) : { auditLogs: [] };
    const logs = data.auditLogs || [];
    const newEntry = {
      id: `AUD_${Math.floor(1000 + Math.random() * 9000)}`,
      admin: 'GROVE Admin',
      role: 'Super Admin',
      action,
      module,
      details,
      timestamp: 'Just now',
      status: 'Success'
    };
    const updated = [newEntry, ...logs.slice(0, 49)];
    localStorage.setItem(STORAGE_KEYS.REPORTS_DATA, JSON.stringify({ ...data, auditLogs: updated }));
  } catch {}
}

// ==========================================
// 13. PLATFORM SETTINGS SERVICE
// ==========================================

export function getAdminSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS_DATA);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultAdminSettings;
}

export function saveAdminSettings(updated) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_DATA, JSON.stringify(updated));
    recordAdminAuditLog('Settings Updated', 'Settings', 'Modified platform configuration');
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}
