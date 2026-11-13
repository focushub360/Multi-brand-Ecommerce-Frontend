import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  addSubcategory,
  syncAdminDataFromApi
} from '../../services/adminService';
import {
  Layers,
  Plus,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronRight,
  Tag
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [expandedCat, setExpandedCat] = useState('cat-agri');
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [targetCatId, setTargetCatId] = useState(null);

  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '', commissionRate: 5.0 });
  const [subForm, setSubForm] = useState({ name: '', slug: '' });

  const loadData = () => {
    setCategories(getAdminCategories());
  };

  useEffect(() => {
    document.title = 'Category Management | GROVE Admin';
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

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    createAdminCategory(catForm);
    loadData();
    setIsCatModalOpen(false);
    setCatForm({ name: '', slug: '', description: '', commissionRate: 5.0 });
    showToast('New platform category created.');
  };

  const handleCreateSubcategory = (e) => {
    e.preventDefault();
    if (!subForm.name.trim() || !targetCatId) return;
    addSubcategory(targetCatId, subForm);
    loadData();
    setIsSubModalOpen(false);
    setSubForm({ name: '', slug: '' });
    showToast('Subcategory added.');
  };

  const handleDeleteCategory = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this category?')) {
      deleteAdminCategory(id);
      loadData();
      showToast('Category deleted.');
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
        title="Category Taxonomy Management"
        subtitle="Manage product classification tree, subcategory hierarchy, commission overrides, and active SKU distribution."
        badge={`${categories.length} Primary Verticals`}
        breadcrumbs={[{ label: 'Categories' }]}
        actions={
          <button
            type="button"
            onClick={() => setIsCatModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#AEEECB]" />
            <span>New Primary Category</span>
          </button>
        }
      />

      {/* Categories Tree View */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const isExpanded = expandedCat === cat.id;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-[#C1C8C2]/60 shadow-xs overflow-hidden transition-all"
            >
              {/* Category Header Row */}
              <div
                onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAF8] transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#012D1D] text-[#AEEECB] flex items-center justify-center font-bold text-sm shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-[#012D1D] font-heading">{cat.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#AEEECB] text-[#0E5138] font-mono font-bold text-[10px]">
                        {cat.productCount} SKUs
                      </span>
                    </div>
                    <p className="text-xs text-[#717973] mt-0.5 line-clamp-1">{cat.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-[#717973] block">Platform Take-Rate</span>
                    <span className="font-mono text-xs font-bold text-[#0E5138] bg-[#F3FCF3] px-2 py-0.5 rounded border border-[#C1C8C2]/40">
                      {cat.commissionRate}%
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTargetCatId(cat.id);
                      setIsSubModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-[#C1C8C2]/70 text-xs font-bold text-[#012D1D] hover:bg-[#F3FCF3] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Subcategory</span>
                  </button>

                  <div className="p-1 text-[#717973]">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Subcategories Accordion Content */}
              {isExpanded && (
                <div className="p-5 bg-[#F8FAF8] border-t border-[#C1C8C2]/40 space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#717973] block">
                    Nested Subcategories ({cat.subcategories?.length || 0})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cat.subcategories?.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3.5 rounded-2xl bg-white border border-[#C1C8C2]/40 flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Tag className="w-4 h-4 text-[#2C694E] shrink-0" />
                          <div>
                            <span className="font-bold text-xs text-[#151D18] block">{sub.name}</span>
                            <span className="text-[10px] font-mono text-[#717973]">slug: {sub.slug}</span>
                          </div>
                        </div>

                        <span className="font-mono text-[11px] font-bold text-[#012D1D] bg-[#F3FCF3] px-2 py-0.5 rounded border border-[#C1C8C2]/30">
                          {sub.productCount} items
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#012D1D]/50 backdrop-blur-xs" onClick={() => setIsCatModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#C1C8C2]/70 shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#C1C8C2]/40">
              <h3 className="font-extrabold text-base text-[#012D1D]">Create Primary Category</h3>
              <button type="button" onClick={() => setIsCatModalOpen(false)} className="p-1 rounded-xl text-[#717973]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. Irrigation & Fluid Systems"
                  className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Commission Rate (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={catForm.commissionRate}
                  onChange={(e) => setCatForm({ ...catForm, commissionRate: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Description</label>
                <textarea
                  rows="2"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  placeholder="Scope of agricultural or industrial equipment..."
                  className="w-full p-2.5 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#C1C8C2]/40">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="px-4 py-2 rounded-xl bg-white border border-[#C1C8C2]/60 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#012D1D] text-white font-bold">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Subcategory Modal */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#012D1D]/50 backdrop-blur-xs" onClick={() => setIsSubModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#C1C8C2]/70 shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#C1C8C2]/40">
              <h3 className="font-extrabold text-base text-[#012D1D]">Add Subcategory</h3>
              <button type="button" onClick={() => setIsSubModalOpen(false)} className="p-1 rounded-xl text-[#717973]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubcategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Subcategory Title *</label>
                <input
                  type="text"
                  required
                  value={subForm.name}
                  onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                  placeholder="e.g. Drip Emitters & Filters"
                  className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#C1C8C2]/40">
                <button type="button" onClick={() => setIsSubModalOpen(false)} className="px-4 py-2 rounded-xl bg-white border border-[#C1C8C2]/60 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#012D1D] text-white font-bold">
                  Add Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

