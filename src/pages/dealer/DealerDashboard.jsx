import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Plus, 
  AlertTriangle, 
  Store, 
  CheckCircle2, 
  TrendingUp, 
  Package, 
  Truck, 
  Clock, 
  Filter,
  Layers
} from 'lucide-react';
import DealerLayout from '../../components/dealer/DealerLayout';
import { getStoredDealer, getActiveDealerId } from '../../utils/auth';
import { 
  getDealerDashboardMetrics, 
  getDealerStoreSettings, 
  saveDealerStoreSettings,
  syncDealerDataFromApi
} from '../../services/dealerService';

export default function DealerDashboard() {
  const navigate = useNavigate();
  const user = getStoredDealer();

  const [metrics, setMetrics] = useState(() => getDealerDashboardMetrics(getActiveDealerId()));
  const [settings, setSettings] = useState(() => getDealerStoreSettings(getActiveDealerId()));
  const [activeRange, setActiveRange] = useState('30D');

  const refreshData = () => {
    const activeId = getActiveDealerId();
    const updatedMetrics = getDealerDashboardMetrics(activeId);
    setMetrics(updatedMetrics);
    setSettings(getDealerStoreSettings(activeId));
  };

  useEffect(() => {
    document.title = 'Dealer Overview | GROVE B2B Portal';
    window.scrollTo(0, 0);
    refreshData();
    const activeId = getActiveDealerId();
    syncDealerDataFromApi(activeId).then(() => {
      refreshData();
    });
  }, []);

  const handleToggleStore = () => {
    const activeId = getActiveDealerId();
    const updated = { ...settings, storeOpen: !settings.storeOpen };
    setSettings(updated);
    saveDealerStoreSettings(updated, activeId);
    refreshData();
  };

  const dealerName = metrics?.dealerName || user?.name || 'Apex Agri-Tech';
  const lowStockItems = metrics?.lowStockItems || [];
  const recentOrders = metrics?.recentOrders || [];

  return (
    <DealerLayout>
      <div className="flex flex-col w-full gap-6">
        {/* Operational Action & Summary Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#151D18] tracking-tight">
                Dealer Operations
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#AEEECB]/50 text-[#0E5138] text-[10px] font-mono font-bold tracking-wide">
                LIVE FEED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#717973]">
              Real-time performance metrics and dispatch monitoring for {dealerName}.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative">
              <button 
                type="button"
                onClick={() => setActiveRange((prev) => (prev === '30D' ? '7D' : '30D'))}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-[#151D18] text-xs font-semibold hover:bg-[#EDF6ED] transition-colors border border-[#C1C8C2]/50 shadow-2xs cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-[#717973]" />
                <span>Filter Range: {activeRange}</span>
              </button>
            </div>

            <Link
              to="/dealer/products/add"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#012D1D] transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* 4 Clean KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="bg-white rounded-2xl p-5 flex flex-col justify-between shadow-2xs border border-[#C1C8C2]/40 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-[#717973]">Total Revenue</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#AEEECB]/60 text-[#0E5138] font-mono text-[11px] font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {metrics?.revenueGrowth || '+18.4%'}
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-0.5">
              <div className="text-2xl font-extrabold text-[#151D18] tracking-tight">{metrics?.totalRevenueFormatted || '₹14,82,450'}</div>
              <span className="text-[11px] text-[#717973]">{metrics?.lastMonthRevenueText || 'vs last mo (₹12.52L)'}</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-2xl p-5 flex flex-col justify-between shadow-2xs border border-[#C1C8C2]/40 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-[#717973]">Total Orders</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#AEEECB]/60 text-[#0E5138] font-mono text-[11px] font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {metrics?.ordersGrowth || '+12.1%'}
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-0.5">
              <div className="text-2xl font-extrabold text-[#151D18] tracking-tight">{metrics?.totalOrdersCount ?? 428}</div>
              <span className="text-[11px] text-[#717973]">{metrics?.avgTicketSizeText || 'Avg ticket size: ₹3,463'}</span>
            </div>
          </div>

          {/* Catalog Reach */}
          <div className="bg-white rounded-2xl p-5 flex flex-col justify-between shadow-2xs border border-[#C1C8C2]/40 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-[#717973]">Catalog Reach</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#EDF6ED] text-[#2C694E] font-mono text-[10px] font-bold">
                Active Listings
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-0.5">
              <div className="text-2xl font-extrabold text-[#151D18] tracking-tight">
                {metrics?.activeListingsCount ?? 0}
              </div>
              <span className="text-[11px] text-[#2C694E] font-semibold">Active dealer listings</span>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-2xl p-5 flex flex-col justify-between shadow-2xs border border-[#C1C8C2]/40 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-[#717973]">Pending Dispatch</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-mono text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                Action Required
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-0.5">
              <div className="text-2xl font-extrabold text-[#151D18] tracking-tight">{metrics?.pendingDispatchCount ?? 0}</div>
              <span className="text-[11px] text-red-600 font-medium">Require immediate dispatch</span>
            </div>
          </div>
        </div>

        {/* Two-Column Balance Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (65% width -> 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
            {/* Sales Overview Card with SVG Chart */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#C1C8C2]/40 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100">
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-bold text-[#151D18]">Sales Overview</span>
                  <span className="text-xs text-[#717973]">Gross merchandise value trajectory over past 30 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-[#EDF6ED] px-2.5 py-1 rounded-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2C694E]" />
                    <span className="text-[11px] font-mono text-[#151D18] font-medium">Revenue (₹)</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C1C8C2]" />
                    <span className="text-[11px] font-mono text-[#717973] font-medium">Prior Period</span>
                  </div>
                </div>
              </div>

              {/* Line Chart Visualization */}
              <div className="w-full relative mt-2 pt-6">
                {/* Tooltip overlay sample (Hover Point) */}
                <div className="absolute left-[62%] top-2 -translate-x-1/2 bg-[#012D1D] text-white px-3 py-1.5 rounded-xl shadow-md pointer-events-none flex flex-col items-center z-10 animate-in fade-in">
                  <span className="text-[10px] text-[#AEEECB] font-bold leading-tight">LATEST PEAK</span>
                  <span className="text-xs font-mono font-bold leading-tight">{metrics?.totalRevenueFormatted || '₹14,82,450'}</span>
                  <div className="w-2 h-2 bg-[#012D1D] rotate-45 -mb-1 mt-1" />
                </div>

                {/* Responsive SVG Curve */}
                <svg className="w-full h-52 overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 680 200">
                  <defs>
                    <linearGradient id="groveSalesGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2c694e" stopOpacity="0.25" />
                      <stop offset="85%" stopColor="#2c694e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line stroke="#e1ebe2" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="680" y1="180" y2="180" />
                  <line stroke="#e1ebe2" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="680" y1="120" y2="120" />
                  <line stroke="#e1ebe2" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="680" y1="60" y2="60" />
                  {/* Prior Period Ghost Line */}
                  <path 
                    d="M 0,160 C 50,155 100,165 150,140 C 200,120 250,135 300,125 C 350,110 400,118 450,105 C 500,90 550,110 600,95 C 640,85 660,78 680,75" 
                    fill="none" 
                    stroke="#c1c8c2" 
                    strokeDasharray="3 3" 
                    strokeWidth="1.5" 
                  />
                  {/* Gradient Area */}
                  <path 
                    d="M 0,145 C 50,140 100,150 150,115 C 200,85 240,110 290,90 C 340,70 380,85 430,48 C 480,20 530,65 580,42 C 630,22 660,35 680,25 L 680,180 L 0,180 Z" 
                    fill="url(#groveSalesGrad)" 
                  />
                  {/* Primary Metric Spline */}
                  <path 
                    d="M 0,145 C 50,140 100,150 150,115 C 200,85 240,110 290,90 C 340,70 380,85 430,48 C 480,20 530,65 580,42 C 630,22 660,35 680,25" 
                    fill="none" 
                    stroke="#2c694e" 
                    strokeLinecap="round" 
                    strokeWidth="2.5" 
                  />
                  {/* High Point Marker Target */}
                  <circle cx="430" cy="48" fill="#1b4332" r="5" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* Axis Labels */}
                <div className="flex justify-between items-center pt-2 font-mono text-[11px] text-[#717973]">
                  {(metrics?.monthlyRevenueData && metrics.monthlyRevenueData.length > 0) ? (
                    metrics.monthlyRevenueData.map((m, idx) => (
                      <span 
                        key={m.month} 
                        className={idx === (metrics.monthlyRevenueData.length - 1) ? "text-[#2C694E] font-bold" : ""}
                      >
                        {m.month}
                      </span>
                    ))
                  ) : (
                    <>
                      <span>Oct 01</span>
                      <span>Oct 08</span>
                      <span>Oct 15</span>
                      <span className="text-[#2C694E] font-bold">Oct 24 (Peak)</span>
                      <span>Oct 31</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#C1C8C2]/40 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-bold text-[#151D18]">Recent Orders</span>
                  <span className="text-xs text-[#717973]">Latest incoming procurement purchase orders</span>
                </div>
                <Link 
                  to="/dealer/orders"
                  className="text-xs text-[#2C694E] hover:text-[#012D1D] font-bold flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Minimal Responsive Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#EDF6ED] text-[#717973] uppercase tracking-wider font-semibold text-[11px]">
                      <th className="py-2.5 px-3 rounded-l-lg">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-neutral-500 font-medium">
                          No customer purchase orders found in database.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => {
                        const customerInitials = (order.customer?.name || 'Customer')
                          .split(' ')
                          .map((w) => w[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase();

                        return (
                          <tr key={order.id} className="hover:bg-[#EDF6ED]/60 transition-colors">
                            <td className="py-3 px-3">
                              <span className="font-mono font-bold text-[#012D1D]">#{order.id}</span>
                              <div className="text-[10px] text-[#717973] font-mono mt-0.5">
                                {(order.placedAt || '').split(',')[0]}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-[#151D18] text-[10px] shrink-0">
                                  {customerInitials}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-[#151D18] truncate max-w-[140px]">
                                    {order.customer?.name || 'Customer'}
                                  </span>
                                  <span className="text-[10px] text-[#717973] truncate">
                                    {order.customer?.city || 'Pune'}, {order.customer?.state || 'MH'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-[#151D18]">
                              ₹{(order.amount || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                                order.orderStatus === 'Placed'
                                  ? 'bg-[#AEEECB] text-[#0E5138]'
                                  : order.orderStatus === 'Processing'
                                  ? 'bg-amber-100 text-amber-800'
                                  : order.orderStatus === 'Shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-neutral-100 text-neutral-700'
                              }`}>
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <Link
                                to={`/dealer/orders/${order.id}`}
                                className="font-bold text-[#2C694E] hover:text-[#012D1D] hover:underline"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (35% width -> 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Low Stock Alerts Card */}
            <div className="bg-white rounded-2xl p-5 shadow-2xs border border-[#C1C8C2]/40 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-base font-bold text-[#151D18]">Low Stock Alerts</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-mono text-[10px] font-bold">
                  {lowStockItems.length} Critical
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {lowStockItems.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#717973] font-medium bg-[#EDF6ED]/40 rounded-xl border border-[#C1C8C2]/30">
                    All inventory levels are healthy. No items below critical threshold.
                  </div>
                ) : (
                  lowStockItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#EDF6ED]/70 hover:bg-[#EDF6ED] transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-10 h-10 rounded-lg object-cover bg-white border border-[#C1C8C2]/40 shrink-0" 
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-[#151D18] truncate max-w-[130px]">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#717973]">
                            SKU: {item.sku}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-mono text-[10px] font-bold">
                          {item.stock} units left
                        </span>
                        <Link 
                          to="/dealer/inventory"
                          className="text-[#2C694E] text-[11px] font-bold hover:underline"
                        >
                          Restock
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Store Status Summary Card */}
            <div className="bg-white rounded-2xl p-5 shadow-2xs border border-[#C1C8C2]/40 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-bold text-[#151D18]">Store Status</span>
                  <span className="text-xs text-[#717973]">Availability and dispatch compliance</span>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${settings.storeOpen ? 'bg-[#2C694E] ring-4 ring-[#AEEECB]' : 'bg-red-500 ring-4 ring-red-100'}`} />
              </div>

              {/* Toggle Switch Container */}
              <div className="p-3 bg-[#EDF6ED] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#2C694E] shadow-2xs">
                    <Store className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#151D18] leading-tight">
                      {settings.storeOpen ? 'Store Open' : 'Store Paused'}
                    </span>
                    <span className="text-[11px] text-[#717973]">
                      {settings.storeOpen ? 'Accepting wholesale orders' : 'Orders temporarily paused'}
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.storeOpen}
                    onChange={handleToggleStore}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2C694E]" />
                </label>
              </div>

              {/* Metric on Fulfillment SLA */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#717973]">Fulfillment SLA (30D)</span>
                  <span className="font-mono font-bold text-[#2C694E]">{settings.fulfillmentSLA || metrics?.fulfillmentSLA || 99.1}% on-time</span>
                </div>
                {/* Linear Meter */}
                <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div 
                    className="h-full bg-[#2C694E] rounded-full transition-all duration-500" 
                    style={{ width: `${settings.fulfillmentSLA || metrics?.fulfillmentSLA || 99.1}%` }} 
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#717973] pt-0.5">
                  <span>Target: &gt;98.0%</span>
                  <span className="text-[#2C694E] font-semibold">Top Tier Dealer</span>
                </div>
              </div>

              {/* Operational Hub Mini Specs */}
              <div className="pt-1 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#EDF6ED] p-2.5 rounded-xl flex flex-col">
                  <span className="text-[11px] text-[#717973]">Avg Dispatch</span>
                  <span className="font-mono font-bold text-[#151D18] mt-0.5 text-sm">{settings.avgDispatchHours || metrics?.avgDispatchHours || 4.2} hrs</span>
                </div>
                <div className="bg-[#EDF6ED] p-2.5 rounded-xl flex flex-col">
                  <span className="text-[11px] text-[#717973]">Return Rate</span>
                  <span className="font-mono font-bold text-[#2C694E] mt-0.5 text-sm">{settings.returnRatePercent || metrics?.returnRatePercent || 0.42}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DealerLayout>
  );
}

