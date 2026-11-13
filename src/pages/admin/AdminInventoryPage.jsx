import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  getAdminProducts,
  getAdminInventorySummary,
  getAdminInventoryMovementLogs,
  adjustAdminInventoryStock,
  syncAdminDataFromApi
} from '../../services/adminService';
import {
  Search,
  CheckCircle2,
  Sliders,
  History,
  Store,
  X,
  MapPin
} from 'lucide-react';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dealerFilter, setDealerFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState('All');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [newStockQty, setNewStockQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('Physical audit reconciliation');
  const [toastMessage, setToastMessage] = useState(null);

  const [movementLogs, setMovementLogs] = useState([]);

  const loadData = () => {
    setProducts(getAdminProducts());
    setMovementLogs(getAdminInventoryMovementLogs());
  };

  useEffect(() => {
    document.title = 'Inventory Management | GROVE Admin';
    window.scrollTo(0, 0);
    loadData();
    syncAdminDataFromApi().then(() => {
      loadData();
    }).catch(() => {});
  }, []);

  const summary = useMemo(() => {
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
  }, [products]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const uniqueDealers = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.dealerName).filter(Boolean)));
  }, [products]);

  const filteredItems = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.dealerName.toLowerCase().includes(q) ||
        (p.location && p.location.toLowerCase().includes(q));

      const matchDealer = dealerFilter === 'All' || p.dealerName === dealerFilter;
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;

      let matchStock = true;
      if (stockStatusFilter === 'In Stock') {
        matchStock = p.stock > (p.threshold || 10);
      } else if (stockStatusFilter === 'Low Stock') {
        matchStock = p.stock > 0 && p.stock <= (p.threshold || 10);
      } else if (stockStatusFilter === 'Out of Stock') {
        matchStock = p.stock <= 0;
      }

      return matchSearch && matchDealer && matchCat && matchStock;
    });
  }, [products, searchQuery, dealerFilter, categoryFilter, stockStatusFilter]);

  const handleOpenAdjust = (prod) => {
    setSelectedProduct(prod);
    setNewStockQty(String(prod.stock));
    setAdjustReason('Physical audit reconciliation');
    setIsAdjustModalOpen(true);
  };

  const handleSaveStock = (e) => {
    e.preventDefault();
    const qty = parseInt(newStockQty, 10);
    if (isNaN(qty) || qty < 0) {
      showToast('Please enter a valid non-negative integer quantity.');
      return;
    }

    adjustAdminInventoryStock(selectedProduct.id, qty, adjustReason, 'GROVE Admin');
    loadData();
    setIsAdjustModalOpen(false);
    showToast(`Stock adjusted for ${selectedProduct.name} to ${qty} units.`);
  };

  return (
    <AdminLayout>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#012D1D] text-white text-xs font-semibold shadow-xl border border-[#AEEECB]/40 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#AEEECB] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <AdminPageHeader
        title="Inventory Management"
        subtitle="Monitor multi-dealer warehouse stock reserves, low-inventory triggers, and chronological movement reconciliations."
        badge={`${summary.totalStockUnits.toLocaleString('en-IN')} Total Units`}
        breadcrumbs={[{ label: 'Inventory' }]}
        actions={
          <button
            type="button"
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#C1C8C2]/70 text-xs font-bold text-[#151D18] hover:bg-[#F3FCF3] hover:border-[#2C694E] transition-all shadow-2xs cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-[#717973]" />
            <span>Stock Movement History</span>
          </button>
        }
      />

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-[#717973]">Total Units On-Hand</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#012D1D] font-heading">{summary.totalStockUnits.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-[#717973] font-mono">({summary.totalSkus} SKUs)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-800">Healthy Stock Level</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#0E5138] font-heading">{summary.inStockCount}</span>
            <span className="text-[11px] text-emerald-700 font-mono">SKUs available</span>
          </div>
        </div>

        <div
          onClick={() => setStockStatusFilter(stockStatusFilter === 'Low Stock' ? 'All' : 'Low Stock')}
          className="p-4 rounded-2xl bg-white border border-amber-300 shadow-2xs cursor-pointer hover:border-amber-500 transition-colors"
        >
          <span className="text-[10px] font-mono uppercase font-bold text-amber-900">Low Stock Warning</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-950 font-heading">{summary.lowStockCount}</span>
            <span className="text-[11px] text-amber-800 font-mono">Reorder needed</span>
          </div>
        </div>

        <div
          onClick={() => setStockStatusFilter(stockStatusFilter === 'Out of Stock' ? 'All' : 'Out of Stock')}
          className="p-4 rounded-2xl bg-white border border-rose-300 shadow-2xs cursor-pointer hover:border-rose-500 transition-colors"
        >
          <span className="text-[10px] font-mono uppercase font-bold text-rose-800">Out of Stock (Zero)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-900 font-heading">{summary.outOfStockCount}</span>
            <span className="text-[11px] text-rose-700 font-mono">Delisted automatically</span>
          </div>
        </div>
      </div>

      {/* 2. Filters */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#717973] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SKU, product, depot bay, or dealer..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium text-[#151D18] focus:outline-none focus:border-[#012D1D]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={dealerFilter}
              onChange={(e) => setDealerFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold text-[#151D18]"
            >
              <option value="All">All Dealers</option>
              {uniqueDealers.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold text-[#151D18]"
            >
              <option value="All">All Categories</option>
              <option value="Agriculture & Farming">Agriculture & Farming</option>
              <option value="Electronics & Gadgets">Electronics & Gadgets</option>
              <option value="Automotive & Spare Parts">Automotive & Spare Parts</option>
            </select>

            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold text-[#151D18]"
            >
              <option value="All">All Stock Levels</option>
              <option value="In Stock">In Stock (&gt; Threshold)</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock (0)</option>
            </select>

            {(searchQuery || dealerFilter !== 'All' || categoryFilter !== 'All' || stockStatusFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setDealerFilter('All');
                  setCategoryFilter('All');
                  setStockStatusFilter('All');
                }}
                className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#C1C8C2]/50 bg-[#F8FAF8] text-[#717973] font-mono uppercase text-[10px]">
                <th className="py-3 px-4 font-bold">Product &amp; SKU</th>
                <th className="py-3 px-4 font-bold">Dealer</th>
                <th className="py-3 px-4 font-bold">Depot Location</th>
                <th className="py-3 px-4 font-bold text-center">Safety Threshold</th>
                <th className="py-3 px-4 font-bold text-center">Current Stock</th>
                <th className="py-3 px-4 font-bold text-center">Inventory Status</th>
                <th className="py-3 px-4 font-bold text-right">Adjustment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C1C8C2]/30">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-[#717973]">
                    No inventory items matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((prod) => {
                  const isOut = prod.stock <= 0;
                  const isLow = prod.stock > 0 && prod.stock <= (prod.threshold || 10);

                  return (
                    <tr key={prod.id} className="hover:bg-[#F8FAF8] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover bg-neutral-100 border border-[#C1C8C2]/40 shrink-0"
                            onError={(e) => { e.target.src = '/images/prod-drip.png'; }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-[#151D18] truncate max-w-[240px]">
                              {prod.name}
                            </span>
                            <span className="text-[10px] font-mono text-[#717973]">
                              SKU: {prod.sku} • {prod.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#3F4943]">
                        <span className="font-semibold flex items-center gap-1">
                          <Store className="w-3 h-3 text-[#717973]" />
                          {prod.dealerName}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#3F4943]">
                        <span className="text-xs font-mono flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#717973]" />
                          {prod.location || 'Central Depot'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center font-mono text-[#717973]">
                        {prod.threshold || 10} units
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="font-mono text-base font-black text-[#012D1D]">
                          {prod.stock}
                        </span>
                        <span className="text-[10px] text-[#717973] block font-mono">on-hand</span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          isOut
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : isLow
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenAdjust(prod)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#C1C8C2]/70 text-xs font-bold text-[#012D1D] hover:bg-[#F3FCF3] hover:border-[#012D1D] transition-colors cursor-pointer shadow-2xs"
                        >
                          <Sliders className="w-3 h-3 text-[#717973]" />
                          <span>Adjust Stock</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#012D1D]/50 backdrop-blur-xs" onClick={() => setIsAdjustModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#C1C8C2]/70 shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#C1C8C2]/40">
              <h3 className="font-extrabold text-base text-[#012D1D]">
                Adjust Inventory Stock
              </h3>
              <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="p-1 rounded-xl text-[#717973]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-[#C1C8C2]/40 space-y-1">
              <span className="font-extrabold text-xs text-[#151D18] block">{selectedProduct.name}</span>
              <span className="text-[11px] font-mono text-[#717973] block">
                SKU: {selectedProduct.sku} • Dealer: {selectedProduct.dealerName}
              </span>
              <span className="text-[11px] font-mono text-[#012D1D] block">
                Current Count: <strong>{selectedProduct.stock} units</strong>
              </span>
            </div>

            <form onSubmit={handleSaveStock} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                  New Stock Count (Units) *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStockQty(String(Math.max(0, (parseInt(newStockQty, 10) || 0) - 1)))}
                    className="w-9 h-9 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/60 flex items-center justify-center font-bold text-base hover:bg-[#E3EBE4]"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newStockQty}
                    onChange={(e) => setNewStockQty(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#012D1D] font-mono font-black text-center text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setNewStockQty(String((parseInt(newStockQty, 10) || 0) + 1))}
                    className="w-9 h-9 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/60 flex items-center justify-center font-bold text-base hover:bg-[#E3EBE4]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3F4943] mb-1">
                  Adjustment Reason / Audit Note *
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold"
                >
                  <option value="Physical audit reconciliation">Physical audit reconciliation</option>
                  <option value="Inbound manufacturer replenishment">Inbound manufacturer replenishment</option>
                  <option value="Damaged transit write-off">Damaged transit write-off</option>
                  <option value="Customer return restocked">Customer return restocked</option>
                  <option value="Dealer stock transfer">Dealer stock transfer</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#C1C8C2]/40">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#C1C8C2]/60 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movement History Drawer */}
      {isHistoryDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="fixed inset-0 bg-[#012D1D]/50 backdrop-blur-xs" onClick={() => setIsHistoryDrawerOpen(false)} />
          <div className="relative w-full max-w-lg h-full bg-white shadow-2xl p-6 z-10 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C1C8C2]/40">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#012D1D]" />
                <h3 className="font-extrabold text-base text-[#012D1D]">Stock Movement History</h3>
              </div>
              <button type="button" onClick={() => setIsHistoryDrawerOpen(false)} className="p-1 rounded-xl text-[#717973]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {movementLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-[#F8FAF8] border border-[#C1C8C2]/40 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#717973] font-bold">#{log.id} • {log.timestamp}</span>
                    <span className={`font-mono font-black text-xs px-2 py-0.5 rounded ${
                      log.delta.startsWith('+') ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                    }`}>
                      {log.delta} units
                    </span>
                  </div>
                  <p className="font-bold text-[#151D18]">{log.productName}</p>
                  <p className="text-[11px] text-[#3F4943]">{log.reason}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#717973] pt-1">
                    <span>By: {log.admin}</span>
                    <span>New Balance: {log.newStock} units</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsHistoryDrawerOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#012D1D] text-white font-bold text-xs"
            >
              Close History
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

