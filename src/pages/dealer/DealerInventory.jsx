import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  AlertOctagon, 
  Search, 
  Download, 
  Plus, 
  Minus, 
  Check, 
  X, 
  RotateCcw, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import DealerLayout from '../../components/dealer/DealerLayout';
import { getDealerInventory, updateStockBySku, syncDealerDataFromApi } from '../../services/dealerService';
import { getActiveDealerId } from '../../utils/auth';

export default function DealerInventory() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Inline stock edits tracking
  const [editingStock, setEditingStock] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState(null);
  const [adjType, setAdjType] = useState('add'); // 'add' | 'sub' | 'set'
  const [adjAmount, setAdjAmount] = useState(10);
  const [adjReason, setAdjReason] = useState('Direct Wholesale Inbound');
  const [adjNotes, setAdjNotes] = useState('');

  useEffect(() => {
    document.title = 'Warehouse Inventory & Logistics | GROVE Dealer Portal';
    window.scrollTo(0, 0);
    loadProducts();
    const activeId = getActiveDealerId();
    syncDealerDataFromApi(activeId).then(() => {
      loadProducts();
    }).catch(() => {});
  }, []);

  const loadProducts = () => {
    const activeId = getActiveDealerId();
    const list = getDealerInventory(activeId);
    setProducts(list);
    const initialEdits = {};
    list.forEach((p) => {
      initialEdits[p.sku] = p.stock;
    });
    setEditingStock(initialEdits);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Inline step count
  const handleStepStock = (sku, delta) => {
    setEditingStock((prev) => {
      const current = prev[sku] ?? 0;
      return { ...prev, [sku]: Math.max(0, current + delta) };
    });
  };

  const handleSaveStock = (sku) => {
    const activeId = getActiveDealerId();
    const val = editingStock[sku];
    updateStockBySku(sku, val, activeId);
    loadProducts();
    showToast(`Stock updated to ${val} units`);
  };

  // Open Drawer
  const openAdjustDrawer = (prod) => {
    setDrawerItem(prod);
    setAdjType('add');
    setAdjAmount(10);
    setAdjReason('Direct Wholesale Inbound');
    setAdjNotes('');
    setDrawerOpen(true);
  };

  const handleConfirmAdjustment = () => {
    if (!drawerItem) return;
    const activeId = getActiveDealerId();
    let newStock = drawerItem.stock;
    const qty = parseInt(adjAmount, 10) || 0;

    if (adjType === 'add') newStock += qty;
    if (adjType === 'sub') newStock = Math.max(0, newStock - qty);
    if (adjType === 'set') newStock = qty;

    updateStockBySku(drawerItem.sku, newStock, activeId);
    loadProducts();
    setDrawerOpen(false);
    showToast(`Stock batch adjustment applied: ${newStock} units`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Product', 'SKU', 'Available Stock', 'Min Threshold', 'Location', 'Status'];
    const rows = products.map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      p.stock,
      p.threshold || 10,
      `"${p.location || 'Depot A • Bay 01'}"`,
      p.stock === 0 ? 'Out of Stock' : p.stock <= (p.threshold || 10) ? 'Low Stock' : 'In Stock'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `grove_inventory_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inventory ledger CSV exported.');
  };

  // Filtered
  const filtered = products.filter((p) => {
    const matchSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCat = selectedCategory === 'All' || p.category.includes(selectedCategory);

    const isOutOfStock = p.stock === 0;
    const isLowStock = p.stock > 0 && p.stock <= (p.threshold || 10);
    const isInStock = p.stock > (p.threshold || 10);

    let matchStatus = true;
    if (selectedStatus === 'In Stock') matchStatus = isInStock;
    if (selectedStatus === 'Low Stock') matchStatus = isLowStock;
    if (selectedStatus === 'Out of Stock') matchStatus = isOutOfStock;

    return matchSearch && matchCat && matchStatus;
  });

  const totalStockCount = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= (p.threshold || 10)).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <DealerLayout>
      <div className="flex flex-col w-full gap-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#151D18] tracking-tight">
                Inventory
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 text-[#151D18] font-mono text-xs font-bold">
                {products.length} SKUs
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#717973]">
              Centralized warehouse logistics &amp; stock parity control.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#151D18] text-xs font-semibold hover:bg-[#EDF6ED] transition-colors border border-[#C1C8C2]/50 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#717973]" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => products[0] && openAdjustDrawer(products[0])}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#012D1D] text-white text-xs font-bold hover:bg-[#1B4332] transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Update Stock</span>
            </button>
          </div>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Stock */}
          <div className="p-5 rounded-2xl bg-white shadow-2xs border border-[#C1C8C2]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#717973] uppercase tracking-wider">Total Stock</span>
              <div className="w-8 h-8 rounded-lg bg-[#EDF6ED] flex items-center justify-center text-[#012D1D]">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#151D18] tracking-tight">
                {totalStockCount.toLocaleString('en-IN')}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#AEEECB] text-[#0E5138] font-mono text-[11px] font-bold">
                Live
              </span>
            </div>
            <span className="text-xs text-[#717973] mt-1">Total aggregated warehouse units</span>
          </div>

          {/* Low Stock Alert */}
          <div className="p-5 rounded-2xl bg-white shadow-2xs border border-[#C1C8C2]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#717973] uppercase tracking-wider">Low Stock Alert</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#151D18] tracking-tight">
                {lowStockCount}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono text-[11px] font-bold">
                Reorder suggested
              </span>
            </div>
            <span className="text-xs text-[#717973] mt-1">Falling below safe reorder thresholds</span>
          </div>

          {/* Out of Stock */}
          <div className="p-5 rounded-2xl bg-white shadow-2xs border border-[#C1C8C2]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#717973] uppercase tracking-wider">Out of Stock</span>
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-700">
                <AlertOctagon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#151D18] tracking-tight">
                {outOfStockCount}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-mono text-[11px] font-bold">
                Urgent action
              </span>
            </div>
            <span className="text-xs text-[#717973] mt-1">SKUs with 0 available inventory</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3 bg-white rounded-2xl border border-[#C1C8C2]/40 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717973] pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#EDF6ED] text-[#151D18] text-xs sm:text-sm placeholder:text-[#717973] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#2C694E] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#EDF6ED] text-[#151D18] text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Agriculture">Agriculture &amp; Farming</option>
              <option value="Automotive">Automotive &amp; Spares</option>
              <option value="Electronics">Electronics &amp; IoT</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#EDF6ED] text-[#151D18] text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            {(searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                }}
                className="h-10 px-3 text-[#717973] hover:text-[#151D18] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl border border-[#C1C8C2]/40 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#EDF6ED]/70 border-b border-[#C1C8C2]/40 text-[#717973] uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Available Stock</th>
                  <th className="py-3 px-4">Min Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Stock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((prod) => {
                  const isOut = prod.stock === 0;
                  const isLow = prod.stock > 0 && prod.stock <= (prod.threshold || 10);
                  const currentEditVal = editingStock[prod.sku] ?? prod.stock;

                  return (
                    <tr key={prod.id} className="hover:bg-[#EDF6ED]/60 transition-colors">
                      {/* Product */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-11 h-11 rounded-xl object-cover bg-neutral-100 border border-[#C1C8C2]/40 shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/card-agri-clean.png';
                            }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-[#151D18] truncate max-w-[240px]">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-[#717973] truncate max-w-[240px]">
                              {prod.category} • {prod.subcategory}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-[#151D18] bg-[#EDF6ED] px-2 py-0.5 rounded text-[11px]">
                          {prod.sku}
                        </span>
                      </td>

                      {/* Available Stock & Location */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`font-mono font-bold text-sm ${isOut ? 'text-red-700' : isLow ? 'text-amber-800' : 'text-[#151D18]'}`}>
                            {prod.stock}
                          </span>
                          <span className="text-[10px] text-[#717973]">
                            {prod.location || 'Depot A • Bay 14'}
                          </span>
                        </div>
                      </td>

                      {/* Min Stock */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-medium text-[#414844]">
                          {prod.threshold || 10} units
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                          isOut 
                            ? 'bg-red-100 text-red-800' 
                            : isLow 
                            ? 'bg-amber-100 text-amber-900' 
                            : 'bg-[#AEEECB] text-[#0E5138]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-red-600' : isLow ? 'bg-amber-600' : 'bg-[#2C694E]'}`} />
                          <span>{isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}</span>
                        </span>
                      </td>

                      {/* Quick Stock Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inline Step Counter */}
                          <div className="flex items-center bg-[#EDF6ED] rounded-xl p-0.5 shadow-2xs border border-[#C1C8C2]/40">
                            <button
                              type="button"
                              onClick={() => handleStepStock(prod.sku, -1)}
                              className="w-7 h-7 flex items-center justify-center text-[#717973] hover:text-[#151D18] hover:bg-white rounded-lg transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              value={currentEditVal}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                setEditingStock({ ...editingStock, [prod.sku]: Math.max(0, val) });
                              }}
                              className="w-12 h-7 text-center font-mono font-bold bg-transparent text-[#151D18] text-xs focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleStepStock(prod.sku, 1)}
                              className="w-7 h-7 flex items-center justify-center text-[#717973] hover:text-[#151D18] hover:bg-white rounded-lg transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveStock(prod.sku)}
                              title="Save Stock Count"
                              className="w-7 h-7 flex items-center justify-center text-[#2C694E] hover:bg-[#AEEECB]/70 rounded-lg transition-colors cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => openAdjustDrawer(prod)}
                            className="px-3 py-1.5 rounded-xl bg-white border border-[#C1C8C2]/60 text-[#151D18] hover:bg-[#EDF6ED] font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                          >
                            Adjust
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="p-4 bg-[#EDF6ED]/40 border-t border-[#C1C8C2]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#717973]">
            <span>
              Showing <strong className="text-[#151D18]">{filtered.length}</strong> of{' '}
              <strong className="text-[#151D18]">{products.length}</strong> items
            </span>

            <div className="flex items-center gap-1 font-mono text-xs">
              <button disabled className="w-7 h-7 rounded-lg bg-white border border-[#C1C8C2]/40 text-neutral-400 flex items-center justify-center disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-7 h-7 rounded-lg bg-[#012D1D] text-white font-bold flex items-center justify-center">
                1
              </button>
              <button disabled className="w-7 h-7 rounded-lg bg-white border border-[#C1C8C2]/40 text-neutral-400 flex items-center justify-center disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Slide-out Stock Adjustment Drawer */}
        {drawerOpen && (
          <div 
            className="fixed inset-0 bg-[#012D1D]/40 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside 
          className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {drawerItem && (
            <>
              <div>
                {/* Drawer Header */}
                <div className="h-16 px-6 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#012D1D]" />
                    <span className="text-sm font-bold text-[#151D18]">Adjust Stock Level</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Drawer Body */}
                <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-140px)]">
                  {/* Product Highlight Box */}
                  <div className="p-3.5 rounded-xl bg-[#EDF6ED] flex flex-col gap-1 border border-[#C1C8C2]/40">
                    <span className="font-mono text-[11px] text-[#2C694E] font-bold">{drawerItem.sku}</span>
                    <h3 className="text-xs font-bold text-[#151D18]">{drawerItem.name}</h3>
                    <span className="text-[11px] text-[#717973]">{drawerItem.location || 'Depot A • Bay 14'}</span>
                  </div>

                  {/* Current Available vs Reorder Min */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#EDF6ED]/50 border border-[#C1C8C2]/40 flex flex-col">
                      <span className="text-[11px] text-[#717973] font-medium">Current Available</span>
                      <span className="font-mono text-xl text-[#151D18] font-bold mt-1">{drawerItem.stock}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#EDF6ED]/50 border border-[#C1C8C2]/40 flex flex-col">
                      <span className="text-[11px] text-[#717973] font-medium">Reorder Min</span>
                      <span className="font-mono text-xl text-[#717973] font-bold mt-1">{drawerItem.threshold || 10} units</span>
                    </div>
                  </div>

                  {/* Adjustment Type Tabs */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#151D18]">Adjustment Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setAdjType('add')}
                        className={`py-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                          adjType === 'add'
                            ? 'bg-[#012D1D] text-white shadow-2xs'
                            : 'bg-[#EDF6ED] text-[#151D18] hover:bg-neutral-200'
                        }`}
                      >
                        + Received
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdjType('sub')}
                        className={`py-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                          adjType === 'sub'
                            ? 'bg-[#012D1D] text-white shadow-2xs'
                            : 'bg-[#EDF6ED] text-[#151D18] hover:bg-neutral-200'
                        }`}
                      >
                        - Damaged
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdjType('set')}
                        className={`py-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                          adjType === 'set'
                            ? 'bg-[#012D1D] text-white shadow-2xs'
                            : 'bg-[#EDF6ED] text-[#151D18] hover:bg-neutral-200'
                        }`}
                      >
                        = Override
                      </button>
                    </div>
                  </div>

                  {/* Adjustment Quantity */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="adjAmount" className="text-xs font-bold text-[#151D18]">
                      Adjustment Quantity
                    </label>
                    <div className="relative">
                      <input
                        id="adjAmount"
                        type="number"
                        min="1"
                        value={adjAmount}
                        onChange={(e) => setAdjAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-full h-11 px-3.5 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-sm font-mono font-bold text-[#151D18] focus:outline-none focus:bg-white focus:border-[#2C694E]"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#717973] font-mono">
                        units
                      </span>
                    </div>
                  </div>

                  {/* Audit Reason */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="adjReason" className="text-xs font-bold text-[#151D18]">
                      Audit Reason / Order Ref
                    </label>
                    <select
                      id="adjReason"
                      value={adjReason}
                      onChange={(e) => setAdjReason(e.target.value)}
                      className="h-11 px-3 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-xs font-semibold text-[#151D18] focus:outline-none focus:bg-white focus:border-[#2C694E]"
                    >
                      <option>Direct Wholesale Inbound</option>
                      <option>Cycle Count Discrepancy</option>
                      <option>Damaged in Staging</option>
                      <option>Returned Customer Stock</option>
                    </select>
                  </div>

                  {/* Internal Notes */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="adjNotes" className="text-xs font-medium text-[#717973]">
                      Internal Notes (Optional)
                    </label>
                    <textarea
                      id="adjNotes"
                      rows={2}
                      value={adjNotes}
                      onChange={(e) => setAdjNotes(e.target.value)}
                      placeholder="e.g. Inbound PO #7890 arrived with verified pallet seal"
                      className="p-3 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-xs text-[#151D18] focus:outline-none focus:bg-white focus:border-[#2C694E] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-neutral-100 bg-[#EDF6ED]/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAdjustment}
                  className="px-5 py-2.5 rounded-xl bg-[#012D1D] text-white text-xs font-bold shadow-sm hover:bg-[#1B4332] active:scale-95 transition-all cursor-pointer"
                >
                  Apply Changes
                </button>
              </div>
            </>
          )}
        </aside>

        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#012D1D] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-[#AEEECB]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </DealerLayout>
  );
}

