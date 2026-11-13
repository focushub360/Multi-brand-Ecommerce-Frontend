import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  AlertCircle,
  Lock
} from 'lucide-react';
import DealerLayout from '../../components/dealer/DealerLayout';
import { getDealerProductById, fetchDealerProductById, updateDealerProduct, deleteDealerProduct, getDealerStoreSettings } from '../../services/dealerService';
import { getActiveDealerId, getStoredDealer } from '../../utils/auth';

const SUBCATEGORIES_BY_CATEGORY = {
  'Agriculture & Farming': [
    'Hybrid Seeds',
    'Fertilizers & Soil Nutrition',
    'Crop Protection & Spraying',
    'Irrigation & Drip Systems',
    'Solar & Sustainable Energy',
    'Farm Machinery & Heavy Equipment'
  ],
  'Electronics & Gadgets': [
    'Smart Ag Tech & Sensors',
    'Solar Pumps & Inverters',
    'Field Surveillance Cameras',
    'Battery Packs & Power Backup',
    'Testing & Measuring Meters',
    'Communication & Telemetry'
  ],
  'Automotive & Spare Parts': [
    'Tractor Engine Components',
    'Hydraulic Pumps & Cylinders',
    'Transmission & Gearboxes',
    'Braking & Clutch Systems',
    'Commercial Farm Tires',
    'Filters, Belts & Bearings'
  ],
  'Groceries': [
    'Organic Staples & Grains',
    'Cold Pressed Oils',
    'Farm Fresh Pulses',
    'Spices & Seasonings'
  ]
};

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const activeId = getActiveDealerId();
  const dealerSettings = getDealerStoreSettings(activeId);
  const storedDealer = getStoredDealer();

  const authorizedCategory = 
    dealerSettings?.businessCategory || 
    (storedDealer?.email?.includes('hub') ? 'Electronics & Gadgets' : 'Agriculture & Farming');

  const availableSubcategories = SUBCATEGORIES_BY_CATEGORY[authorizedCategory] || SUBCATEGORIES_BY_CATEGORY['Agriculture & Farming'];

  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState(null);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const populateForm = (found) => {
    setProduct(found);
    setFormData({
      name: found.name || '',
      description: found.description || '',
      category: found.category || 'Agriculture & Farming',
      subcategory: found.subcategory || 'Micro-Irrigation & Tubing',
      sellingPrice: found.price || 0,
      mrpPrice: found.mrp || found.originalPrice || found.price || 0,
      gstRate: String(found.gstRate || '12'),
      sku: found.sku || '',
      stock: found.stock || 0,
      threshold: found.threshold || 10,
      status: found.status || 'active',
      material: found.specs?.material || '',
      pipeSize: found.specs?.pipeSize || '',
      flowRate: found.specs?.flowRate || '',
      images: found.images && found.images.length > 0 ? found.images : [found.image || '/images/card-agri-clean.png']
    });
  };

  useEffect(() => {
    document.title = 'Edit Product | GROVE Dealer Portal';
    window.scrollTo(0, 0);

    let isMounted = true;
    const activeId = getActiveDealerId();
    const found = getDealerProductById(activeId, id);
    if (found) {
      populateForm(found);
    }

    fetchDealerProductById(id, activeId).then((live) => {
      if (!isMounted) return;
      if (live) {
        populateForm(live);
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, [id]);

  if (!formData && !product) {
    return (
      <DealerLayout>
        <div className="max-w-xl mx-auto py-16 text-center">
          <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#151D18]">Product Not Found</h2>
          <p className="text-xs text-[#717973] mt-1 mb-6">
            The requested product (ID: {id}) could not be located in your dealer catalog.
          </p>
          <Link
            to="/dealer/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#012D1D] text-white text-xs font-bold rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Products</span>
          </Link>
        </div>
      </DealerLayout>
    );
  }

  const discountPercent = formData.mrpPrice > formData.sellingPrice
    ? Math.round(((formData.mrpPrice - formData.sellingPrice) / formData.mrpPrice) * 100)
    : 0;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.sku.trim()) errs.sku = 'SKU is required';
    if (Number(formData.sellingPrice) <= 0) errs.sellingPrice = 'Valid price is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSaving(true);

    const updated = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      subcategory: formData.subcategory,
      price: Number(formData.sellingPrice),
      mrp: Number(formData.mrpPrice || formData.sellingPrice),
      originalPrice: Number(formData.mrpPrice || formData.sellingPrice),
      discount: discountPercent,
      gstRate: Number(formData.gstRate),
      sku: formData.sku.trim().toUpperCase(),
      stock: Number(formData.stock) || 0,
      threshold: Number(formData.threshold) || 10,
      status: formData.status,
      specs: {
        material: formData.material,
        pipeSize: formData.pipeSize,
        flowRate: formData.flowRate
      },
      image: formData.images[0] || '/images/card-agri-clean.png',
      images: formData.images
    };

    const activeId = getActiveDealerId();
    setTimeout(() => {
      updateDealerProduct(product.id, updated, activeId);
      setIsSaving(false);
      navigate('/dealer/products');
    }, 400);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete "${formData.name}"?`)) {
      const activeId = getActiveDealerId();
      deleteDealerProduct(product.id, activeId);
      navigate('/dealer/products');
    }
  };

  return (
    <DealerLayout>
      <div className="flex flex-col w-full gap-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Link
              to="/dealer/products"
              className="inline-flex items-center gap-1.5 text-[#2C694E] hover:text-[#012D1D] text-xs font-semibold group transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Products</span>
            </Link>
            <div className="mt-0.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[#151D18] tracking-tight">
                Edit Product
              </h1>
              <p className="text-xs sm:text-sm text-[#717973] mt-0.5">
                Updating SKU: <span className="font-mono font-bold text-[#012D1D]">{formData.sku}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleDelete}
              className="h-10 px-3.5 rounded-xl bg-white text-red-600 font-bold text-xs border border-red-200 shadow-2xs hover:bg-red-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="h-10 px-5 rounded-xl bg-[#1B4332] text-white font-bold text-xs shadow-sm hover:bg-[#012D1D] active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: 8 cols */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Information */}
            <section className="bg-white border border-[#C1C8C2]/40 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-sm font-bold text-[#151D18]">Product Information</span>
                <span className="text-[10px] font-mono text-[#717973]">{formData.name.length} / 120</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#151D18]">Product Name</label>
                <input
                  type="text"
                  maxLength={120}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#EDF6ED] border text-xs sm:text-sm text-[#151D18] focus:outline-none focus:bg-white ${
                    errors.name ? 'border-red-500' : 'border-[#C1C8C2]/40 focus:border-[#2C694E]'
                  }`}
                />
                {errors.name && <span className="text-[11px] text-red-500">{errors.name}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#151D18]">Product Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-xs sm:text-sm text-[#151D18] focus:outline-none focus:bg-white focus:border-[#2C694E] resize-y"
                />
              </div>
            </section>

            {/* Category & Specs */}
            <section className="bg-white border border-[#C1C8C2]/40 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <span className="text-sm font-bold text-[#151D18] pb-2 border-b border-neutral-100">
                Category &amp; Specifications
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#151D18]">Authorized Category</label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2C694E] bg-[#EDF6ED] px-2 py-0.5 rounded-md">
                      <Lock className="w-2.5 h-2.5" />
                      Locked to Dealership
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={authorizedCategory}
                      className="w-full h-11 px-3.5 pr-8 rounded-xl bg-neutral-100 border border-[#C1C8C2]/60 text-xs sm:text-sm font-bold text-[#151D18] cursor-not-allowed select-none"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717973] pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-[#717973]">
                    Your verified dealership is authorized exclusively for <strong>{authorizedCategory}</strong>.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#151D18]">Subcategory</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-xs sm:text-sm text-[#151D18] focus:outline-none focus:bg-white focus:border-[#2C694E] cursor-pointer"
                  >
                    {availableSubcategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#717973]">
                    Authorized sector subcategories.
                  </p>
                </div>
              </div>

              {/* Technical Specifications Accordion */}
              <div className="rounded-xl bg-[#EDF6ED]/70 border border-[#C1C8C2]/40 p-4">
                <button
                  type="button"
                  onClick={() => setSpecsOpen(!specsOpen)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2C694E]" />
                    <span className="text-xs font-bold text-[#151D18]">Technical Specifications</span>
                  </div>
                  {specsOpen ? <ChevronUp className="w-4 h-4 text-[#717973]" /> : <ChevronDown className="w-4 h-4 text-[#717973]" />}
                </button>

                {specsOpen && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 mt-3 border-t border-[#C1C8C2]/40">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-[#151D18]">Material</label>
                      <input
                        type="text"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="h-9 px-2.5 rounded-lg bg-white border border-[#C1C8C2]/40 text-xs text-[#151D18]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-[#151D18]">Pipe Size / Dimension</label>
                      <input
                        type="text"
                        value={formData.pipeSize}
                        onChange={(e) => setFormData({ ...formData, pipeSize: e.target.value })}
                        className="h-9 px-2.5 rounded-lg bg-white border border-[#C1C8C2]/40 text-xs text-[#151D18]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-[#151D18]">Flow Rate / Capacity</label>
                      <input
                        type="text"
                        value={formData.flowRate}
                        onChange={(e) => setFormData({ ...formData, flowRate: e.target.value })}
                        className="h-9 px-2.5 rounded-lg bg-white border border-[#C1C8C2]/40 text-xs text-[#151D18]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Pricing & Stock */}
            <section className="bg-white border border-[#C1C8C2]/40 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <span className="text-sm font-bold text-[#151D18] pb-2 border-b border-neutral-100">
                Pricing &amp; Inventory
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#151D18]">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-sm font-bold text-[#151D18]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#151D18]">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={formData.mrpPrice}
                    onChange={(e) => setFormData({ ...formData, mrpPrice: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-sm font-medium text-[#717973]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#151D18]">Available Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-sm font-bold text-[#151D18]"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: 4 cols */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-20">
            {/* Status Card */}
            <div className="bg-white border border-[#C1C8C2]/40 rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="text-xs font-bold text-[#151D18]">Catalog Visibility</h3>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.status === 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'draft' })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2C694E]" />
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#EDF6ED] text-xs">
                <span className="font-semibold text-[#151D18]">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  formData.status === 'active' ? 'bg-[#AEEECB] text-[#0E5138]' : 'bg-neutral-200 text-neutral-700'
                }`}>
                  {formData.status === 'active' ? 'Active' : 'Draft'}
                </span>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white border border-[#C1C8C2]/40 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-neutral-100">
                <Eye className="w-4 h-4 text-[#2C694E]" />
                <h3 className="text-xs font-bold text-[#151D18]">Buyer View Preview</h3>
              </div>

              <div className="rounded-2xl overflow-hidden bg-[#EDF6ED]/50 border border-[#C1C8C2]/40">
                <div className="h-40 bg-neutral-100 overflow-hidden">
                  <img
                    src={formData.images[0] || '/images/card-agri-clean.png'}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-[#2C694E]">{formData.category}</span>
                  <h4 className="text-sm font-bold text-[#151D18] line-clamp-2">{formData.name}</h4>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-extrabold text-[#012D1D]">
                      ₹{Number(formData.sellingPrice || 0).toLocaleString('en-IN')}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-[10px] font-bold text-[#2C694E] bg-[#AEEECB]/70 px-2 py-0.5 rounded-full ml-auto">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DealerLayout>
  );
}

