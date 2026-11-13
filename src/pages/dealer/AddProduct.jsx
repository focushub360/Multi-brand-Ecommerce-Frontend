import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  Upload, 
  Trash2, 
  Check, 
  Sparkles, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  Eye,
  Lock
} from 'lucide-react';
import DealerLayout from '../../components/dealer/DealerLayout';
import { addDealerProduct, getDealerStoreSettings } from '../../services/dealerService';
import { getActiveDealerId, getStoredDealer } from '../../utils/auth';

const SUBCATEGORIES_BY_CATEGORY = {
  'Agriculture & Farming': [
    'Hybrid Seeds',
    'Fertilizers & Soil Nutrition',
    'Crop Protection',
    'Irrigation & Drip Systems',
    'Solar Pumps',
    'Farm Machinery'
  ],
  'Electronics & Gadgets': [
    'Smart Sensors & IoT',
    'Drones & Robotics',
    'Audio & Headphones',
    'Laptops & Computers',
    'Wearables & Smartwatches',
    'Keyboards & Accessories'
  ],
  'Automotive & Spare Parts': [
    'Braking Systems',
    'Tires & Wheels',
    'Suspension & Steering',
    'Electrical & Battery',
    'Engine & Drivetrain',
    'Spares & Accessories'
  ],
  'Groceries': [
    'Organic Staples & Grains',
    'Cold Pressed Oils',
    'Farm Fresh Pulses',
    'Spices & Seasonings'
  ]
};

