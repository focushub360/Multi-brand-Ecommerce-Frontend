import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import DealerLayout from '../../components/dealer/DealerLayout';
import { getDealerProducts, deleteDealerProduct, updateDealerProduct, syncDealerDataFromApi } from '../../services/dealerService';
import { getActiveDealerId } from '../../utils/auth';

export default function DealerProducts() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  const loadData = () => {
    const activeId = getActiveDealerId();
    setProducts(getDealerProducts(activeId));
  };

  useEffect(() => {
    document.title = 'Product Management | GROVE Dealer Portal';
    window.scrollTo(0, 0);
    loadData();
    const activeId = getActiveDealerId();
    syncDealerDataFromApi(activeId).then(() => {
      loadData();
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [urlSearch]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from your dealer catalog?`)) {
      const activeId = getActiveDealerId();
      const remaining = await deleteDealerProduct(id, activeId);
      setProducts(remaining);
      showToast(`Product "${name}" deleted.`);
    }
  };

  const handleToggleStatus = async (prod) => {
    const activeId = getActiveDealerId();
    const newStatus = prod.status === 'active' ? 'draft' : 'active';
    const updated = await updateDealerProduct(prod._id || prod.id, { status: newStatus }, activeId);
    if (updated) {
      loadData();
      showToast(`Status updated to ${newStatus === 'active' ? 'Active' : 'Draft'}`);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Status'];
    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      `"${p.category}"`,
      p.price,
      p.stock,
      p.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `grove_dealer_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Catalog CSV exported successfully.');
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchCat = selectedCategory === 'All' || p.category.includes(selectedCategory);
    
    let matchStatus = true;
    if (selectedStatus === 'Active') matchStatus = p.status === 'active';
    if (selectedStatus === 'Draft') matchStatus = p.status === 'draft';
    if (selectedStatus === 'Out of Stock') matchStatus = p.stock === 0;

    return matchSearch && matchCat && matchStatus;
  });

  return (
    <DealerLayout>
      <div className="flex flex-col w-full gap-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#151D18] tracking-tight">
                Products
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#AEEECB] text-[#0E5138] font-mono text-xs font-bold">
                {products.length} Items
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#717973]">
              Manage product listings, wholesale catalog pricing, and inventory availability across GROVE.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#151D18] text-xs font-semibold hover:bg-[#EDF6ED] transition-colors border border-[#C1C8C2]/50 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#717973]" />
              <span>Export CSV</span>
            </button>

            <Link
              to="/dealer/products/add"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#012D1D] transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ Add Product</span>
            </Link>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3 bg-white rounded-2xl border border-[#C1C8C2]/40 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717973] pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, SKU, or category..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#EDF6ED] text-[#151D18] text-xs sm:text-sm placeholder:text-[#717973] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#2C694E] transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#EDF6ED] text-[#151D18] text-xs font-semibold focus:outline-none cursor-pointer border-r-8 border-transparent"
            >
              <option value="All">All Categories</option>
              <option value="Agriculture">Agriculture &amp; Farming</option>
              <option value="Automotive">Automotive &amp; Spare Parts</option>
              <option value="Electronics">Electronics &amp; Gadgets</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#EDF6ED] text-[#151D18] text-xs font-semibold focus:outline-none cursor-pointer border-r-8 border-transparent"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
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

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-[#C1C8C2]/40 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#EDF6ED]/70 border-b border-[#C1C8C2]/40 text-[#717973] uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Price &amp; MRP</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Catalog Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#EDF6ED]/60 transition-colors">
                      {/* Product Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-11 h-11 rounded-xl object-cover bg-neutral-100 border border-[#C1C8C2]/40 shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/card-agri-clean.png';
                            }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-[#151D18] truncate max-w-[240px]">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-[#717973] truncate max-w-[240px]">
                              {p.category} {p.subcategory ? `• ${p.subcategory}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-[#012D1D] bg-[#EDF6ED] px-2 py-0.5 rounded text-[11px]">
                          {p.sku}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-[#151D18] text-xs">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          {p.mrp && p.mrp > p.price && (
                            <span className="text-[10px] text-[#717973] line-through">
                              MRP ₹{p.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`font-mono font-bold ${p.stock <= p.threshold ? 'text-red-700' : 'text-[#151D18]'}`}>
                            {p.stock} units
                          </span>
                          <span className="text-[10px] text-[#717973]">
                            Min alert: {p.threshold || 10}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px] transition-colors cursor-pointer ${
                            p.status === 'active'
                              ? 'bg-[#AEEECB] text-[#0E5138]'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' ? 'bg-[#2C694E]' : 'bg-neutral-400'}`} />
                          <span>{p.status === 'active' ? 'Active' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/dealer/products/edit/${p.id}`}
                            className="p-1.5 text-[#2C694E] hover:bg-[#EDF6ED] rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-[#717973]">
                      <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <p className="font-semibold text-sm">No products found</p>
                      <p className="text-xs text-neutral-500 mt-1">Try adjusting your filters or search keywords.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 bg-[#EDF6ED]/40 border-t border-[#C1C8C2]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#717973]">
            <span>
              Showing <strong className="text-[#151D18]">{filteredProducts.length}</strong> of{' '}
              <strong className="text-[#151D18]">{products.length}</strong> products
            </span>

            <div className="flex items-center gap-1">
              <button 
                type="button" 
                disabled 
                className="w-7 h-7 rounded-lg bg-white border border-[#C1C8C2]/40 text-neutral-400 flex items-center justify-center disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" className="w-7 h-7 rounded-lg bg-[#012D1D] text-white font-bold flex items-center justify-center text-xs">
                1
              </button>
              <button 
                type="button" 
                disabled 
                className="w-7 h-7 rounded-lg bg-white border border-[#C1C8C2]/40 text-neutral-400 flex items-center justify-center disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
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

