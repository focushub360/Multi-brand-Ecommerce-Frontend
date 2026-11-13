import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  getAdminAnalytics,
  getAdminTopSellingProducts
} from '../../services/adminService';

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('monthly'); // 'daily', 'weekly', 'monthly'
  const [analytics, setAnalytics] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    document.title = 'Sales & Analytics | GROVE Admin';
    window.scrollTo(0, 0);
    setAnalytics(getAdminAnalytics());
  }, []);

  const trendData = useMemo(() => {
    if (!analytics) return [];
    if (period === 'daily') return analytics.dailyTrend || [];
    if (period === 'weekly') return analytics.weeklyTrend || [];
    return analytics.monthlyTrend || [];
  }, [analytics, period]);

  const topProducts = getAdminTopSellingProducts();

  // SVG Chart calculation
  const maxRevenue = trendData.length > 0 ? Math.max(...trendData.map((d) => d.revenue)) : 100000;
  const chartHeight = 180;
  const chartWidth = 600;
  const paddingX = 45;
  const paddingY = 30;
  const availableWidth = chartWidth - paddingX * 2;
  const availableHeight = chartHeight - paddingY * 2;

  const points = trendData.map((d, index) => {
    const x = paddingX + (index / Math.max(1, trendData.length - 1)) * availableWidth;
    const y = chartHeight - paddingY - (d.revenue / maxRevenue) * availableHeight;
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  if (!analytics) return null;

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Platform Commercial Intelligence"
        subtitle="Aggregated gross merchandising volume (GMV), dealer cohort revenue shares, and agricultural category velocity."
        badge="Analytics Engine"
        breadcrumbs={[{ label: 'Analytics' }]}
        actions={
          <div className="inline-flex p-1 rounded-xl bg-white border border-[#C1C8C2]/60 shadow-2xs">
            {['daily', 'weekly', 'monthly'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                  period === p
                    ? 'bg-[#012D1D] text-white shadow-2xs'
                    : 'text-[#717973] hover:text-[#012D1D]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        }
      />

      {/* 1. KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-[#717973]">Gross Merchandising Value</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#012D1D] font-heading">{analytics.kpis.totalGmv}</span>
            <span className="text-[11px] font-mono text-emerald-600 font-bold">{analytics.kpis.growthPercent}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-[#717973]">Total Orders Fulfilled</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#012D1D] font-heading">{analytics.kpis.totalOrders}</span>
            <span className="text-[11px] font-mono text-emerald-600 font-bold">+14.2%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-[#717973]">Average Order Value (AOV)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#012D1D] font-heading">{analytics.kpis.avgOrderValue}</span>
            <span className="text-[11px] font-mono text-[#717973]">per ticket</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-800">Net Commission Retained</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#0E5138] font-heading">{analytics.kpis.commissionEarned}</span>
            <span className="text-[11px] font-mono text-emerald-700 font-bold">5.0% take</span>
          </div>
        </div>
      </div>

      {/* 2. SVG Sales Trend Chart */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#012D1D] font-heading">
              Sales Velocity &amp; Revenue Curve ({period.toUpperCase()})
            </h3>
            <p className="text-xs text-[#717973]">
              Dynamic telemetry visualization of checkout volumes in INR.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#0E5138] bg-[#F3FCF3] px-2.5 py-1 rounded-full border border-[#C1C8C2]/40">
            Live Telemetry
          </span>
        </div>

        <div className="relative w-full overflow-hidden py-2">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 sm:h-56 overflow-visible">
            <defs>
              <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#AEEECB" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#AEEECB" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid */}
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

            <path d={areaD} fill="url(#analyticsGradient)" />
            <path d={pathD} fill="none" stroke="#012D1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {points.map((pt, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {isHovered && <circle cx={pt.x} cy={pt.y} r="8" fill="#AEEECB" fillOpacity="0.7" />}
                  <circle cx={pt.x} cy={pt.y} r={isHovered ? 5 : 4} fill={isHovered ? '#012D1D' : '#ffffff'} stroke="#012D1D" strokeWidth="2" />
                  {isHovered && (
                    <g>
                      <rect x={pt.x - 45} y={pt.y - 32} width="90" height="24" rx="6" fill="#012D1D" />
                      <text x={pt.x} y={pt.y - 16} textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                        {pt.displayRev} ({pt.orders})
                      </text>
                    </g>
                  )}
                  <text x={pt.x} y={chartHeight - 8} textAnchor="middle" fill="#717973" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    {pt.period}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 3. Category Breakdown & Dealer Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#C1C8C2]/60 p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-[#012D1D] font-heading">Category GMV Share</h3>
            <p className="text-xs text-[#717973]">Gross volume breakdown across marketplace verticals.</p>
          </div>

          <div className="space-y-4">
            {analytics.categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#151D18]">{cat.category}</span>
                  <span className="font-mono font-bold text-[#012D1D]">{cat.sharePercent}% ({cat.revenue})</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <div style={{ width: `${cat.sharePercent}%` }} className={`h-full ${cat.color}`} />
                </div>
                <span className="text-[10px] font-mono text-[#717973] block">{cat.orders} completed checkouts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dealer Sales Ranking (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#C1C8C2]/60 p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-[#012D1D] font-heading">Dealer GMV Leaderboard</h3>
            <p className="text-xs text-[#717973]">Top fulfilling merchant enterprises by sales volume.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#C1C8C2]/40 text-[#717973] font-mono uppercase text-[10px]">
                  <th className="pb-2 font-bold">Dealer</th>
                  <th className="pb-2 font-bold text-center">Orders</th>
                  <th className="pb-2 font-bold text-right">GMV</th>
                  <th className="pb-2 font-bold text-right">Share %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C1C8C2]/30">
                {analytics.dealerSalesRanking.map((dealer, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAF8]">
                    <td className="py-2.5 font-bold text-[#151D18]">{dealer.dealerName}</td>
                    <td className="py-2.5 text-center font-mono text-[#717973]">{dealer.orders}</td>
                    <td className="py-2.5 text-right font-mono font-black text-[#012D1D]">{dealer.revenue}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-700">{dealer.sharePercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

