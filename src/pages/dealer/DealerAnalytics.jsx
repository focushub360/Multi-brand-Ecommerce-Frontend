import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  BarChart3, 
  Download, 
  ChevronRight, 
  ArrowUpRight, 
  Receipt, 
  Eye, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Users, 
  RefreshCw,
  Package
} from 'lucide-react';
import DealerLayout from '../../components/dealer/DealerLayout';
import { getDealerAnalytics, fetchDealerAnalytics, getDealerOrders } from '../../services/dealerService';
import { getActiveDealerId } from '../../utils/auth';

export default function DealerAnalytics() {
  const [timeRange, setTimeRange] = useState('30D');
  const [activeChartTab, setActiveChartTab] = useState('revenue');
  const [analyticsData, setAnalyticsData] = useState(() => getDealerAnalytics(getActiveDealerId(), '30D'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Analytics & Insights | GROVE Dealer Portal';
    window.scrollTo(0, 0);
    const activeId = getActiveDealerId();
    
    // 1. Instant local render
    setAnalyticsData(getDealerAnalytics(activeId, timeRange));

    // 2. Fetch live data from backend MongoDB
    let isMounted = true;
    setIsLoading(true);
    fetchDealerAnalytics(activeId, timeRange)
      .then((live) => {
        if (isMounted && live) {
          setAnalyticsData(live);
        }
      })
      .catch((err) => {
        console.warn('Live analytics fetch warning:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [timeRange]);

  const handleRefresh = () => {
    const activeId = getActiveDealerId();
    setIsLoading(true);
    fetchDealerAnalytics(activeId, timeRange)
      .then((live) => {
        if (live) setAnalyticsData(live);
      })
      .finally(() => setIsLoading(false));
  };

  const handleExport = () => {
    const activeId = getActiveDealerId();
    const orders = getDealerOrders(activeId);
    const headers = [
      'Order ID',
      'Placed Date',
      'Customer Name',
      'City',
      'State',
      'Product Name',
      'SKU',
      'Category',
      'Qty',
      'Subtotal (INR)',
      'Status',
      'Payment'
    ];

    const rows = [headers.join(',')];
    orders.forEach((o) => {
      const items = o.items && o.items.length > 0 ? o.items : [o.product];
      items.forEach((item) => {
        rows.push([
          o.orderNumber || o.id,
          `"${o.placedAt || ''}"`,
          `"${(o.customer?.name || '').replace(/"/g, '""')}"`,
          `"${(o.customer?.city || '').replace(/"/g, '""')}"`,
          `"${(o.customer?.state || '').replace(/"/g, '""')}"`,
          `"${(item?.name || '').replace(/"/g, '""')}"`,
          item?.sku || '',
          `"${item?.category || ''}"`,
          item?.quantity || 1,
          item?.subtotal || item?.price || o.amount,
          o.orderStatus,
          o.paymentStatus
        ].join(','));
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\r\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `grove_dealer_analytics_${activeId}_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const kpis = analyticsData?.kpis || [];
  const monthlyData = analyticsData?.monthlyRevenueData || [];
  const categoryBreakdown = analyticsData?.categoryBreakdown || [];
  const topProducts = analyticsData?.topProducts || [];
  const slaHealth = analyticsData?.slaHealth || {
    compliance: '99.1%',
    avgDispatchHours: '4.2 Hours',
    repeatBuyers: '42.8%',
    inventoryParity: '99.8% Sync'
  };

  const maxRev = Math.max(...monthlyData.map(d => d.revenue), 1);

  return (
    <DealerLayout>
      <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#717973]">
              <Link to="/dealer/dashboard" className="hover:text-[#012D1D] transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#151D18] font-bold">Analytics</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#012D1D] tracking-tight">
                Analytics & Insights
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#AEEECB] text-[#0E5138] font-mono text-xs font-bold">
                B2B Metrics
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#414844]">
              Deep dive into revenue trends, product velocity, regional demand, and fulfillment SLAs.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            {/* Time range selector */}
            <div className="bg-white border border-[#C1C8C2]/60 rounded-xl p-1 flex items-center shadow-2xs">
              {['7D', '30D', '90D', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    timeRange === range
                      ? 'bg-[#012D1D] text-white shadow-2xs'
                      : 'text-[#717973] hover:text-[#151D18]'
                  }`}
                  type="button"
                >
                  {range}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh live analytics from database"
              className="h-10 w-10 rounded-xl border border-[#C1C8C2]/60 bg-white hover:bg-[#EDF6ED] text-[#012D1D] transition-colors flex items-center justify-center shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
              type="button"
            >
              <RefreshCw className={`w-4 h-4 text-[#717973] ${isLoading ? 'animate-spin text-[#2C694E]' : ''}`} />
            </button>

            <button
              onClick={handleExport}
              title="Download RFC-4180 CSV export of orders and revenue metrics"
              className="h-10 px-4 rounded-xl border border-[#C1C8C2]/60 bg-white hover:bg-[#EDF6ED] text-[#012D1D] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-2xs cursor-pointer active:scale-95"
              type="button"
            >
              <Download className="w-4 h-4 text-[#717973]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Performance KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs border border-[#C1C8C2]/40 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-[#717973]">{kpi.title}</span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#AEEECB]/60 text-[#0E5138] font-mono text-xs font-bold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {kpi.change}
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#151D18] tracking-tight">
                    {kpi.value}
                  </div>
                  <span className="text-xs text-[#717973]">{kpi.subtext}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue Velocity Chart + Fulfillment SLAs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Visual Chart (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#C1C8C2]/40 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#C1C8C2]/30">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#151D18]">Revenue & Order Trajectory</h2>
                <p className="text-xs text-[#717973] mt-0.5">Historical monthly gross sales volume</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveChartTab('revenue')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeChartTab === 'revenue'
                      ? 'bg-[#AEEECB] text-[#0E5138]'
                      : 'bg-[#F3FCF3] text-[#717973] hover:text-[#151D18]'
                  }`}
                >
                  Revenue (₹)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartTab('orders')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeChartTab === 'orders'
                      ? 'bg-[#AEEECB] text-[#0E5138]'
                      : 'bg-[#F3FCF3] text-[#717973] hover:text-[#151D18]'
                  }`}
                >
                  Order Count
                </button>
              </div>
            </div>

            {/* Bar Chart Visualization */}
            <div className="pt-2 flex flex-col gap-4">
              <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-56 pt-6 px-2">
                {monthlyData.map((d, index) => {
                  const heightPercent = activeChartTab === 'revenue'
                    ? Math.round((d.revenue / maxRev) * 100)
                    : Math.round((d.orders / 60) * 100);

                  const isLatest = index === monthlyData.length - 1;

                  return (
                    <div key={d.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[11px] font-bold text-[#012D1D] bg-[#AEEECB] px-2 py-0.5 rounded shadow-2xs mb-1">
                        {activeChartTab === 'revenue' ? `₹${(d.revenue / 100000).toFixed(2)}L` : `${d.orders} orders`}
                      </div>
                      <div className="w-full max-w-[48px] bg-[#F3FCF3] rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-xl transition-all duration-500 ${
                            isLatest ? 'bg-[#012D1D]' : 'bg-[#2C694E] hover:bg-[#012D1D]'
                          }`}
                        ></div>
                      </div>
                      <span className={`font-mono text-xs ${isLatest ? 'text-[#012D1D] font-bold' : 'text-[#717973]'}`}>
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#C1C8C2]/30 text-[#717973] text-xs gap-2">
                <span>Fastest growing category: <strong className="text-[#151D18] font-semibold">Micro-Irrigation (+34%)</strong></span>
                <span className="font-mono text-[#2C694E] font-bold">CAGR: +24.8% YoY</span>
              </div>
            </div>
          </div>

          {/* Fulfillment & SLA Reliability (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#C1C8C2]/40 flex flex-col gap-4">
            <h2 className="text-base sm:text-lg font-bold text-[#151D18] pb-3 border-b border-[#C1C8C2]/30">
              Operations & SLA Health
            </h2>

            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#717973] uppercase tracking-wider block font-semibold">Dispatch Compliance</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#012D1D]">{slaHealth.compliance}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#AEEECB] text-[#0E5138] font-mono text-xs font-bold">
                  Verified Tier
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#717973] uppercase tracking-wider block font-semibold">Avg Handover SLA</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#151D18]">{slaHealth.avgDispatchHours}</span>
                </div>
                <Clock className="w-5 h-5 text-[#2C694E]" />
              </div>

              <div className="p-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#717973] uppercase tracking-wider block font-semibold">B2B Repeat Buyers</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#151D18]">{slaHealth.repeatBuyers}</span>
                </div>
                <Users className="w-5 h-5 text-[#2C694E]" />
              </div>

              <div className="p-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#717973] uppercase tracking-wider block font-semibold">Inventory Parity</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#151D18]">{slaHealth.inventoryParity}</span>
                </div>
                <RefreshCw className="w-5 h-5 text-[#2C694E]" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Share + Top Selling Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Category Distribution (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#C1C8C2]/40 flex flex-col gap-4">
            <h2 className="text-base sm:text-lg font-bold text-[#151D18] pb-3 border-b border-[#C1C8C2]/30">
              Revenue by Category
            </h2>

            <div className="flex flex-col gap-4 pt-1">
              {categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-[#151D18] font-semibold truncate">{cat.name}</span>
                    <span className="font-mono font-bold text-[#151D18]">{cat.share}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#EDF6ED] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color}`}
                      style={{ width: `${cat.share}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#717973]">
                    <span>{cat.amount}</span>
                    <span>{cat.orders} Orders</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Products (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#C1C8C2]/40 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C1C8C2]/30">
              <h2 className="text-base sm:text-lg font-bold text-[#151D18]">Top Performing Catalog SKUs</h2>
              <Link to="/dealer/products" className="text-[#2C694E] text-xs font-bold hover:underline">
                View Full Catalog
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead className="bg-[#EDF6ED]/70 border-b border-[#C1C8C2]/40 text-[#414844] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Units Sold</th>
                    <th className="py-2.5 px-3">Gross Revenue</th>
                    <th className="py-2.5 px-3 text-right">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C1C8C2]/30">
                  {topProducts.map((p) => (
                    <tr key={p.sku} className="hover:bg-[#F3FCF3]/60">
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs sm:text-sm text-[#151D18] truncate max-w-[220px]">
                            {p.name}
                          </span>
                          <span className="font-mono text-[11px] text-[#717973]">{p.sku}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#151D18]">
                        {p.unitsSold}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#012D1D]">
                        {p.revenue}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                          p.stockLeft < 10
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#EDF6ED] text-[#151D18]'
                        }`}>
                          {p.stockLeft} units
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DealerLayout>
  );
}
