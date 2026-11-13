import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  getAdminPaymentSummary,
  releaseDealerPayout,
  syncAdminDataFromApi
} from '../../services/adminService';
import {
  Search,
  CheckCircle2
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const [paymentsData, setPaymentsData] = useState(null);
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' or 'settlements'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = () => {
    setPaymentsData(getAdminPaymentSummary());
  };

  useEffect(() => {
    document.title = 'Payments & Settlements | GROVE Admin';
    window.scrollTo(0, 0);
    loadData();
    syncAdminDataFromApi().then(() => {
      loadData();
    }).catch(() => {});
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReleasePayout = (batchId) => {
    releaseDealerPayout(batchId);
    loadData();
    showToast(`Released payout batch #${batchId} to dealer bank account.`);
  };

  const filteredTransactions = useMemo(() => {
    if (!paymentsData?.transactions) return [];
    return paymentsData.transactions.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.orderId.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.dealer.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'All' || t.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [paymentsData, searchQuery, statusFilter]);

  if (!paymentsData) return null;

  return (
    <AdminLayout>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#012D1D] text-white text-xs font-semibold shadow-xl border border-[#AEEECB]/40 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#AEEECB] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <AdminPageHeader
        title="Payments & Escrow Settlements"
        subtitle="Gateway reconciliation (Razorpay, RTGS, NEFT), dealer payout ledger, and platform take-rate accounting."
        badge={paymentsData.summary.totalVolume}
        breadcrumbs={[{ label: 'Payments' }]}
      />

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-[#717973]">Gross MERCHANDISE Volume</span>
          <span className="text-2xl font-black text-[#012D1D] block mt-1">{paymentsData.summary.totalVolume}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-amber-900">Held in Escrow</span>
          <span className="text-2xl font-black text-amber-950 block mt-1">{paymentsData.summary.escrowHeld}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-800">Settled to Dealers</span>
          <span className="text-2xl font-black text-[#0E5138] block mt-1">{paymentsData.summary.settledToDealers}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-[#717973]">Retained Commission</span>
          <span className="text-2xl font-black text-[#012D1D] block mt-1">{paymentsData.summary.commissionRetained}</span>
        </div>
      </div>

      {/* 2. Tabs */}
      <div className="flex items-center gap-2 border-b border-[#C1C8C2]/40 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'transactions'
              ? 'bg-[#012D1D] text-white shadow-2xs'
              : 'bg-white text-[#717973] hover:bg-[#F3FCF3]'
          }`}
        >
          Customer Transactions ({paymentsData.transactions?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settlements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'settlements'
              ? 'bg-[#012D1D] text-white shadow-2xs'
              : 'bg-white text-[#717973] hover:bg-[#F3FCF3]'
          }`}
        >
          Dealer Settlement Batches ({paymentsData.dealerSettlements?.length || 0})
        </button>
      </div>

      {/* Tab 1: Customer Transactions */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#717973] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transaction ID, order #, buyer, or dealer..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium text-[#151D18] focus:outline-none focus:border-[#012D1D]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold text-[#151D18]"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#C1C8C2]/50 bg-[#F8FAF8] text-[#717973] font-mono uppercase text-[10px]">
                    <th className="py-3 px-4 font-bold">Transaction ID</th>
                    <th className="py-3 px-4 font-bold">Order ID</th>
                    <th className="py-3 px-4 font-bold">Customer Buyer</th>
                    <th className="py-3 px-4 font-bold">Dealer</th>
                    <th className="py-3 px-4 font-bold text-right">Amount</th>
                    <th className="py-3 px-3 font-bold text-center">Gateway</th>
                    <th className="py-3 px-4 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C1C8C2]/30">
                  {filteredTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-[#F8FAF8] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#012D1D]">{txn.id}</td>
                      <td className="py-3.5 px-4 font-mono text-[#717973]">#{txn.orderId}</td>
                      <td className="py-3.5 px-4 font-bold text-[#151D18]">{txn.customer}</td>
                      <td className="py-3.5 px-4 text-[#3F4943]">{txn.dealer}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-black text-[#012D1D]">{txn.amountFormatted}</td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-[#F3FCF3] border border-[#C1C8C2]/50 font-mono text-[10px] text-[#0E5138]">
                          {txn.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          txn.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dealer Settlements */}
      {activeTab === 'settlements' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#C1C8C2]/50 bg-[#F8FAF8] text-[#717973] font-mono uppercase text-[10px]">
                    <th className="py-3 px-4 font-bold">Batch ID &amp; Dealer</th>
                    <th className="py-3 px-4 font-bold">Disbursement Bank</th>
                    <th className="py-3 px-3 font-bold text-center">Orders</th>
                    <th className="py-3 px-4 font-bold text-right">Gross GMV</th>
                    <th className="py-3 px-4 font-bold text-right">Commission</th>
                    <th className="py-3 px-4 font-bold text-right">Net Payout</th>
                    <th className="py-3 px-4 font-bold text-center">Settlement Status</th>
                    <th className="py-3 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C1C8C2]/30">
                  {paymentsData.dealerSettlements?.map((batch) => (
                    <tr key={batch.id} className="hover:bg-[#F8FAF8] transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#012D1D] block">{batch.id}</span>
                        <span className="font-extrabold text-[#151D18]">{batch.dealerName}</span>
                      </td>

                      <td className="py-3.5 px-4 text-[#717973] font-mono text-[11px]">
                        {batch.bankAccount}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-bold text-[#151D18]">
                        {batch.orderCount}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#151D18]">
                        {batch.grossSalesFormatted}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-emerald-800">
                        -{batch.commissionDeductedFormatted}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-black text-[#012D1D]">
                        {batch.netPayoutFormatted}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          batch.status === 'Settled'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : batch.status === 'Pending Clearance'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}>
                          {batch.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {batch.status === 'Pending Clearance' ? (
                          <button
                            type="button"
                            onClick={() => handleReleasePayout(batch.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                          >
                            Release Payout
                          </button>
                        ) : batch.status === 'On Hold' ? (
                          <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Hold Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-[#717973]">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