export default function AddProduct() {
  const navigate = useNavigate();
  const activeId = getActiveDealerId();
  const dealerSettings = getDealerStoreSettings(activeId);
  const storedDealer = getStoredDealer();

  // Determine authorized category
  const authorizedCategory = 
    dealerSettings?.businessCategory || 
    (storedDealer?.email?.includes('hub') ? 'Electronics & Gadgets' : 'Agriculture & Farming');

  const availableSubcategories = SUBCATEGORIES_BY_CATEGORY[authorizedCategory] || SUBCATEGORIES_BY_CATEGORY['Agriculture & Farming'];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: authorizedCategory,
    subcategory: availableSubcategories[0] || 'Hybrid Seeds',
    sellingPrice: '',
    mrpPrice: '',
    gstRate: '18',
    sku: '',
    stock: '',
    threshold: '10',
    status: 'active',
    material: '',
    pipeSize: '',
    flowRate: '',
    images: []
  });

  const [specsOpen, setSpecsOpen] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quickFillSuccess, setQuickFillSuccess] = useState(false);

  const handleQuickFill = () => {
    const isAgri = authorizedCategory.includes('Agri');
    const isElec = authorizedCategory.includes('Elect');
    const isAuto = authorizedCategory.includes('Auto');
    const rand = Math.floor(1000 + Math.random() * 9000);

    let sampleData;
    if (isElec) {
      sampleData = {
        name: 'Smart Precision Agri Telemetry Soil Moisture & Temp Sensor Hub',
        description: 'Solar-powered IoT multi-depth soil moisture, EC salinity, and ambient temperature telemetry probe with Bluetooth 5.0 and 4G GSM cloud uplink for real-time agronomy analytics.',
        category: authorizedCategory,
        subcategory: availableSubcategories[0] || 'Smart Sensors & IoT',
        sellingPrice: '6899',
        mrpPrice: '8500',
        gstRate: '18',
        sku: `SKU-EL-TEST-${rand}`,
        stock: '25',
        threshold: '5',
        status: 'active',
        material: 'Weatherproof Anodized Stainless Steel & UV-Stabilized ABS',
        pipeSize: '300 mm Probe Depth',
        flowRate: 'RS485 Modbus RTU / 4G GSM',
        images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80']
      };
    } else if (isAuto) {
      sampleData = {
        name: 'Heavy Duty Multi-Row Ceramic Clutch Plate Assembly 280mm',
        description: 'High-friction sintered ceramic commercial clutch disc with heavy-duty dual dampener springs engineered for multi-axle agricultural haulers and commercial tractors under maximum continuous load.',
        category: authorizedCategory,
        subcategory: availableSubcategories[0] || 'Braking Systems',
        sellingPrice: '4850',
        mrpPrice: '6200',
        gstRate: '18',
        sku: `SKU-AU-TEST-${rand}`,
        stock: '30',
        threshold: '8',
        status: 'active',
        material: 'Sintered Ceramic & Forged Manganese Alloy',
        pipeSize: '280 mm Diameter, 10 Splines',
        flowRate: 'Max Torque 750 Nm',
        images: ['https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=500&q=80']
      };
    } else {
      sampleData = {
        name: 'TurboHarvest Pressure-Compensating Drip Irrigation Lateral Kit (16mm, 400m)',
        description: 'Commercial grade UV-stabilized virgin LLDPE drip irrigation lateral tubing with integrated 2.0 LPH non-draining pressure compensating emitters spaced at 40cm intervals for row crops and orchards.',
        category: authorizedCategory,
        subcategory: availableSubcategories[3] || availableSubcategories[0] || 'Irrigation & Drip Systems',
        sellingPrice: '3499',
        mrpPrice: '4200',
        gstRate: '18',
        sku: `SKU-AG-TEST-${rand}`,
        stock: '40',
        threshold: '10',
        status: 'active',
        material: '100% Virgin LLDPE Polymer',
        pipeSize: '16 mm Outer Diameter',
        flowRate: '2.0 LPH per Emitter (0.8 - 3.5 Bar)',
        images: ['/images/prod-drip.png']
      };
    }

    setFormData(sampleData);
    setErrors({});
    setQuickFillSuccess(true);
    setTimeout(() => setQuickFillSuccess(false), 3000);
  };

  const calculateDiscount = () => {
    const sp = parseFloat(formData.sellingPrice) || 0;
    const mrp = parseFloat(formData.mrpPrice) || 0;
    if (mrp > 0 && mrp > sp) {
      return Math.round(((mrp - sp) / mrp) * 100);
    }
    return 0;
  };

  const discountPercent = calculateDiscount();

  const handleGenerateSku = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const prefix = formData.category.startsWith('Agri') ? 'AGR' : formData.category.startsWith('Auto') ? 'AUT' : 'ELC';
    setFormData((prev) => ({ ...prev, sku: `${prefix}-GEN-${rand}` }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddSampleImage = () => {
    const defaultImg = '/images/card-agri-clean.png';
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, defaultImg]
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.sku.trim()) errs.sku = 'SKU code is required';
    if (!formData.sellingPrice || Number(formData.sellingPrice) <= 0) {
      errs.sellingPrice = 'Valid selling price is required';
    }
    if (formData.mrpPrice && Number(formData.mrpPrice) < Number(formData.sellingPrice)) {
      errs.mrpPrice = 'MRP cannot be less than selling price';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (publishStatus) => {
    if (!validate()) return;
    setIsSubmitting(true);

    const defaultImg = formData.category.includes('Elect')
      ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80'
      : formData.category.includes('Auto')
      ? '/images/prod-brakepads.png'
      : '/images/prod-drip.png';

    const productPayload = {
      name: formData.name.trim(),
      description: formData.description.trim() || `${formData.name.trim()} - genuine verified equipment with standard OEM manufacturer warranty.`,
      category: formData.category,
      subcategory: formData.subcategory,
      price: Number(formData.sellingPrice),
      mrp: Number(formData.mrpPrice || formData.sellingPrice),
      originalPrice: Number(formData.mrpPrice || formData.sellingPrice),
      discount: discountPercent,
      gstRate: Number(formData.gstRate) || 18,
      sku: formData.sku.trim().toUpperCase(),
      stock: Number(formData.stock) || 0,
      threshold: Number(formData.threshold) || 10,
      status: publishStatus === 'draft' ? 'Draft' : 'Active',
      specs: {
        material: formData.material || 'Commercial Grade',
        pipeSize: formData.pipeSize || 'Standard Specification',
        flowRate: formData.flowRate || 'Standard Rating'
      },
      image: formData.images[0] || defaultImg,
      images: formData.images.length > 0 ? formData.images : [defaultImg]
    };

    try {
      await addDealerProduct(productPayload, getActiveDealerId());
      navigate('/dealer/products');
    } catch (err) {
      console.warn('Backend product creation notice:', err.message);
      navigate('/dealer/products');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DealerLayout>
      <div className="flex flex-col w-full gap-6 relative">
        {/* Quick Fill Success Toast */}
        {quickFillSuccess && (
          <div className="fixed top-20 right-6 z-50 bg-[#012D1D] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-fade-in border border-[#AEEECB]/40">
            <Sparkles className="w-4 h-4 text-[#AEEECB]" />
            <span>Test product fields autofilled for {formData.category}!</span>
          </div>
        )}

        {/* Top Action & Nav Bar */}
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
                Add New Product
              </h1>
              <p className="text-xs sm:text-sm text-[#717973] mt-0.5">
                Add product information to your GROVE marketplace catalog.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Quick Fill Test Product Button */}
            <button
              type="button"
              onClick={handleQuickFill}
              className="h-10 px-3.5 rounded-xl bg-[#EDF6ED] border border-[#2C694E]/40 text-[#012D1D] hover:bg-[#AEEECB]/50 font-bold text-xs shadow-2xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Autofill realistic test product data for your locked category"
            >
              <Sparkles className="w-4 h-4 text-[#2C694E]" />
              <span className="hidden sm:inline">Quick Fill Test Product</span>
              <span className="sm:hidden">Quick Fill</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave('draft')}
              className="h-10 px-4 rounded-xl bg-white text-[#151D18] font-bold text-xs border border-[#C1C8C2]/60 shadow-2xs hover:bg-[#EDF6ED] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#717973]" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave('active')}
              className="h-10 px-5 rounded-xl bg-[#1B4332] text-white font-bold text-xs shadow-sm hover:bg-[#012D1D] active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Publish Product</span>
            </button>
          </div>
        </div>

        {/* 2-Column Shopify-inspired Grid Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Primary Data (8 of 12 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* a. Product Information */}
            <section className="bg-white border border-[#C1C8C2]/40 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2C694E]" />
                  <h2 className="text-sm font-bold text-[#151D18]">Product Information</h2>
                </div>
                <span className="text-[10px] font-bold text-[#717973] uppercase tracking-wider">
                  Required
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="product-name" className="text-xs font-semibold text-[#151D18]">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <span className="font-mono text-[10px] text-[#717973]">
                    {formData.name.length} / 120
                  </span>
                </div>
                <input
                  id="product-name"
                  type="text"
                  maxLength={120}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Precision Drip Irrigation Emitter Tube 16mm"
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#EDF6ED] border text-xs sm:text-sm text-[#151D18] focus:outline-none focus:bg-white transition-all ${
                    errors.name ? 'border-red-500' : 'border-[#C1C8C2]/40 focus:border-[#2C694E]'
                  }`}
                />
                {errors.name && <span className="text-[11px] text-red-500 font-medium">{errors.name}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="product-desc" className="text-xs font-semibold text-[#151D18]">
                  Product Description
                </label>
                <textarea
                  id="product-desc"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter detailed specifications, machinery usage, and agricultural applications..."
                  className="w-full p-3.5 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-xs sm:text-sm text-[#151D18] focus:outline-none focus:bg-white focus:border-[#2C694E] resize-y transition-colors leading-relaxed"
                />
              </div>
            </section>

            {/* b. Product Images */}
            <section className="bg-white border border-[#C1C8C2]/40 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2C694E]" />
                  <h2 className="text-sm font-bold text-[#151D18]">Product Images</h2>
                </div>
                <span className="text-[10px] font-semibold text-[#717973]">
                  {formData.images.length} uploaded
                </span>
              </div>

              {/* Upload Dropzone */}
              <div 
                onClick={handleAddSampleImage}
                className="p-6 rounded-2xl border-2 border-dashed border-[#C1C8C2]/80 bg-[#EDF6ED]/60 hover:bg-[#EDF6ED] hover:border-[#2C694E] transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center text-[#2C694E] group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="mt-2.5 flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-[#151D18]">
                    Click or drag images to upload
                  </span>
                  <span className="text-[11px] text-[#717973]">
                    PNG, JPG, WEBP formats up to 10MB
                  </span>
                </div>
              </div>

              {/* Uploaded Previews */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden bg-neutral-100 border border-[#C1C8C2]/40 aspect-square">
                    <img 
                      src={img} 
                      alt={`Preview ${idx}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {idx === 0 && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#012D1D] text-white text-[9px] font-bold uppercase tracking-wider">
                        Primary
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[#012D1D]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="w-7 h-7 rounded-lg bg-white text-red-600 hover:bg-red-50 flex items-center justify-center shadow-sm cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* c. Category & Specifications */}
            <section className="bg-white border border-[#C1C8C2]/40 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2C694E]" />
                  <h2 className="text-sm font-bold text-[#151D18]">Category &amp; Specifications</h2>
                </div>
                <span className="text-[10px] font-mono text-[#717973]">B2B Taxonomy</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="main-cat" className="text-xs font-semibold text-[#151D18]">
                      Authorized Category
                    </label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2C694E] bg-[#EDF6ED] px-2 py-0.5 rounded-md">
                      <Lock className="w-2.5 h-2.5" />
                      Locked to Dealership
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="main-cat"
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
                  <label htmlFor="sub-cat" className="text-xs font-semibold text-[#151D18]">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="sub-cat"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-xs sm:text-sm text-[#151D18] focus:outline-none focus:bg-white focus:border-[#2C694E] cursor-pointer"
                  >
                    {availableSubcategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#717973]">
                    Subcategory options tailored to {authorizedCategory}.
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
                    <span className="text-[10px] font-semibold bg-[#AEEECB] text-[#0E5138] px-2 py-0.5 rounded-full">
                      3 Configured
                    </span>
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
                        className="h-9 px-2.5 rounded-lg bg-white border border-[#C1C8C2]/40 text-xs text-[#151D18] focus:outline-none focus:border-[#2C694E]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-[#151D18]">Pipe Size</label>
                      <input
                        type="text"
                        value={formData.pipeSize}
                        onChange={(e) => setFormData({ ...formData, pipeSize: e.target.value })}
                        className="h-9 px-2.5 rounded-lg bg-white border border-[#C1C8C2]/40 text-xs text-[#151D18] focus:outline-none focus:border-[#2C694E]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-[#151D18]">Flow Rate</label>
                      <input
                        type="text"
                        value={formData.flowRate}
                        onChange={(e) => setFormData({ ...formData, flowRate: e.target.value })}
                        className="h-9 px-2.5 rounded-lg bg-white border border-[#C1C8C2]/40 text-xs text-[#151D18] focus:outline-none focus:border-[#2C694E]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* d. Pricing & Tax */}
            <section className="bg-white border border-[#C1C8C2]/40 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2C694E]" />
                  <h2 className="text-sm font-bold text-[#151D18]">Pricing &amp; Tax</h2>
                </div>
                <span className="text-[11px] font-bold text-[#2C694E]">INR (₹)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="selling-price" className="text-xs font-semibold text-[#151D18]">
                    Selling Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#717973]">₹</span>
                    <input
                      id="selling-price"
                      type="number"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      className="w-full h-11 pl-8 pr-3 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-sm font-bold text-[#151D18] focus:outline-none focus:bg-white focus:border-[#2C694E]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="mrp-price" className="text-xs font-semibold text-[#151D18]">
                    MRP / List Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#717973]">₹</span>
                    <input
                      id="mrp-price"
                      type="number"
                      value={formData.mrpPrice}
                      onChange={(e) => setFormData({ ...formData, mrpPrice: e.target.value })}
                      className="w-full h-11 pl-8 pr-3 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-sm font-medium text-[#717973] focus:outline-none focus:bg-white focus:border-[#2C694E]"
                    />
                  </div>
                </div>

                {/* Discount Badge */}
                <div className="h-11 flex items-center px-4 rounded-xl bg-[#AEEECB]/40 border border-[#C1C8C2]/40 justify-between">
                  <span className="text-xs font-semibold text-[#0E5138]">Discount:</span>
                  <span className="font-bold text-xs text-[#2C694E] bg-white px-2.5 py-0.5 rounded-full shadow-2xs">
                    {discountPercent > 0 ? `-${discountPercent}% OFF` : '0% (At MRP)'}
                  </span>
                </div>
              </div>

              {/* GST Rate */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#EDF6ED] border border-[#C1C8C2]/40 p-4 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-[#151D18] block">GST Rate</span>
                  <span className="text-[11px] text-[#717973]">Applicable B2B tax tariff</span>
                </div>
                <div className="flex items-center gap-2">
                  {['5', '12', '18'].map((rate) => (
                    <label key={rate} className="cursor-pointer">
                      <input
                        type="radio"
                        name="gst_rate"
                        value={rate}
                        checked={formData.gstRate === rate}
                        onChange={(e) => setFormData({ ...formData, gstRate: e.target.value })}
                        className="sr-only peer"
                      />
                      <div className="px-3.5 py-1.5 rounded-xl bg-white text-[#151D18] border border-[#C1C8C2]/40 peer-checked:bg-[#012D1D] peer-checked:text-white font-bold text-xs transition-all shadow-2xs">
                        {rate}%
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* e. Inventory */}
            <section className="bg-white border border-[#C1C8C2]/40 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2C694E]" />
                  <h2 className="text-sm font-bold text-[#151D18]">Inventory &amp; Stock Tracking</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="sku-input" className="text-xs font-semibold text-[#151D18]">
                      SKU Code <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateSku}
                      className="text-[10px] font-bold text-[#2C694E] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Auto-generate
                    </button>
                  </div>
                  <input
                    id="sku-input"
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="h-11 px-3.5 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-xs font-mono font-bold uppercase text-[#151D18] focus:outline-none focus:bg-white focus:border-[#2C694E]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="stock-input" className="text-xs font-semibold text-[#151D18]">
                    Available Stock
                  </label>
                  <input
                    id="stock-input"
                    type="number"
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="h-11 px-3.5 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-xs font-bold text-[#151D18] focus:outline-none focus:bg-white focus:border-[#2C694E]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="threshold-input" className="text-xs font-semibold text-[#151D18]">
                    Low Stock Alert
                  </label>
                  <input
                    id="threshold-input"
                    type="number"
                    min={0}
                    value={formData.threshold}
                    onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                    className="h-11 px-3.5 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/40 text-xs font-medium text-[#717973] focus:outline-none focus:bg-white focus:border-[#2C694E]"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Metadata & Buyer Preview (4 of 12 cols, sticky) */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-20">
            {/* a. Publishing Status card */}
            <div className="bg-white border border-[#C1C8C2]/40 rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="text-xs font-bold text-[#151D18]">Publishing Status</h3>
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

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#EDF6ED] border border-[#C1C8C2]/30 text-xs">
                <span className="font-semibold text-[#151D18]">Catalog Status</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  formData.status === 'active' 
                    ? 'bg-[#AEEECB] text-[#0E5138]' 
                    : 'bg-neutral-200 text-neutral-700'
                }`}>
                  {formData.status === 'active' ? 'Active (Live)' : 'Draft (Hidden)'}
                </span>
              </div>
            </div>

            {/* b. Live Product Preview card */}
            <div className="bg-white border border-[#C1C8C2]/40 rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#2C694E]" />
                  <h3 className="text-xs font-bold text-[#151D18]">Live Buyer Preview</h3>
                </div>
                <span className="text-[10px] font-bold text-[#2C694E] uppercase">B2B View</span>
              </div>

              {/* Preview card */}
              <div className="rounded-2xl overflow-hidden bg-[#EDF6ED]/50 border border-[#C1C8C2]/40 shadow-2xs flex flex-col">
                <div className="relative h-44 bg-neutral-100 overflow-hidden">
                  <img
                    src={formData.images[0] || '/images/card-agri-clean.png'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#012D1D] text-white text-[9px] font-bold tracking-wider">
                    GROVE VERIFIED
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#2C694E]">
                    <span>{formData.category}</span>
                    <span className="text-[#717973] font-normal">{formData.stock} in stock</span>
                  </div>

                  <h4 className="text-sm font-bold text-[#151D18] line-clamp-2 leading-snug">
                    {formData.name || 'Untitled Product'}
                  </h4>

                  <div className="flex items-baseline gap-2 pt-1 border-t border-neutral-200/40">
                    <span className="text-base font-extrabold text-[#012D1D]">
                      ₹{Number(formData.sellingPrice || 0).toLocaleString('en-IN')}
                    </span>
                    {formData.mrpPrice > formData.sellingPrice && (
                      <span className="text-xs text-[#717973] line-through">
                        ₹{Number(formData.mrpPrice).toLocaleString('en-IN')}
                      </span>
                    )}
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

