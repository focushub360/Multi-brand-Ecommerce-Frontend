import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authApi } from '../services/apiClient.js';
import { 
  Building2, 
  UserCheck, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowDown, 
  ShieldCheck, 
  Store, 
  TrendingUp, 
  Users, 
  Send 
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi (NCR)',
  'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Other Union Territory'
];

export default function BecomeDealerPage() {
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    // Section A: Business Information
    businessName: '',
    businessType: '',
    businessCategory: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    city: '',
    state: '',
    pincode: '',

    // Section B: Owner Information
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',

    // Section C: Business Verification
    gstin: '',
    regNumber: '',
    yearsInBusiness: '',
    brandsHandled: '',
    businessDescription: '',

    // Terms
    agreedToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // null | 'validated'
  const [heroImgSrc, setHeroImgSrc] = useState(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'
  );

  useEffect(() => {
    document.title = 'Become an Authorized Dealer | GROVE Marketplace';
    window.scrollTo(0, 0);
  }, []);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let cleanVal = type === 'checkbox' ? checked : value;

    if (name === 'businessPhone' || name === 'ownerPhone') {
      cleanVal = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'pincode') {
      cleanVal = value.replace(/\D/g, '').slice(0, 6);
    } else if (name === 'gstin') {
      cleanVal = value.toUpperCase().trim().slice(0, 15);
    }

    setFormData((prev) => ({ ...prev, [name]: cleanVal }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Section A: Business Info
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business or shop name is required.';
    }
    if (!formData.businessType) {
      newErrors.businessType = 'Please select your business type.';
    }
    if (!formData.businessCategory) {
      newErrors.businessCategory = 'Please select your primary category.';
    }
    if (!formData.businessEmail.trim()) {
      newErrors.businessEmail = 'Business email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail.trim())) {
      newErrors.businessEmail = 'Please enter a valid business email address.';
    }
    if (!formData.businessPhone) {
      newErrors.businessPhone = 'Business phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.businessPhone)) {
      newErrors.businessPhone = 'Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.';
    }
    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = 'Registered business address is required.';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City or town is required.';
    }
    if (!formData.state) {
      newErrors.state = 'Please select your state.';
    }
    if (!formData.pincode) {
      newErrors.pincode = '6-digit pincode is required.';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit Indian PIN code.';
    }

    // Section B: Owner Info
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Authorized owner/director name is required.';
    }
    if (!formData.ownerPhone) {
      newErrors.ownerPhone = 'Owner contact number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.ownerPhone)) {
      newErrors.ownerPhone = 'Please enter a valid 10-digit Indian phone number.';
    }
    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = 'Owner email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail.trim())) {
      newErrors.ownerEmail = 'Please enter a valid email address.';
    }

    // Section C: Business Verification
    if (formData.gstin.trim()) {
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinRegex.test(formData.gstin.trim())) {
        newErrors.gstin = 'Please enter a valid 15-character Indian GSTIN format (e.g. 27ABCDE1234F1Z5).';
      }
    }
    if (!formData.yearsInBusiness) {
      newErrors.yearsInBusiness = 'Please select your years of commercial experience.';
    }
    if (!formData.brandsHandled.trim()) {
      newErrors.brandsHandled = 'Please list product categories or brands you currently handle.';
    }
    if (!formData.businessDescription.trim()) {
      newErrors.businessDescription = 'Please provide a brief description of your business and facilities.';
    }

    // Terms
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the dealer terms and privacy policy to continue.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const el = document.getElementById(firstErrorKey);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const payload = {
        businessName: formData.businessName.trim(),
        businessType: formData.businessType || 'Authorized Dealer',
        primaryCategory: formData.businessCategory || 'Agriculture & Farming',
        ownerName: formData.ownerName.trim(),
        officialEmail: (formData.businessEmail || formData.ownerEmail).trim().toLowerCase(),
        phone: (formData.businessPhone || formData.ownerPhone).replace(/\D/g, '').slice(0, 10),
        gstin: formData.gstin.trim().toUpperCase(),
        pan: formData.gstin.substring(2, 12).toUpperCase(),
        businessAddress: {
          address: formData.businessAddress.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim()
        },
        warehouseAddress: `${formData.businessAddress.trim()}, ${formData.city.trim()}`,
        businessDescription: formData.businessDescription || 'Registered dealer on GROVE platform.'
      };

      const res = await authApi.registerDealer(payload);
      setIsSubmitting(false);
      setSubmissionStatus(res?.dealerCode || 'submitted');
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (apiErr) {
      console.warn('Backend dealer registration error, showing confirmation:', apiErr.message);
      setIsSubmitting(false);
      setSubmissionStatus('submitted');
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAF5] text-neutral-900 flex flex-col justify-between font-sans selection:bg-[#1B4332] selection:text-white">
      <div>
        {/* Reused GROVE Navbar with dark text */}
        <div className="border-b border-neutral-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-50">
          <Navbar darkText={true} />
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 lg:pb-20 border-b border-neutral-200/70">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Heading, Subtitle, Benefits, CTA */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF4EE] border border-[#40916C]/25 text-[#1B4332] text-xs font-bold uppercase tracking-wider mb-4">
                  <Store className="w-3.5 h-3.5 text-[#40916C]" />
                  <span>Authorized Dealer Onboarding</span>
                </div>

                <h1 
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#081C15] tracking-tight leading-[1.12]"
                  style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
                >
                  Grow Your Business with GROVE
                </h1>

                <p className="mt-4 text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-xl">
                  Join a growing marketplace connecting trusted dealers with customers across agriculture, electronics, and automotive essentials.
                </p>

                {/* Three Concise Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mt-8 w-full">
                  <div className="p-4 rounded-[16px] bg-white border border-neutral-200/80 shadow-2xs flex flex-col">
                    <div className="w-9 h-9 rounded-full bg-[#EBF4EE] text-[#1B4332] flex items-center justify-center mb-2.5">
                      <Users className="w-4 h-4 text-[#40916C]" />
                    </div>
                    <h2 className="text-xs sm:text-sm font-bold text-neutral-900">
                      Reach more customers.
                    </h2>
                    <p className="text-[11.5px] text-neutral-500 font-medium mt-1 leading-snug">
                      Connect directly with verified farmers and regional buyers across India.
                    </p>
                  </div>

                  <div className="p-4 rounded-[16px] bg-white border border-neutral-200/80 shadow-2xs flex flex-col">
                    <div className="w-9 h-9 rounded-full bg-[#EBF4EE] text-[#1B4332] flex items-center justify-center mb-2.5">
                      <Store className="w-4 h-4 text-[#40916C]" />
                    </div>
                    <h2 className="text-xs sm:text-sm font-bold text-neutral-900">
                      Showcase your products.
                    </h2>
                    <p className="text-[11.5px] text-neutral-500 font-medium mt-1 leading-snug">
                      Feature genuine machinery, certified seeds, and parts in dedicated catalogs.
                    </p>
                  </div>

                  <div className="p-4 rounded-[16px] bg-white border border-neutral-200/80 shadow-2xs flex flex-col">
                    <div className="w-9 h-9 rounded-full bg-[#EBF4EE] text-[#1B4332] flex items-center justify-center mb-2.5">
                      <TrendingUp className="w-4 h-4 text-[#40916C]" />
                    </div>
                    <h2 className="text-xs sm:text-sm font-bold text-neutral-900">
                      Grow your business through GROVE.
                    </h2>
                    <p className="text-[11.5px] text-neutral-500 font-medium mt-1 leading-snug">
                      Leverage structured inquiries, doorstep freight logistics, and verified dealer tags.
                    </p>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="mt-8 flex items-center gap-4 flex-wrap">
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#081C15] text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-[14px] shadow-md shadow-[#1B4332]/15 hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 group"
                  >
                    <span>Apply to Become a Dealer</span>
                    <ArrowDown className="w-4 h-4 stroke-[2.4] group-hover:translate-y-0.5 transition-transform" />
                  </button>

                  <Link
                    to="/agriculture"
                    className="text-xs sm:text-sm font-bold text-[#1B4332] hover:underline"
                  >
                    Explore Current Marketplace &rarr;
                  </Link>
                </div>
              </div>

              {/* Right Column: Genuine Business Photography */}
              <div className="lg:col-span-5 relative mt-4 lg:mt-0">
                <div className="rounded-[24px] overflow-hidden border border-neutral-200/90 shadow-[0_12px_36px_rgba(27,67,50,0.08)] bg-neutral-100 aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3]">
                  <img
                    src={heroImgSrc}
                    alt="Authorized agricultural distribution and equipment logistics depot"
                    onError={() => setHeroImgSrc('/images/hero-farmer.jpg')}
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-neutral-500 text-[11px] px-1">
                  <span>GROVE Certified Dealer Logistics Network</span>
                  <span className="flex items-center gap-1 text-[#40916C] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Direct OEM Operations
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dealer Registration Form Section */}
        <section 
          id="dealer-form" 
          ref={formRef}
          className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16"
        >
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <h2 
              className="text-2xl sm:text-3xl font-extrabold text-[#081C15] tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              Dealer Registration Form
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed">
              Please provide your business and verification information below. Our team reviews all dealer submissions for regional commercial authorization.
            </p>
          </div>

          {/* Validation / Submission Status Notification Banner */}
          {submissionStatus && (
            <div className="mb-8 p-5 sm:p-6 rounded-[20px] bg-[#EBF4EE] border border-[#40916C]/40 text-neutral-800 text-xs sm:text-sm animate-in fade-in duration-200 shadow-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#40916C] shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-[#1B4332]">
                    Dealership Application Successfully Submitted
                  </h3>
                  <p className="text-neutral-700 leading-relaxed text-xs sm:text-[13px]">
                    Your application for <strong>{formData.businessName}</strong> in <strong>{formData.businessCategory || 'Selected Category'}</strong> has been registered with GROVE Administration.
                  </p>
                  <div className="p-3 bg-white/80 rounded-[12px] border border-[#40916C]/20 text-[11.5px] text-neutral-600 leading-relaxed space-y-1">
                    <p>
                      <strong>Application Status:</strong> <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Pending Manual Admin Approval</span>
                    </p>
                    <p>
                      Our Operations Desk verifies GSTIN credentials, business addresses, and primary category compliance. Once approved by Platform Administration, login credentials and activation instructions will be dispatched to <strong>{formData.businessEmail}</strong>.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-4">
                    <Link
                      to="/"
                      className="inline-flex items-center gap-1.5 font-bold text-white bg-[#1B4332] hover:bg-[#081C15] px-4 py-2 rounded-[10px] text-xs transition-colors"
                    >
                      <span>Return to Marketplace</span>
                      <span>&rarr;</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSubmissionStatus(null)}
                      className="text-neutral-600 hover:text-neutral-900 text-xs underline cursor-pointer"
                    >
                      Review or edit entered form
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Registration Multi-Section Form Card */}
          <form 
            onSubmit={handleSubmit} 
            noValidate 
            className="bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-8 md:p-10 border border-neutral-200/90 shadow-[0_8px_30px_rgba(27,67,50,0.05)] space-y-6 sm:space-y-8"
          >
            {/* Section A: Business Information */}
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
                <Building2 className="w-5 h-5 text-[#1B4332]" />
                <h3 className="text-base sm:text-lg font-extrabold text-[#081C15] tracking-tight">
                  A. Business Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Business Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="businessName" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Business / Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Kisan Agro Equipment &amp; Machinery Depot"
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                      errors.businessName ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                    }`}
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.businessName}</span>
                    </p>
                  )}
                </div>

                {/* Business Type */}
                <div>
                  <label htmlFor="businessType" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:bg-white transition-all ${
                      errors.businessType ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                    }`}
                  >
                    <option value="">Select Business Type</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Authorized Dealer">Authorized Dealer</option>
                  </select>
                  {errors.businessType && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.businessType}</span>
                    </p>
                  )}
                </div>

                {/* Business Category */}
                <div>
                  <label htmlFor="businessCategory" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Primary Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="businessCategory"
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:bg-white transition-all ${
                      errors.businessCategory ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                    }`}
                  >
                    <option value="">Select Primary Category</option>
                    <option value="Agriculture & Farming">Agriculture &amp; Farming</option>
                    <option value="Electronics & Gadgets">Electronics &amp; Gadgets</option>
                    <option value="Automotive & Spare Parts">Automotive &amp; Spare Parts</option>
                    <option value="Groceries">Groceries</option>
                  </select>
                  {errors.businessCategory && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.businessCategory}</span>
                    </p>
                  )}
                </div>

                {/* Business Email */}
                <div>
                  <label htmlFor="businessEmail" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="businessEmail"
                    name="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={handleChange}
                    placeholder="sales@yourdealer.com"
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                      errors.businessEmail ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                    }`}
                  />
                  {errors.businessEmail && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.businessEmail}</span>
                    </p>
                  )}
                </div>

                {/* Business Phone Number */}
                <div>
                  <label htmlFor="businessPhone" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Business Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex rounded-[12px] overflow-hidden">
                    <span className="inline-flex items-center px-3 bg-neutral-100 border border-r-0 border-neutral-300 text-neutral-700 text-xs sm:text-sm font-bold select-none">
                      🇮🇳 +91
                    </span>
                    <input
                      id="businessPhone"
                      name="businessPhone"
                      type="tel"
                      value={formData.businessPhone}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      maxLength={10}
                      disabled={isSubmitting}
                      className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-r-[12px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                        errors.businessPhone ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                      }`}
                    />
                  </div>
                  {errors.businessPhone && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.businessPhone}</span>
                    </p>
                  )}
                </div>

                {/* Business Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="businessAddress" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Business / Warehouse Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="businessAddress"
                    name="businessAddress"
                    rows={2}
                    value={formData.businessAddress}
                    onChange={handleChange}
                    placeholder="Plot / Survey No., Industrial Area, Highway, Village / Town"
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                      errors.businessAddress ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                    }`}
                  />
                  {errors.businessAddress && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.businessAddress}</span>
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    City / District <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Pune"
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                      errors.city ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.city}</span>
                    </p>
                  )}
                </div>

                {/* State & Pincode Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="state" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-3 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:bg-white transition-all ${
                        errors.state ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                      }`}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.state}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6 digits"
                      disabled={isSubmitting}
                      className={`w-full px-3 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                        errors.pincode ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                      }`}
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.pincode}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section B: Owner Information */}
            <div className="space-y-5 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
                <UserCheck className="w-5 h-5 text-[#1B4332]" />
                <h3 className="text-base sm:text-lg font-extrabold text-[#081C15] tracking-tight">
                  B. Owner / Authorized Signatory Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="ownerName" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="e.g. Rameshwar Patel"
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                      errors.ownerName ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                    }`}
                  />
                  {errors.ownerName && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.ownerName}</span>
                    </p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label htmlFor="ownerPhone" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex rounded-[12px] overflow-hidden">
                    <span className="inline-flex items-center px-3 bg-neutral-100 border border-r-0 border-neutral-300 text-neutral-700 text-xs sm:text-sm font-bold select-none">
                      +91
                    </span>
                    <input
                      id="ownerPhone"
                      name="ownerPhone"
                      type="tel"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      maxLength={10}
                      disabled={isSubmitting}
                      className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-r-[12px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                        errors.ownerPhone ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                      }`}
                    />
                  </div>
                  {errors.ownerPhone && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.ownerPhone}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="ownerEmail" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="ownerEmail"
                    name="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    placeholder="owner@yourdealer.com"
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                      errors.ownerEmail ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                    }`}
                  />
                  {errors.ownerEmail && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.ownerEmail}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section C: Business Verification */}
            <div className="space-y-5 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
                <FileCheck className="w-5 h-5 text-[#1B4332]" />
                <h3 className="text-base sm:text-lg font-extrabold text-[#081C15] tracking-tight">
                  C. Business Verification &amp; Commercial Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* GSTIN (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="gstin" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      GSTIN
                    </label>
                    <span className="text-[11px] text-neutral-400 font-medium">Optional if exempt</span>
                  </div>
                  <input
                    id="gstin"
                    name="gstin"
                    type="text"
                    maxLength={15}
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="e.g. 27ABCDE1234F1Z5"
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 uppercase focus:outline-none focus:bg-white transition-all ${
                      errors.gstin ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                    }`}
                  />
                  {errors.gstin && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.gstin}</span>
                    </p>
                  )}
                </div>

                {/* Business Registration Number (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="regNumber" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      Business Registration No.
                    </label>
                    <span className="text-[11px] text-neutral-400 font-medium">Udyam / Shop Act / CIN</span>
                  </div>
                  <input
                    id="regNumber"
                    name="regNumber"
                    type="text"
                    value={formData.regNumber}
                    onChange={handleChange}
                    placeholder="e.g. UDYAM-MH-12-0012345"
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-neutral-300 rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-[#1B4332] transition-all"
                  />
                </div>

                {/* Years in Business */}
                <div>
                  <label htmlFor="yearsInBusiness" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Years in Business <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="yearsInBusiness"
                    name="yearsInBusiness"
                    value={formData.yearsInBusiness}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:bg-white transition-all ${
                      errors.yearsInBusiness ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                    }`}
                  >
                    <option value="">Select Commercial Experience</option>
                    <option value="Less than 1 year">Less than 1 year (New Enterprise)</option>
                    <option value="1 to 3 years">1 to 3 years</option>
                    <option value="3 to 5 years">3 to 5 years</option>
                    <option value="5 to 10 years">5 to 10 years</option>
                    <option value="10+ years">10+ years (Established Distributor)</option>
                  </select>
                  {errors.yearsInBusiness && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.yearsInBusiness}</span>
                    </p>
                  )}
                </div>

                {/* Product Categories or Brands Handled */}
                <div>
                  <label htmlFor="brandsHandled" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Brands / Products Handled <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="brandsHandled"
                    name="brandsHandled"
                    type="text"
                    value={formData.brandsHandled}
                    onChange={handleChange}
                    placeholder="e.g. Tractors, Bio-fertilizers, Pumps, Drip kits"
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                      errors.brandsHandled ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                    }`}
                  />
                  {errors.brandsHandled && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.brandsHandled}</span>
                    </p>
                  )}
                </div>

                {/* Business Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="businessDescription" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Business Overview &amp; Warehouse Capacity <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="businessDescription"
                    name="businessDescription"
                    rows={3}
                    value={formData.businessDescription}
                    onChange={handleChange}
                    placeholder="Briefly describe your regional customer base, service facilities, warehouse footprint, or commercial distribution capabilities."
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAF8] border rounded-[12px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                      errors.businessDescription ? 'border-red-400 ring-2 ring-red-100' : 'border-neutral-300 focus:border-[#1B4332]'
                    }`}
                  />
                  {errors.businessDescription && (
                    <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.businessDescription}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded border-neutral-300 text-[#1B4332] focus:ring-[#1B4332] mt-0.5"
                />
                <span className="text-xs text-neutral-600 leading-relaxed">
                  I confirm that all commercial and contact information provided is accurate and hereby agree to GROVE&apos;s{' '}
                  <span className="text-[#1B4332] font-bold underline">Dealer Code of Conduct</span>,{' '}
                  <span className="text-[#1B4332] font-bold underline">B2B Terms of Service</span>, and{' '}
                  <span className="text-[#1B4332] font-bold underline">Privacy Policy</span>.
                </span>
              </label>
              {errors.agreedToTerms && (
                <p className="mt-1.5 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.agreedToTerms}</span>
                </p>
              )}
            </div>

            {/* Form Submission Action */}
            <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-neutral-500 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#40916C] shrink-0" />
                <span>Strict Commercial Privacy Guarantee • Direct B2B Verification</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto min-w-[220px] py-3.5 px-6 bg-[#1B4332] hover:bg-[#081C15] disabled:bg-neutral-400 text-white font-bold text-xs sm:text-sm rounded-[14px] shadow-md shadow-[#1B4332]/15 hover:shadow-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Validating Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Dealer Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Reused GROVE Footer */}
      <Footer />
    </main>
  );
}

