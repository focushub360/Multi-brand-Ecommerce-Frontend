import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  getAdminKPIs,
  getAdminSalesOverview,
  getAdminRevenueTrend,
  getAdminOrderStatusSummary,
  getAdminTopSellingProducts,
  getAdminDealerPerformance,
  getAdminRecentOrders,
  getAdminRecentTickets,
  syncAdminDataFromApi
} from '../../services/adminService';
import {
  Store,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Headphones,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  AlertTriangle,
  CreditCard,
  Building2,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  MapPin
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30D');
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);
  const [syncKey, setSyncKey] = useState(0);

  useEffect(() => {
    document.title = 'Platform Overview | GROVE Admin';
    window.scrollTo(0, 0);
    syncAdminDataFromApi().then(() => {
      setSyncKey((prev) => prev + 1);
    }).catch(() => {});
  }, []);

  const kpis = getAdminKPIs();
  const salesOverview = getAdminSalesOverview(timeRange);
  const revenueTrend = getAdminRevenueTrend();
  const orderStatusSummary = getAdminOrderStatusSummary();
  const topProducts = getAdminTopSellingProducts();
  const dealerPerformance = getAdminDealerPerformance();
  const recentOrders = getAdminRecentOrders();
  const recentTickets = getAdminRecentTickets();

  // Handle report export simulation
  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 4000);
    }, 600);
  };

  // SVG Chart calculation
  const maxRevenue = Math.max(...revenueTrend.map((d) => d.revenue));
  const chartHeight = 160;
  const chartWidth = 560;
  const paddingX = 40;
  const paddingY = 25;
  const availableWidth = chartWidth - paddingX * 2;
  const availableHeight = chartHeight - paddingY * 2;

  const points = revenueTrend.map((d, index) => {
    const x = paddingX + (index / (revenueTrend.length - 1)) * availableWidth;
    const y = chartHeight - paddingY - (d.revenue / maxRevenue) * availableHeight;
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'packed':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'processing':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'placed':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  // Ticket priority badge helper
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
      case 'high':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'normal':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <AdminPageHeader
        title="Platform Overview"
        subtitle="Central governance, platform gross merchandising value, dealer fulfillment SLAs, and active catalog monitoring."
        badge="Live Telemetry"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                syncAdminDataFromApi().then(() => {
                  setSyncKey((k) => k + 1);
                }).catch(() => {});
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#C1C8C2]/70 text-xs font-bold text-[#151D18] hover:bg-[#F3FCF3] hover:border-[#2C694E] transition-all shadow-2xs cursor-pointer"
              title="Sync live records from MongoDB database"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#2C694E]" />
              <span>Sync Live DB</span>
            </button>

            <button
              type="button"
              onClick={handleExportReport}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#C1C8C2]/70 text-xs font-bold text-[#151D18] hover:bg-[#F3FCF3] hover:border-[#2C694E] transition-all shadow-2xs cursor-pointer"
            >
              <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce text-[#2C694E]' : 'text-[#717973]'}`} />
              <span>{isExporting ? 'Generating CSV...' : 'Export Platform Report'}</span>
            </button>

            <Link
              to="/admin/dealers"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Store className="w-3.5 h-3.5 text-[#AEEECB]" />
              <span>Approve Dealers</span>
            </Link>
          </div>
        }
      />

      {/* Export notification toast */}
      {exportNotice && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Platform executive audit summary CSV generated and saved to temporary cache.</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-700">report_oct_2026.csv</span>
        </div>
      )}

      {/* 1. TOP KPI SUMMARY CARDS (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* KPI 1: Total Dealers */}
        <Link
          to="/admin/dealers"
          className="group p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 hover:border-[#2C694E] transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#717973] font-mono">
              Total Dealers
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F3FCF3] text-[#012D1D] group-hover:bg-[#012D1D] group-hover:text-[#AEEECB] transition-colors flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#012D1D] tracking-tight font-heading">
                {kpis.totalDealers.value}
              </span>
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 font-mono">
                <ArrowUpRight className="w-3 h-3" />
                {kpis.totalDealers.growth}
              </span>
            </div>
            <p className="text-[11px] text-[#717973] font-medium truncate">
              {kpis.totalDealers.subtext}
            </p>
          </div>
        </Link>

        {/* KPI 2: Total Customers */}
        <Link
          to="/admin/users"
          className="group p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 hover:border-[#2C694E] transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#717973] font-mono">
              Total Buyers
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F3FCF3] text-[#012D1D] group-hover:bg-[#012D1D] group-hover:text-[#AEEECB] transition-colors flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#012D1D] tracking-tight font-heading">
                {kpis.totalCustomers.value}
              </span>
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 font-mono">
                <ArrowUpRight className="w-3 h-3" />
                {kpis.totalCustomers.growth}
              </span>
            </div>
            <p className="text-[11px] text-[#717973] font-medium truncate">
              {kpis.totalCustomers.subtext}
            </p>
          </div>
        </Link>

        {/* KPI 3: Total Products */}
        <Link
          to="/admin/products"
          className="group p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 hover:border-[#2C694E] transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#717973] font-mono">
              Total Products
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F3FCF3] text-[#012D1D] group-hover:bg-[#012D1D] group-hover:text-[#AEEECB] transition-colors flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#012D1D] tracking-tight font-heading">
                {kpis.totalProducts.value}
              </span>
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 font-mono">
                <ArrowUpRight className="w-3 h-3" />
                {kpis.totalProducts.growth}
              </span>
            </div>
            <p className="text-[11px] text-[#717973] font-medium truncate">
              {kpis.totalProducts.subtext}
            </p>
          </div>
        </Link>

        {/* KPI 4: Total Orders */}
        <Link
          to="/admin/orders"
          className="group p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 hover:border-[#2C694E] transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#717973] font-mono">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F3FCF3] text-[#012D1D] group-hover:bg-[#012D1D] group-hover:text-[#AEEECB] transition-colors flex items-center justify-center shrink-0">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#012D1D] tracking-tight font-heading">
                {kpis.totalOrders.value}
              </span>
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 font-mono">
                <ArrowUpRight className="w-3 h-3" />
                {kpis.totalOrders.growth}
              </span>
            </div>
            <p className="text-[11px] text-[#717973] font-medium truncate">
              {kpis.totalOrders.subtext}
            </p>
          </div>
        </Link>

        {/* KPI 5: Total Platform Revenue */}
        <Link
          to="/admin/analytics"
          className="group p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 hover:border-[#2C694E] transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#717973] font-mono">
              Platform GMV
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F3FCF3] text-[#012D1D] group-hover:bg-[#012D1D] group-hover:text-[#AEEECB] transition-colors flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl xl:text-lg 2xl:text-xl font-black text-[#012D1D] tracking-tight font-heading">
                {kpis.totalRevenue.value}
              </span>
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 font-mono">
                <ArrowUpRight className="w-3 h-3" />
                {kpis.totalRevenue.growth}
              </span>
            </div>
            <p className="text-[11px] text-[#717973] font-medium truncate">
              {kpis.totalRevenue.subtext}
            </p>
          </div>
        </Link>

        {/* KPI 6: Pending Support Tickets */}
        <Link
          to="/admin/support"
          className="group p-4 rounded-2xl bg-white border border-amber-300/80 hover:border-amber-500 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 font-mono">
              Pending Tickets
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-950 tracking-tight font-heading">
                {kpis.pendingTickets.value}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold font-mono">
                {kpis.pendingTickets.urgentCount} Urgent
              </span>
            </div>
            <p className="text-[11px] text-amber-800/80 font-medium truncate">
              {kpis.pendingTickets.subtext}
            </p>
          </div>
        </Link>
      </div>

      {/* 2 & 3. SALES OVERVIEW & REVENUE TREND CHART (Side-by-side) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Overview Filter Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#C1C8C2]/60 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-[#012D1D] font-heading">
                  Sales Overview
                </h2>
                <p className="text-xs text-[#717973] font-medium">
                  Aggregated GMV and net platform commissions.
                </p>
              </div>

              {/* Time Range Filter Pill */}
              <div className="inline-flex p-1 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/50 self-start sm:self-auto">
                {['Today', '7D', '30D', 'Year'].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      timeRange === range
                        ? 'bg-[#012D1D] text-white shadow-2xs'
                        : 'text-[#717973] hover:text-[#012D1D]'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Range Big Numbers */}
            <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#C1C8C2]/50 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973] font-mono">
                Gross Merchandising Value ({timeRange})
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-3xl font-black text-[#012D1D] tracking-tight font-heading">
                  {salesOverview.gmv}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-emerald-600 font-mono">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {salesOverview.growth}
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-center">
                <span className="block text-[10px] font-bold text-[#717973] uppercase font-mono">
                  Orders
                </span>
                <span className="text-base font-extrabold text-[#012D1D] mt-0.5 block">
                  {salesOverview.orders}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-center">
                <span className="block text-[10px] font-bold text-[#717973] uppercase font-mono">
                  Avg Ticket (AOV)
                </span>
                <span className="text-base font-extrabold text-[#012D1D] mt-0.5 block">
                  {salesOverview.aov}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-center">
                <span className="block text-[10px] font-bold text-[#0E5138] uppercase font-mono">
                  Commission (5%)
                </span>
                <span className="text-base font-extrabold text-[#0E5138] mt-0.5 block">
                  {salesOverview.platformCommission}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Links Footer */}
          <div className="pt-4 border-t border-[#C1C8C2]/40 flex items-center justify-between text-xs">
            <Link
              to="/admin/payments"
              className="text-[#2C694E] hover:text-[#012D1D] font-bold inline-flex items-center gap-1"
            >
              <span>Settlements & Escrows</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[11px] font-mono text-[#717973]">
              Target: ₹50.0L
            </span>
          </div>
        </div>

        {/* Revenue Trend SVG Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#C1C8C2]/60 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#012D1D] font-heading">
                  Revenue Progression
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#AEEECB] text-[#0E5138] text-[10px] font-mono font-bold">
                  6-Month Trend
                </span>
              </div>
              <p className="text-xs text-[#717973] font-medium">
                Monthly gross platform volume in INR lakhs with growth trajectory.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#717973]">
              <span className="inline-block w-3 h-1 bg-[#012D1D] rounded" />
              <span>GMV Line</span>
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="relative w-full overflow-hidden py-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 sm:h-52 overflow-visible"
            >
              <defs>
                <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#AEEECB" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#AEEECB" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line
                  key={i}
                  x1={paddingX}
                  y1={chartHeight - paddingY - ratio * availableHeight}
                  x2={chartWidth - paddingX}
                  y2={chartHeight - paddingY - ratio * availableHeight}
                  stroke="#E3EBE4"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              ))}

              {/* Gradient Area */}
              <path d={areaD} fill="url(#adminRevenueGradient)" />

              {/* Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#012D1D"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              {points.map((pt, idx) => {
                const isHovered = hoveredMonth === pt.month;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredMonth(pt.month)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    {/* Outer pulse circle when hovered */}
                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="8"
                        fill="#AEEECB"
                        fillOpacity="0.7"
                      />
                    )}
                    {/* Point circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 5 : 4}
                      fill={isHovered ? '#012D1D' : '#ffffff'}
                      stroke="#012D1D"
                      strokeWidth="2"
                    />
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <g>
                        <rect
                          x={pt.x - 42}
                          y={pt.y - 34}
                          width="84"
                          height="26"
                          rx="6"
                          fill="#012D1D"
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 17}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {pt.displayRev} ({pt.orders})
                        </text>
                      </g>
                    )}
                    {/* Month Label */}
                    <text
                      x={pt.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      fill="#717973"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {pt.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Chart Summary Footer Strip */}
          <div className="flex items-center justify-between text-xs pt-3 border-t border-[#C1C8C2]/40 text-[#717973]">
            <span>Peak: <strong className="text-[#012D1D]">₹48.25 Lakhs (October)</strong></span>
            <span className="font-mono text-[11px]">+96.9% Growth Since May</span>
          </div>
        </div>
      </div>

      {/* 4. ORDER STATUS SUMMARY */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#012D1D] font-heading">
                Order Pipeline & Fulfillment Status
              </h2>
              <span className="text-xs font-mono font-bold text-[#717973]">
                (642 Total Records)
              </span>
            </div>
            <p className="text-xs text-[#717973] font-medium">
              Real-time lifecycle distribution across 24 authorized regional dealers.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#012D1D] hover:text-[#2C694E] inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-3 w-full rounded-full bg-neutral-100 flex overflow-hidden shadow-inner">
          {orderStatusSummary.map((item, idx) => (
            <div
              key={idx}
              style={{ width: `${item.percent}%` }}
              className={`${item.color} h-full transition-all duration-300`}
              title={`${item.status}: ${item.count} (${item.percent}%)`}
            />
          ))}
        </div>

        {/* Status Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {orderStatusSummary.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[#F8FAF8] border border-[#C1C8C2]/40 hover:border-[#2C694E]/50 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-xs font-bold text-[#151D18]">
                  {item.status}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-lg font-black text-[#012D1D] font-mono">
                  {item.count}
                </span>
                <span className="text-[11px] font-mono text-[#717973] font-medium">
                  {item.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. TWO-COLUMN BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Top-Selling Products & Dealer Scorecards (6 or 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Selling Products */}
          <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#012D1D] font-heading">
                  Top-Selling Platform Products
                </h3>
                <p className="text-xs text-[#717973] font-medium">
                  Leading catalog SKUs by revenue and unit velocity.
                </p>
              </div>

              <Link
                to="/admin/products"
                className="text-xs font-bold text-[#012D1D] hover:text-[#2C694E] inline-flex items-center gap-1"
              >
                <span>Full Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#C1C8C2]/50 text-[#717973] font-mono uppercase text-[10px]">
                    <th className="pb-2.5 font-bold">#</th>
                    <th className="pb-2.5 font-bold">Product & SKU</th>
                    <th className="pb-2.5 font-bold">Dealer</th>
                    <th className="pb-2.5 font-bold text-right">Units</th>
                    <th className="pb-2.5 font-bold text-right">GMV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C1C8C2]/30">
                  {topProducts.map((prod, index) => (
                    <tr key={prod.id} className="hover:bg-[#F8FAF8] transition-colors">
                      <td className="py-3 font-mono font-bold text-[#717973]">
                        0{index + 1}
                      </td>
                      <td className="py-3 pr-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#151D18] line-clamp-1">
                            {prod.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#717973]">
                            {prod.sku} • {prod.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-[#3F4943] whitespace-nowrap">
                        <span className="text-xs font-medium">
                          {prod.dealer}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-[#012D1D]">
                        {prod.unitsSold}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-[#0E5138]">
                        {prod.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dealer Performance Scorecard */}
          <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#012D1D] font-heading">
                  Dealer Performance Scorecard
                </h3>
                <p className="text-xs text-[#717973] font-medium">
                  Fulfillment reliability, active catalog size, and SLA benchmarks.
                </p>
              </div>

              <Link
                to="/admin/dealers"
                className="text-xs font-bold text-[#012D1D] hover:text-[#2C694E] inline-flex items-center gap-1"
              >
                <span>View All 24</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {dealerPerformance.map((dealer) => (
                <div
                  key={dealer.dealerId}
                  className="p-3.5 rounded-2xl bg-[#F8FAF8] border border-[#C1C8C2]/40 hover:border-[#2C694E]/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-extrabold text-[#012D1D]">
                        {dealer.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#AEEECB]/60 text-[#0E5138]">
                        {dealer.tier}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#717973]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#717973]" />
                        {dealer.location}
                      </span>
                      <span>•</span>
                      <span>{dealer.activeProducts} Products</span>
                      <span>•</span>
                      <span>{dealer.totalOrders} Orders</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-mono text-[#717973] block">
                        Fulfillment SLA
                      </span>
                      <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {dealer.fulfillmentSLA}
                      </span>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="text-[10px] uppercase font-mono text-[#717973] block">
                        Gross GMV
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#012D1D] font-mono">
                        {dealer.grossRevenue}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Orders & Recent Escalations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Platform Orders */}
          <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#012D1D] font-heading">
                  Recent Orders
                </h3>
                <p className="text-xs text-[#717973] font-medium">
                  Live checkout events across all dealer hubs.
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="text-xs font-bold text-[#012D1D] hover:text-[#2C694E] inline-flex items-center gap-1"
              >
                <span>Live Feed</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3 rounded-2xl bg-[#F8FAF8] border border-[#C1C8C2]/40 hover:bg-white hover:border-[#2C694E]/50 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-[#012D1D]">
                        #{ord.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadge(
                          ord.orderStatus
                        )}`}
                      >
                        {ord.orderStatus}
                      </span>
                    </div>
                    <span className="font-mono font-extrabold text-xs text-[#012D1D]">
                      {ord.amountFormatted}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#717973]">
                    <span className="truncate max-w-[200px]" title={ord.customer}>
                      {ord.customer}
                    </span>
                    <span className="font-mono shrink-0">{ord.date}</span>
                  </div>

                  <div className="text-[10px] font-mono text-[#0E5138] flex items-center justify-between">
                    <span className="truncate">Dealer: {ord.dealer}</span>
                    <span className="bg-[#E3EBE4] px-1.5 py-0.2 rounded text-[#012D1D]">
                      {ord.paymentMethod}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Escalated Support Tickets */}
          <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#012D1D] font-heading">
                    Support Escalations
                  </h3>
                  <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono font-bold">
                    Priority Queue
                  </span>
                </div>
                <p className="text-xs text-[#717973] font-medium">
                  Unresolved transit claims, GST invoices, and merchant inquiries.
                </p>
              </div>

              <Link
                to="/admin/support"
                className="text-xs font-bold text-[#012D1D] hover:text-[#2C694E] inline-flex items-center gap-1"
              >
                <span>Tickets</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentTickets.map((tck) => (
                <div
                  key={tck.id}
                  className="p-3 rounded-2xl bg-[#F8FAF8] border border-[#C1C8C2]/40 hover:bg-white hover:border-amber-400 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#717973]">
                        #{tck.id}
                      </span>
                      <span
                        className={`px-2 py-0.2 rounded text-[10px] font-mono border ${getPriorityBadge(
                          tck.priority
                        )}`}
                      >
                        {tck.priority}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#717973]">
                      {tck.date}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#151D18] line-clamp-1">
                    {tck.subject}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#717973] pt-0.5">
                    <span className="truncate max-w-[180px]">
                      By: {tck.requester}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F3FCF3] text-[#0E5138] border border-[#C1C8C2]/50 font-bold">
                      {tck.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

