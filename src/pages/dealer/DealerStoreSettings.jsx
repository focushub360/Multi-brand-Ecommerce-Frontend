import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  CreditCard, 
  Clock, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import DealerLayout from '../../components/dealer/DealerLayout';
import { getDealerStoreSettings, saveDealerStoreSettings, syncDealerDataFromApi } from '../../services/dealerService';
import { getActiveDealerId } from '../../utils/auth';

export default function DealerStoreSettings() {
  const [settings, setSettings] = useState(() => getDealerStoreSettings(getActiveDealerId()));
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.title = 'Store Settings | GROVE Dealer Portal';
    window.scrollTo(0, 0);
    const activeId = getActiveDealerId();
    setSettings(getDealerStoreSettings(activeId));
    syncDealerDataFromApi(activeId).then(() => {
      setSettings(getDealerStoreSettings(activeId));
    }).catch(() => {});
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e) => {
    e?.preventDefault();
    setIsSaving(true);
    const currentId = getActiveDealerId();
    saveDealerStoreSettings(settings, currentId);
    setTimeout(() => {
      setIsSaving(false);
      setToastMessage('Store settings saved successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    }, 400);
  };

  return (
    <DealerLayout>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#012D1D] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs sm:text-sm font-semibold animate-fade-in border border-[#AEEECB]/30">
            <CheckCircle2 className="w-4 h-4 text-[#AEEECB]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#717973]">
              <Link to="/dealer/dashboard" className="hover:text-[#012D1D] transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#151D18] font-bold">Store Settings</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#012D1D] tracking-tight">
                Store Settings
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#AEEECB] text-[#0E5138] text-xs font-bold">
                Verified B2B Account
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#414844]">
              Manage your dealer brand, dispatch warehouse location, payout bank details, and business hours.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="h-10 px-6 rounded-xl bg-[#1B4332] text-white text-xs sm:text-sm font-bold hover:bg-[#012D1D] active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Section 1: Business Profile & Branding */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#C1C8C2]/40 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C1C8C2]/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2C694E]"></span>
                <h2 className="text-base sm:text-lg font-bold text-[#151D18]">
                  Business Profile & Branding
                </h2>
              </div>
              <span className="text-xs font-semibold text-[#717973] uppercase tracking-wider">Public Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  Trading Business Name
                </label>
                <input
                  type="text"
                  value={settings.storeName || ''}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  Primary Category Segment
                </label>
                <select
                  value={settings.businessCategory || 'Agriculture & Farm Equipment'}
                  onChange={(e) => handleChange('businessCategory', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all cursor-pointer"
                >
                  <option value="Agriculture & Farm Equipment">Agriculture & Farm Equipment</option>
                  <option value="Electronics & Smart Ag Tech">Electronics & Smart Ag Tech</option>
                  <option value="Automotive & Spare Parts">Automotive & Spare Parts</option>
                  <option value="Multi-Category Enterprise">Multi-Category Enterprise</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  Store Tagline & Description
                </label>
                <textarea
                  rows={3}
                  value={settings.tagline || ''}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] resize-y transition-colors leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  Official Contact Email
                </label>
                <input
                  type="email"
                  value={settings.businessEmail || ''}
                  onChange={(e) => handleChange('businessEmail', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  Dispatch Hotline / Phone
                </label>
                <input
                  type="text"
                  value={settings.businessPhone || ''}
                  onChange={(e) => handleChange('businessPhone', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  GSTIN (Tax Identification)
                </label>
                <input
                  type="text"
                  value={settings.gstin || ''}
                  onChange={(e) => handleChange('gstin', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] font-mono text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all uppercase"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  Store Operating Hours
                </label>
                <input
                  type="text"
                  value={settings.operatingHours || ''}
                  onChange={(e) => handleChange('operatingHours', e.target.value)}
                  placeholder="e.g. Mon - Sat: 08:30 AM - 07:30 PM"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Warehouse Location & Store Status */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#C1C8C2]/40 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C1C8C2]/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2C694E]"></span>
                <h2 className="text-base sm:text-lg font-bold text-[#151D18]">
                  Warehouse Location & Dispatch Hub
                </h2>
              </div>
              {/* Store Status Toggle */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-[#414844]">Accepting Orders:</span>
                <button
                  type="button"
                  onClick={() => handleChange('storeOpen', !settings.storeOpen)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.storeOpen ? 'bg-[#012D1D]' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      settings.storeOpen ? 'left-6.5' : 'left-0.5'
                    }`}
                  ></span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  Dispatch Depot Full Address
                </label>
                <input
                  type="text"
                  value={settings.warehouseAddress || ''}
                  onChange={(e) => handleChange('warehouseAddress', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  City / Hub
                </label>
                <input
                  type="text"
                  value={settings.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  State
                </label>
                <input
                  type="text"
                  value={settings.state || ''}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  Postal Pincode
                </label>
                <input
                  type="text"
                  value={settings.pincode || ''}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] font-mono text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Bank Account & Payout Details */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#C1C8C2]/40 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C1C8C2]/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2C694E]"></span>
                <h2 className="text-base sm:text-lg font-bold text-[#151D18]">
                  Payouts & Bank Settlement
                </h2>
              </div>
              <span className="text-xs font-bold text-[#0E5138] bg-[#AEEECB] px-2.5 py-0.5 rounded-full">
                T+2 Direct Transfer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  Settlement Bank
                </label>
                <input
                  type="text"
                  value={settings.bankName || ''}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  Account Number
                </label>
                <input
                  type="text"
                  value={settings.accountNumber || ''}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] font-mono text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={settings.ifsc || ''}
                  onChange={(e) => handleChange('ifsc', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] font-mono text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all uppercase"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  Corporate UPI ID
                </label>
                <input
                  type="text"
                  value={settings.upiId || ''}
                  onChange={(e) => handleChange('upiId', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#EDF6ED]/70 border border-[#C1C8C2]/30 flex items-start gap-3 text-xs sm:text-sm text-[#414844] mt-2">
              <ShieldCheck className="w-5 h-5 text-[#2C694E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#151D18] block">Automated B2B Escrow Clearance</span>
                <span className="leading-relaxed">
                  Payments for fulfilled orders are automatically settled to your verified account on a rolling T+2 schedule following proof-of-delivery (POD) cargo scanning.
                </span>
              </div>
            </div>
          </section>

          {/* Form Submit Footer */}
          <div className="flex justify-end gap-3 pb-8">
            <button
              type="submit"
              disabled={isSaving}
              className="h-11 px-8 rounded-xl bg-[#1B4332] text-white text-xs sm:text-sm font-bold hover:bg-[#012D1D] active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </DealerLayout>
  );
}
