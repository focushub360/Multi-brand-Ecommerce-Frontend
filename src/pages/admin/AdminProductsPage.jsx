import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  approveProductListing,
  rejectProductListing,
  syncAdminDataFromApi
} from '../../services/adminService';
import {
  Search,
  Plus,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  Check,
  Ban,
  Store
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dealerFilter, setDealerFilter] = useState('All');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    sku: '',
    category: 'Agriculture & Farming',
    subcategory: 'Micro-Irrigation & Tubing',
    dealerName: 'Apex Agri-Tech & Machinery',
    dealerId: 'DEALER_001',
    price: '',
    mrp: '',
    stock: '',
    threshold: 10,
    status: 'Active',
    description: '',
    image: '/images/prod-drip.png',
    location: 'Depot A • Bay 01'
  };
  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState('');

  const loadData = () => {
    setProducts(getAdminProducts());
  };

  useEffect(() => {
    document.title = 'Product Management | GROVE Admin';
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

  // Distinct Dealers for filter
  const uniqueDealers = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.dealerName).filter(Boolean)));
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.dealerName.toLowerCase().includes(q);

      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchDealer = dealerFilter === 'All' || p.dealerName === dealerFilter;

      return matchSearch && matchCat && matchStatus && matchDealer;
    });
  }, [products, searchQuery, categoryFilter, statusFilter, dealerFilter]);

  // Handlers
  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setFormError('');
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (prod, e) => {
    if (e) e.stopPropagation();
    setFormData({
      ...prod,
      price: String(prod.price),
      mrp: String(prod.mrp),
      stock: String(prod.stock),
      threshold: String(prod.threshold)
    });
    setIsEditing(true);
    setFormError('');
    setIsAddEditOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Product title is required.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setFormError('Valid selling price is required.');
      return;
    }

    if (isEditing && formData.id) {
      updateAdminProduct(formData.id, {
        ...formData,
        price: Number(formData.price),
        mrp: Number(formData.mrp) || Number(formData.price),
        stock: Number(formData.stock) || 0,
        threshold: Number(formData.threshold) || 10
      });
      showToast(`Updated product: ${formData.name}`);
    } else {
      createAdminProduct(formData);
      showToast(`Created new catalog listing: ${formData.name}`);
    }

    loadData();
    setIsAddEditOpen(false);
  };

  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this product from the platform catalog?')) {
      deleteAdminProduct(id);
      loadData();
      showToast('Product removed successfully.');
    }
  };

  const handleApprove = (id, e) => {
    if (e) e.stopPropagation();
    approveProductListing(id);
    loadData();
    showToast('Product listing approved and published to Marketplace.');
  };

  const handleReject = (id, e) => {
    if (e) e.stopPropagation();
    const reason = window.prompt('Enter rejection reason (e.g. Incomplete specifications, Non-compliant pricing):', 'Specification non-compliance');
    if (reason) {
      rejectProductListing(id, reason);
      loadData();
      showToast('Product listing rejected.');
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Pending Review':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Rejected':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
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
        title="Product Management"
        subtitle="Review, catalogue, moderate, price-audit, and publish agricultural equipment, electronics, and automotive parts across dealers."
        badge={`${products.length} Products`}
        breadcrumbs={[{ label: 'Products' }]}
        actions={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#AEEECB]" />
            <span>Add Catalog Product</span>
          </button>
        }
      />

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-[#717973]">Total SKUs</span>
          <span className="text-2xl font-black text-[#012D1D] block mt-0.5">{products.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-800">Active Published</span>
          <span className="text-2xl font-black text-[#0E5138] block mt-0.5">
            {products.filter((p) => p.status === 'Active').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-amber-900">Pending Review</span>
          <span className="text-2xl font-black text-amber-950 block mt-0.5">
            {products.filter((p) => p.status === 'Pending Review').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/60 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-rose-800">Rejected / Delisted</span>
          <span className="text-2xl font-black text-rose-900 block mt-0.5">
            {products.filter((p) => p.status === 'Rejected').length}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#717973] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU, or dealer..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium text-[#151D18] focus:outline-none focus:border-[#012D1D]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold text-[#151D18]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Rejected">Rejected</option>
            </select>

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

            {(searchQuery || categoryFilter !== 'All' || statusFilter !== 'All' || dealerFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('All');
                  setStatusFilter('All');
                  setDealerFilter('All');
                }}
                className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#C1C8C2]/50 bg-[#F8FAF8] text-[#717973] font-mono uppercase text-[10px]">
                <th className="py-3 px-4 font-bold">Product &amp; SKU</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Dealer</th>
                <th className="py-3 px-4 font-bold text-right">Price</th>
                <th className="py-3 px-3 font-bold text-center">Stock</th>
                <th className="py-3 px-4 font-bold text-center">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C1C8C2]/30">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-[#717973]">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr
                    key={prod.id}
                    onClick={() => {
                      setSelectedProduct(prod);
                      setIsDetailOpen(true);
                    }}
                    className="hover:bg-[#F8FAF8] transition-colors cursor-pointer"
                  >
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
                            SKU: {prod.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[#3F4943]">
                      <span className="font-semibold block">{prod.category}</span>
                      <span className="text-[10px] text-[#717973]">{prod.subcategory}</span>
                    </td>

                    <td className="py-3 px-4 text-[#3F4943]">
                      <span className="font-medium flex items-center gap-1">
                        <Store className="w-3 h-3 text-[#717973]" />
                        {prod.dealerName}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-extrabold text-[#012D1D] block">
                        ₹{Number(prod.price).toLocaleString('en-IN')}
                      </span>
                      {prod.mrp && prod.mrp > prod.price && (
                        <span className="text-[10px] line-through text-[#717973] font-mono">
                          ₹{Number(prod.mrp).toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        prod.stock <= 0
                          ? 'bg-rose-50 text-rose-800'
                          : prod.stock <= (prod.threshold || 10)
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {prod.stock}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadge(prod.status)}`}>
                        {prod.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {prod.status === 'Pending Review' && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => handleApprove(prod.id, e)}
                              className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-50"
                              title="Approve Listing"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleReject(prod.id, e)}
                              className="p-1 rounded-lg text-rose-700 hover:bg-rose-50"
                              title="Reject Listing"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleOpenEdit(prod, e)}
                          className="p-1.5 rounded-lg text-[#717973] hover:text-[#012D1D] hover:bg-[#F3FCF3]"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDelete(prod.id, e)}
                          className="p-1.5 rounded-lg text-[#717973] hover:text-red-700 hover:bg-red-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detail Modal */}
      {isDetailOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#012D1D]/50 backdrop-blur-xs" onClick={() => setIsDetailOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#C1C8C2]/70 shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-[#C1C8C2]/60"
                  onError={(e) => { e.target.src = '/images/prod-drip.png'; }}
                />
                <div>
                  <h3 className="font-extrabold text-base text-[#012D1D] leading-tight">
                    {selectedProduct.name}
                  </h3>
                  <span className="text-[11px] font-mono text-[#717973]">
                    SKU: {selectedProduct.sku}
                  </span>
                </div>
              </div>
              <button type="button" onClick={() => setIsDetailOpen(false)} className="p-1 rounded-xl text-[#717973]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#3F4943] leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F8FAF8] p-3 rounded-2xl border border-[#C1C8C2]/40">
              <div>
                <span className="text-[10px] text-[#717973] uppercase font-mono block">Dealer</span>
                <span className="font-bold text-[#151D18]">{selectedProduct.dealerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#717973] uppercase font-mono block">Category</span>
                <span className="font-bold text-[#151D18]">{selectedProduct.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#717973] uppercase font-mono block">Price / MRP</span>
                <span className="font-bold font-mono text-[#012D1D]">₹{selectedProduct.price} / ₹{selectedProduct.mrp}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#717973] uppercase font-mono block">Current Stock</span>
                <span className="font-bold font-mono text-[#0E5138]">{selectedProduct.stock} units ({selectedProduct.location})</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#C1C8C2]/40">
              {selectedProduct.status === 'Pending Review' && (
                <button
                  type="button"
                  onClick={() => {
                    handleApprove(selectedProduct.id);
                    setIsDetailOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Approve Listing
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#012D1D] text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#012D1D]/50 backdrop-blur-xs" onClick={() => setIsAddEditOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#C1C8C2]/70 shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#C1C8C2]/40">
              <h3 className="font-extrabold text-base text-[#012D1D]">
                {isEditing ? 'Edit Catalog Product' : 'Add New Catalog Product'}
              </h3>
              <button type="button" onClick={() => setIsAddEditOpen(false)} className="p-1 rounded-xl text-[#717973]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 50HP Rotavator Blade Assembly"
                  className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs focus:outline-none focus:border-[#012D1D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#3F4943] mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. AG-ROT-500"
                    className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono uppercase focus:outline-none focus:border-[#012D1D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold"
                  >
                    <option value="Agriculture & Farming">Agriculture & Farming</option>
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Automotive & Spare Parts">Automotive & Spare Parts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="8500"
                    className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono font-bold focus:outline-none focus:border-[#012D1D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3F4943] mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="9999"
                    className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono focus:outline-none focus:border-[#012D1D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="50"
                    className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono focus:outline-none focus:border-[#012D1D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Assigned Dealer</label>
                <select
                  value={formData.dealerName}
                  onChange={(e) => setFormData({ ...formData, dealerName: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs"
                >
                  <option value="Apex Agri-Tech & Machinery">Apex Agri-Tech & Machinery</option>
                  <option value="Kisan Agro Hub & Spares">Kisan Agro Hub & Spares</option>
                  <option value="Sahyadri Agro Implement Works">Sahyadri Agro Implement Works</option>
                  <option value="Punjab Agri Tractors & Combines">Punjab Agri Tractors & Combines</option>
                  <option value="Malwa Farm Equipment Co.">Malwa Farm Equipment Co.</option>
                  <option value="Baramati Bio-Nutrients & Feed">Baramati Bio-Nutrients & Feed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Technical specifications and warranty..."
                  className="w-full p-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs focus:outline-none focus:border-[#012D1D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#C1C8C2]/40">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#C1C8C2]/60 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold"
                >
                  {isEditing ? 'Save Changes' : 'Create Product Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

