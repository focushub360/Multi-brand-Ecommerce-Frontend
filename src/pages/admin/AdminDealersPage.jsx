import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  getAdminDealers,
  createAdminDealer,
  updateAdminDealer,
  toggleDealerStatus,
  approveDealerKYC,
  toggleDealerPayoutHold,
  syncAdminDataFromApi
} from '../../services/adminService';
import {
  Store,
  Search,
  Plus,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  MapPin,
  FileText,
  CreditCard,
  Eye,
  X,
  UserCheck,
  Ban,
  Unlock,
  Lock,
  PackageCheck
} from 'lucide-react';

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');

  // Modal / Drawer states
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [editCommission, setEditCommission] = useState('');
  const [isEditingCommission, setIsEditingCommission] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  // New Dealer Form State
  const initialFormState = {
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411026',
    warehouseAddress: '',
    gstin: '',
    pan: '',
    tier: 'Silver Tier',
    commissionRate: 5.0,
    status: 'Pending KYC',
    bankName: 'HDFC Bank',
    bankAccountName: '',
    bankAccountNumber: '',
    bankIfsc: ''
  };
  const [newDealerForm, setNewDealerForm] = useState(initialFormState);
  const [formError, setFormError] = useState('');

  // Load dealers
  const loadDealers = () => {
    const list = getAdminDealers();
    setDealers(list);
  };

  useEffect(() => {
    document.title = 'Dealer Management | GROVE Admin';
    window.scrollTo(0, 0);
    loadDealers();
    syncAdminDataFromApi().then(() => {
      loadDealers();
    }).catch(() => {});
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPIs
  const totalCount = dealers.length;
  const activeCount = dealers.filter((d) => d.status === 'Active').length;
  const pendingKYCCount = dealers.filter((d) => d.status === 'Pending KYC' || d.status === 'Under Review').length;
  const avgSla = useMemo(() => {
    if (!dealers.length) return '98.0%';
    const nums = dealers.map((d) => parseFloat(d.fulfillmentSLA || '97.0'));
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    return `${avg.toFixed(1)}%`;
  }, [dealers]);

  // Unique states for filter dropdown
  const uniqueStates = useMemo(() => {
    const set = new Set(dealers.map((d) => d.state).filter(Boolean));
    return Array.from(set);
  }, [dealers]);

  // Filtered dealers
  const filteredDealers = useMemo(() => {
    return dealers.filter((d) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        d.businessName.toLowerCase().includes(q) ||
        d.contactPerson.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.gstin.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q);

      // Status
      const matchStatus = statusFilter === 'All' || d.status === statusFilter;

      // Tier
      const matchTier = tierFilter === 'All' || d.tier === tierFilter;

      // State
      const matchState = stateFilter === 'All' || d.state === stateFilter;

      return matchSearch && matchStatus && matchTier && matchState;
    });
  }, [dealers, searchQuery, statusFilter, tierFilter, stateFilter]);

  // Handlers
  const handleOpenDetail = (dealer) => {
    setSelectedDealer(dealer);
    setEditCommission(String(dealer.commissionRate || 5.0));
    setIsEditingCommission(false);
    setIsDetailOpen(true);
  };

  const handleApproveKYC = (id, e) => {
    if (e) e.stopPropagation();
    const updated = approveDealerKYC(id);
    loadDealers();
    if (selectedDealer && selectedDealer.id === id) {
      setSelectedDealer(updated);
    }
    showToast(`KYC Approved for ${updated?.businessName || 'dealer'}. Payout hold released.`);
  };

  const handleToggleStatus = (id, e) => {
    if (e) e.stopPropagation();
    const updated = toggleDealerStatus(id);
    loadDealers();
    if (selectedDealer && selectedDealer.id === id) {
      setSelectedDealer(updated);
    }
    showToast(`Dealer account status changed to "${updated?.status}".`);
  };

  const handleTogglePayoutHold = (id, e) => {
    if (e) e.stopPropagation();
    const updated = toggleDealerPayoutHold(id);
    loadDealers();
    if (selectedDealer && selectedDealer.id === id) {
      setSelectedDealer(updated);
    }
    showToast(`Payout escrow hold ${updated?.payoutHold ? 'ENABLED' : 'RELEASED'} for ${updated?.businessName}.`);
  };

  const handleSaveCommission = () => {
    const rate = parseFloat(editCommission);
    if (isNaN(rate) || rate < 0 || rate > 30) {
      showToast('Please enter a valid commission rate (0% - 30%).');
      return;
    }
    const updated = updateAdminDealer(selectedDealer.id, { commissionRate: rate });
    loadDealers();
    setSelectedDealer(updated);
    setIsEditingCommission(false);
    showToast(`Commission rate updated to ${rate}% for ${updated.businessName}.`);
  };

  // Submit New Dealer
  const handleCreateDealer = (e) => {
    e.preventDefault();
    setFormError('');

    if (!newDealerForm.businessName.trim()) {
      setFormError('Business name is required.');
      return;
    }
    if (!newDealerForm.contactPerson.trim()) {
      setFormError('Contact person name is required.');
      return;
    }
    if (!newDealerForm.email.trim()) {
      setFormError('Email address is required.');
      return;
    }
    if (!newDealerForm.gstin.trim() || newDealerForm.gstin.length < 10) {
      setFormError('A valid GSTIN is required for merchant compliance.');
      return;
    }

    const created = createAdminDealer(newDealerForm);
    loadDealers();
    setIsOnboardOpen(false);
    setNewDealerForm(initialFormState);
    showToast(`Merchant ${created.businessName} successfully registered (#${created.id}).`);
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Pending KYC':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Under Review':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Suspended':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  // Tier Badge Helper
  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Gold Tier':
        return 'bg-[#AEEECB] text-[#0E5138] border-[#2C694E]/30';
      case 'Silver Tier':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Bronze Tier':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <AdminLayout>
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#012D1D] text-white text-xs font-semibold shadow-xl border border-[#AEEECB]/40 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#AEEECB] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <AdminPageHeader
        title="Dealer Management"
        subtitle="Verify, onboard, monitor, regulate, and configure commission tiers for authorized agricultural equipment and supply partners."
        badge={`${totalCount} Registered Partners`}
        breadcrumbs={[{ label: 'Dealers' }]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => showToast('Dealer directory CSV generated.')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#C1C8C2]/70 text-xs font-bold text-[#151D18] hover:bg-[#F3FCF3] hover:border-[#2C694E] transition-all shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#717973]" />
              <span>Export Directory</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOnboardOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#AEEECB]" />
              <span>Onboard New Dealer</span>
            </button>
          </div>
        }
      />

      {/* 1. Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Dealers */}
        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#717973] font-mono">
              Total Partners
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#012D1D] font-heading">
                {totalCount}
              </span>
              <span className="text-[11px] text-[#717973] font-medium">
                across 5 states
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F3FCF3] text-[#012D1D] flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Active Merchants */}
        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#717973] font-mono">
              Active Merchants
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0E5138] font-heading">
                {activeCount}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live in Store
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0E5138] flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Pending KYC Verification */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Pending KYC' ? 'All' : 'Pending KYC')}
          className="p-4 rounded-2xl bg-white border border-amber-300 shadow-2xs flex items-center justify-between cursor-pointer hover:border-amber-500 transition-colors"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 font-mono">
              Pending KYC / Review
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-950 font-heading">
                {pendingKYCCount}
              </span>
              <span className="text-[11px] text-amber-800 font-medium">
                Awaiting clearance
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Avg SLA Fulfillment */}
        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#717973] font-mono">
              Platform Fulfillment SLA
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#012D1D] font-heading">
                {avgSla}
              </span>
              <span className="text-[11px] text-emerald-600 font-mono font-bold">
                Target: &gt;95%
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F3FCF3] text-[#012D1D] flex items-center justify-center">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top search and selectors */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#717973] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by business, contact, city, or GSTIN..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs sm:text-sm font-medium text-[#151D18] placeholder:text-[#717973] focus:outline-none focus:border-[#012D1D] focus:bg-white transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717973] hover:text-[#151D18]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Tier Select */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              aria-label="Filter dealers by partnership tier"
              className="h-10 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold text-[#151D18] focus:outline-none focus:border-[#012D1D] cursor-pointer"
            >
              <option value="All">All Tiers</option>
              <option value="Gold Tier">Gold Tier</option>
              <option value="Silver Tier">Silver Tier</option>
              <option value="Bronze Tier">Bronze Tier</option>
            </select>

            {/* Region / State Select */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              aria-label="Filter dealers by state region"
              className="h-10 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold text-[#151D18] focus:outline-none focus:border-[#012D1D] cursor-pointer"
            >
              <option value="All">All Regions</option>
              {uniqueStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Reset Filter Button */}
            {(searchQuery || statusFilter !== 'All' || tierFilter !== 'All' || stateFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setTierFilter('All');
                  setStateFilter('All');
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-[#C1C8C2]/30 pt-3">
          {['All', 'Active', 'Pending KYC', 'Under Review', 'Suspended'].map((status) => {
            const count = status === 'All'
              ? dealers.length
              : dealers.filter((d) => d.status === status).length;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[#012D1D] text-white shadow-2xs'
                    : 'bg-[#F3FCF3] text-[#3F4943] hover:bg-[#E3EBE4]'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    statusFilter === status
                      ? 'bg-[#AEEECB] text-[#012D1D]'
                      : 'bg-white text-[#717973]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Dealer Interactive Data Table */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#C1C8C2]/50 bg-[#F8FAF8] text-[#717973] font-mono uppercase text-[10px]">
                <th className="py-3 px-4 font-bold">Dealer Enterprise</th>
                <th className="py-3 px-4 font-bold">Location</th>
                <th className="py-3 px-4 font-bold">GSTIN &amp; Tier</th>
                <th className="py-3 px-3 font-bold text-center">Comm. %</th>
                <th className="py-3 px-4 font-bold text-center">Catalog</th>
                <th className="py-3 px-4 font-bold text-right">GMV (Orders)</th>
                <th className="py-3 px-3 font-bold text-center">SLA</th>
                <th className="py-3 px-4 font-bold text-center">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C1C8C2]/30">
              {filteredDealers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-[#717973]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Store className="w-8 h-8 text-[#C1C8C2]" />
                      <p className="font-semibold text-sm">No dealer records matched your filter criteria.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('All');
                          setTierFilter('All');
                          setStateFilter('All');
                        }}
                        className="text-xs text-[#012D1D] font-bold hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDealers.map((dealer) => {
                  return (
                    <tr
                      key={dealer.id}
                      onClick={() => handleOpenDetail(dealer)}
                      className="hover:bg-[#F8FAF8] transition-colors cursor-pointer group"
                    >
                      {/* Business & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#012D1D] text-[#AEEECB] font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                            {dealer.businessName.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-[#151D18] truncate max-w-[200px] sm:max-w-none">
                              {dealer.businessName}
                            </span>
                            <span className="text-[11px] text-[#717973] flex items-center gap-1.5">
                              <span>{dealer.contactPerson}</span>
                              <span>•</span>
                              <span className="font-mono text-[10px] text-[#012D1D]">#{dealer.id}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-[#3F4943]">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#151D18] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#717973]" />
                            {dealer.city}
                          </span>
                          <span className="text-[11px] text-[#717973]">
                            {dealer.state} • {dealer.pincode}
                          </span>
                        </div>
                      </td>

                      {/* GSTIN & Tier */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="font-mono text-[11px] font-bold text-[#151D18]">
                            {dealer.gstin}
                          </span>
                          <span
                            className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold border ${getTierBadge(
                              dealer.tier
                            )}`}
                          >
                            {dealer.tier}
                          </span>
                        </div>
                      </td>

                      {/* Commission % */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-[#F3FCF3] font-mono font-bold text-[#0E5138] border border-[#AEEECB]/60">
                          {dealer.commissionRate}%
                        </span>
                      </td>

                      {/* Active Listings */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#151D18]">
                        <span>{dealer.activeListings}</span>
                        <span className="text-[10px] text-[#717973] block font-normal">items</span>
                      </td>

                      {/* Gross GMV & Orders */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-mono font-extrabold text-xs text-[#012D1D]">
                            {dealer.grossRevenue}
                          </span>
                          <span className="text-[10px] text-[#717973] font-mono">
                            {dealer.totalOrders} fulfilled
                          </span>
                        </div>
                      </td>

                      {/* SLA % */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            parseFloat(dealer.fulfillmentSLA) >= 97
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {dealer.fulfillmentSLA}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadge(
                              dealer.status
                            )}`}
                          >
                            {dealer.status}
                          </span>
                          {dealer.payoutHold && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              <Lock className="w-2.5 h-2.5" /> Hold
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve KYC Button if pending */}
                          {(dealer.status === 'Pending KYC' || dealer.status === 'Under Review') && (
                            <button
                              type="button"
                              onClick={(e) => handleApproveKYC(dealer.id, e)}
                              title="Approve KYC and release hold"
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                          )}

                          {/* Quick Inspect Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(dealer)}
                            className="p-1.5 rounded-lg text-[#717973] hover:text-[#012D1D] hover:bg-[#F3FCF3] transition-colors cursor-pointer"
                            title="Inspect Dealer File"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Suspend / Reactivate */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleStatus(dealer.id, e)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              dealer.status === 'Suspended'
                                ? 'text-emerald-700 hover:bg-emerald-50'
                                : 'text-[#717973] hover:text-red-700 hover:bg-red-50'
                            }`}
                            title={dealer.status === 'Suspended' ? 'Reactivate Dealer' : 'Suspend Account'}
                          >
                            {dealer.status === 'Suspended' ? (
                              <Unlock className="w-4 h-4" />
                            ) : (
                              <Ban className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer info */}
        <div className="p-4 border-t border-[#C1C8C2]/40 bg-[#F8FAF8] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#717973] font-mono">
          <span>Showing {filteredDealers.length} of {dealers.length} total dealer records</span>
          <div className="flex items-center gap-3">
            <span>Commission Range: 4.0% – 6.5%</span>
            <span>•</span>
            <span className="text-[#012D1D] font-bold">Direct RTGS / Razorpay Escrow Linked</span>
          </div>
        </div>
      </div>

      {/* 4. MODAL A: Dealer Detail Slide-Over / Modal */}
      {isDetailOpen && selectedDealer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-[#012D1D]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDetailOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#C1C8C2]/70 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-[#012D1D] p-5 sm:p-6 text-white flex items-start justify-between shrink-0">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#AEEECB] flex items-center justify-center font-bold text-lg font-mono">
                  {selectedDealer.businessName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold font-heading">
                      {selectedDealer.businessName}
                    </h3>
                    <span className="font-mono text-xs text-[#AEEECB]">
                      #{selectedDealer.id}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    {selectedDealer.contactPerson} • {selectedDealer.email} • {selectedDealer.phone}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="p-1 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Quick Status / Controls Strip */}
              <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#C1C8C2]/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#717973] uppercase font-mono text-[10px]">Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-xs border ${getStatusBadge(selectedDealer.status)}`}>
                    {selectedDealer.status}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-xs border ${getTierBadge(selectedDealer.tier)}`}>
                    {selectedDealer.tier}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Approve button if pending */}
                  {(selectedDealer.status === 'Pending KYC' || selectedDealer.status === 'Under Review') && (
                    <button
                      type="button"
                      onClick={() => handleApproveKYC(selectedDealer.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Approve KYC Application
                    </button>
                  )}

                  {/* Payout Hold Toggle */}
                  <button
                    type="button"
                    onClick={() => handleTogglePayoutHold(selectedDealer.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 border ${
                      selectedDealer.payoutHold
                        ? 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                        : 'bg-white text-[#3F4943] border-[#C1C8C2]/60 hover:bg-[#F3FCF3]'
                    }`}
                  >
                    {selectedDealer.payoutHold ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>{selectedDealer.payoutHold ? 'Payouts Locked' : 'Payouts Active'}</span>
                  </button>
                </div>
              </div>

              {/* Performance Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-center">
                  <span className="text-[10px] font-mono uppercase text-[#717973] font-bold">Listings</span>
                  <span className="text-base font-black text-[#012D1D] block mt-0.5">{selectedDealer.activeListings} items</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-center">
                  <span className="text-[10px] font-mono uppercase text-[#717973] font-bold">Fulfilled Orders</span>
                  <span className="text-base font-black text-[#012D1D] block mt-0.5">{selectedDealer.totalOrders}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-center">
                  <span className="text-[10px] font-mono uppercase text-[#717973] font-bold">Gross GMV</span>
                  <span className="text-base font-black text-[#0E5138] block mt-0.5">{selectedDealer.grossRevenue}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-center">
                  <span className="text-[10px] font-mono uppercase text-[#717973] font-bold">Fulfillment SLA</span>
                  <span className="text-base font-black text-emerald-700 block mt-0.5">{selectedDealer.fulfillmentSLA}</span>
                </div>
              </div>

              {/* Warehouse & Tax Identifiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Warehouse */}
                <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#C1C8C2]/50 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#012D1D]">
                    <Building2 className="w-4 h-4 text-[#2C694E]" />
                    <span>Logistics Depot &amp; Facility</span>
                  </div>
                  <p className="text-[#3F4943] leading-relaxed">
                    {selectedDealer.warehouseAddress}
                  </p>
                  <p className="text-[11px] font-mono text-[#717973]">
                    {selectedDealer.city}, {selectedDealer.state} - {selectedDealer.pincode}
                  </p>
                </div>

                {/* Tax & Banking */}
                <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#C1C8C2]/50 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#012D1D]">
                    <CreditCard className="w-4 h-4 text-[#2C694E]" />
                    <span>Banking &amp; Settlement Account</span>
                  </div>
                  <div className="text-[11px] font-mono space-y-1 text-[#3F4943]">
                    <div>Bank: <strong className="text-[#012D1D]">{selectedDealer.bankDetails?.bankName}</strong></div>
                    <div>A/C Name: <strong className="text-[#012D1D]">{selectedDealer.bankDetails?.accountName}</strong></div>
                    <div>A/C No: <strong className="text-[#012D1D]">{selectedDealer.bankDetails?.accountNumber}</strong></div>
                    <div>IFSC: <strong className="text-[#012D1D]">{selectedDealer.bankDetails?.ifsc}</strong></div>
                  </div>
                </div>
              </div>

              {/* Commission Rate Setting */}
              <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-[#012D1D] text-xs">
                      Platform Take-Rate (Commission %)
                    </span>
                    <p className="text-[11px] text-[#717973]">
                      Percentage deducted automatically upon buyer escrow milestone settlement.
                    </p>
                  </div>

                  {!isEditingCommission ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingCommission(true)}
                      className="px-3 py-1 rounded-lg bg-[#F3FCF3] hover:bg-[#E3EBE4] border border-[#C1C8C2]/60 font-bold text-xs text-[#012D1D] transition-colors cursor-pointer"
                    >
                      Edit Rate
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="30"
                        value={editCommission}
                        onChange={(e) => setEditCommission(e.target.value)}
                        className="w-20 h-8 px-2 rounded-lg bg-[#F8FAF8] border border-[#012D1D] font-mono font-bold text-xs text-center"
                      />
                      <button
                        type="button"
                        onClick={handleSaveCommission}
                        className="px-2.5 py-1 rounded-lg bg-[#012D1D] text-white font-bold text-xs hover:bg-[#1B4332] cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingCommission(false)}
                        className="p-1 text-[#717973] hover:text-[#151D18]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {!isEditingCommission && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black font-mono text-[#0E5138]">
                      {selectedDealer.commissionRate}%
                    </span>
                    <span className="text-[11px] text-[#717973] font-mono">
                      (Gross Take Rate)
                    </span>
                  </div>
                )}
              </div>

              {/* KYC Document Verification Matrix */}
              <div className="space-y-2.5">
                <span className="font-bold uppercase tracking-wider text-[#717973] font-mono text-[10px] block">
                  Mandatory Compliance Verification Documents
                </span>
                <div className="space-y-2">
                  {selectedDealer.kycDocuments?.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/40 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#717973]" />
                        <span className="font-semibold text-[#151D18]">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-[#717973]">{doc.uploadDate}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            doc.status === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#C1C8C2]/50 bg-[#F8FAF8] flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono text-[#717973]">
                Joined Platform: {selectedDealer.joinedDate}
              </span>
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#012D1D] text-white font-bold text-xs hover:bg-[#1B4332] cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL B: Onboard New Dealer Form */}
      {isOnboardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-[#012D1D]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOnboardOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#C1C8C2]/70 shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="bg-[#012D1D] p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-extrabold font-heading">
                  Onboard Authorized Dealership
                </h3>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Register a regional tractor, implement or fertilizer distributor into the GROVE network.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOnboardOpen(false)}
                className="p-1 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateDealer} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Section 1: Business Profile */}
              <div className="space-y-3">
                <span className="font-bold uppercase tracking-wider text-[#717973] font-mono text-[10px] block">
                  1. Business Identity &amp; Contact
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      Business / Trading Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDealerForm.businessName}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, businessName: e.target.value })}
                      placeholder="e.g. Sahyadri Agro Harvesters"
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium focus:outline-none focus:border-[#012D1D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      Primary Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDealerForm.contactPerson}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, contactPerson: e.target.value })}
                      placeholder="e.g. Vikram Deshmukh"
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium focus:outline-none focus:border-[#012D1D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={newDealerForm.email}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, email: e.target.value })}
                      placeholder="dealer@grove.com"
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium focus:outline-none focus:border-[#012D1D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDealerForm.phone}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, phone: e.target.value })}
                      placeholder="+91 98200 00000"
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium focus:outline-none focus:border-[#012D1D]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Location & Warehouse */}
              <div className="space-y-3 pt-2 border-t border-[#C1C8C2]/30">
                <span className="font-bold uppercase tracking-wider text-[#717973] font-mono text-[10px] block">
                  2. Regional Location &amp; Warehouse Depot
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      State *
                    </label>
                    <select
                      value={newDealerForm.state}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, state: e.target.value })}
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium focus:outline-none focus:border-[#012D1D]"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Gujarat">Gujarat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDealerForm.city}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, city: e.target.value })}
                      placeholder="e.g. Pune"
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium focus:outline-none focus:border-[#012D1D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      Postal Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDealerForm.pincode}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, pincode: e.target.value })}
                      placeholder="411026"
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium focus:outline-none focus:border-[#012D1D]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      Depot / Facility Physical Address
                    </label>
                    <input
                      type="text"
                      value={newDealerForm.warehouseAddress}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, warehouseAddress: e.target.value })}
                      placeholder="Plot 12, MIDC Industrial Area, Heavy Bay #2"
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium focus:outline-none focus:border-[#012D1D]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Tax & Commercials */}
              <div className="space-y-3 pt-2 border-t border-[#C1C8C2]/30">
                <span className="font-bold uppercase tracking-wider text-[#717973] font-mono text-[10px] block">
                  3. Tax Compliance &amp; Commercial Terms
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      GSTIN (15 Digits) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDealerForm.gstin}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, gstin: e.target.value.toUpperCase() })}
                      placeholder="27AABCA1234F1Z5"
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono font-bold focus:outline-none focus:border-[#012D1D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      Dealer Tier
                    </label>
                    <select
                      value={newDealerForm.tier}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, tier: e.target.value })}
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium focus:outline-none focus:border-[#012D1D]"
                    >
                      <option value="Gold Tier">Gold Tier</option>
                      <option value="Silver Tier">Silver Tier</option>
                      <option value="Bronze Tier">Bronze Tier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      Commission %
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="30"
                      value={newDealerForm.commissionRate}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, commissionRate: e.target.value })}
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono font-bold text-center focus:outline-none focus:border-[#012D1D]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Settlement Banking */}
              <div className="space-y-3 pt-2 border-t border-[#C1C8C2]/30">
                <span className="font-bold uppercase tracking-wider text-[#717973] font-mono text-[10px] block">
                  4. Escrow Payout Banking Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={newDealerForm.bankName}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, bankName: e.target.value })}
                      placeholder="e.g. HDFC Bank"
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium focus:outline-none focus:border-[#012D1D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      Account Beneficiary Name
                    </label>
                    <input
                      type="text"
                      value={newDealerForm.bankAccountName}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, bankAccountName: e.target.value })}
                      placeholder="e.g. Sahyadri Harvesters Pvt Ltd"
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium focus:outline-none focus:border-[#012D1D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={newDealerForm.bankAccountNumber}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, bankAccountNumber: e.target.value })}
                      placeholder="9120200849921"
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono focus:outline-none focus:border-[#012D1D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={newDealerForm.bankIfsc}
                      onChange={(e) => setNewDealerForm({ ...newDealerForm, bankIfsc: e.target.value.toUpperCase() })}
                      placeholder="HDFC0001248"
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono font-bold focus:outline-none focus:border-[#012D1D]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#C1C8C2]/40 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsOnboardOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#C1C8C2]/70 text-[#3F4943] hover:bg-[#F3FCF3] font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  Complete Merchant Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

