import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  getAdminSettings,
  saveAdminSettings,
  syncAdminDataFromApi
} from '../../services/adminService';
import {
  User,
  Shield,
  Bell,
  Percent,
  Store,
  CheckCircle2,
  Save
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'commission', 'profile', 'roles', 'notifications'
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    document.title = 'Platform Settings | GROVE Admin';
    window.scrollTo(0, 0);
    setSettings(getAdminSettings());
    syncAdminDataFromApi().then(() => {
      setSettings(getAdminSettings());
    }).catch(() => {});
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    if (!settings) return;
    saveAdminSettings(settings);
    showToast('Platform settings saved successfully.');
  };

  if (!settings) return null;

  return (
    <AdminLayout>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#012D1D] text-white text-xs font-semibold shadow-xl border border-[#AEEECB]/40 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#AEEECB] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <AdminPageHeader
        title="Platform & Governance Settings"
        subtitle="Manage global marketplace parameters, commission take-rates, escrow holding days, admin roles, and alert webhooks."
        badge={`Version ${settings.general.systemVersion}`}
        breadcrumbs={[{ label: 'Settings' }]}
        actions={
          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#AEEECB]" />
            <span>Save All Changes</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar (3 Cols) */}
        <div className="lg:col-span-3 space-y-1">
          {[
            { id: 'general', label: 'General & Marketplace', icon: Store },
            { id: 'commission', label: 'Commission & Escrow', icon: Percent },
            { id: 'profile', label: 'Admin Profile', icon: User },
            { id: 'roles', label: 'Roles & Permissions', icon: Shield },
            { id: 'notifications', label: 'Alert Preferences', icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#012D1D] text-white shadow-xs'
                    : 'bg-white text-[#3F4943] hover:bg-[#F3FCF3] border border-[#C1C8C2]/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#AEEECB]' : 'text-[#717973]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel (9 Cols) */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-[#C1C8C2]/60 p-6 shadow-xs">
          <form onSubmit={handleSaveAll} className="space-y-6 text-xs">
            {/* Tab 1: General */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm text-[#012D1D] font-heading">Marketplace Configuration</h3>
                  <p className="text-xs text-[#717973]">Platform names, customer support desks, and operations status.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Platform Brand Name</label>
                    <input
                      type="text"
                      value={settings.general.marketplaceName}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, marketplaceName: e.target.value }
                      })}
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Support Desk Email</label>
                    <input
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, supportEmail: e.target.value }
                      })}
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Toll-Free Helpline</label>
                    <input
                      type="text"
                      value={settings.general.supportPhone}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, supportPhone: e.target.value }
                      })}
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Default Platform Currency</label>
                    <input
                      type="text"
                      disabled
                      value={settings.general.defaultCurrency}
                      className="w-full h-9 px-3 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/60 text-xs font-mono font-bold text-[#0E5138]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#C1C8C2]/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#151D18] block">Maintenance Mode</span>
                    <span className="text-[11px] text-[#717973]">Temporarily restricts buyer checkouts for platform upgrade.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.general.maintenanceMode}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, maintenanceMode: e.target.checked }
                    })}
                    className="w-5 h-5 rounded text-[#012D1D]"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Commission & Escrow */}
            {activeTab === 'commission' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm text-[#012D1D] font-heading">Commercial &amp; Escrow Policy</h3>
                  <p className="text-xs text-[#717973]">Default take-rates and holding periods for buyer delivery confirmation.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Default Platform Take-Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.commission.defaultCommissionRate}
                      onChange={(e) => setSettings({
                        ...settings,
                        commission: { ...settings.commission, defaultCommissionRate: parseFloat(e.target.value) }
                      })}
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono font-bold text-[#012D1D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Escrow Holding Period (Days After Delivery)</label>
                    <input
                      type="number"
                      value={settings.commission.escrowHoldPeriodDays}
                      onChange={(e) => setSettings({
                        ...settings,
                        commission: { ...settings.commission, escrowHoldPeriodDays: parseInt(e.target.value, 10) }
                      })}
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono font-bold text-[#012D1D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Minimum Payout Settlement Threshold (₹)</label>
                    <input
                      type="number"
                      value={settings.commission.minPayoutThreshold}
                      onChange={(e) => setSettings({
                        ...settings,
                        commission: { ...settings.commission, minPayoutThreshold: parseInt(e.target.value, 10) }
                      })}
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono font-bold text-[#012D1D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">TDS / TCS Withholding Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.commission.taxTcsRate}
                      onChange={(e) => setSettings({
                        ...settings,
                        commission: { ...settings.commission, taxTcsRate: parseFloat(e.target.value) }
                      })}
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono font-bold text-[#012D1D]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Admin Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm text-[#012D1D] font-heading">Administrator Profile</h3>
                  <p className="text-xs text-[#717973]">Current active administrative credentials and identity.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, name: e.target.value }
                      })}
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Corporate Admin Email</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, email: e.target.value }
                      })}
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Assigned Department</label>
                    <input
                      type="text"
                      value={settings.profile.department}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, department: e.target.value }
                      })}
                      className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Access Role Tier</label>
                    <input
                      type="text"
                      disabled
                      value={settings.profile.role}
                      className="w-full h-9 px-3 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/60 text-xs font-mono font-bold text-[#0E5138]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Roles & Permissions */}
            {activeTab === 'roles' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm text-[#012D1D] font-heading">Platform Governance Roles</h3>
                  <p className="text-xs text-[#717973]">Role-based access privileges for GROVE enterprise management.</p>
                </div>

                <div className="space-y-3">
                  {settings.roles.map((role) => (
                    <div
                      key={role.id}
                      className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#C1C8C2]/40 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-[#012D1D]">{role.name}</span>
                          {role.isSystem && (
                            <span className="px-1.5 py-0.2 rounded bg-[#012D1D] text-[#AEEECB] text-[9px] font-mono font-bold uppercase">
                              Core System
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#717973]">{role.description}</p>
                      </div>

                      <span className="font-mono text-xs font-bold text-[#012D1D] bg-white px-2.5 py-1 rounded-xl border border-[#C1C8C2]/50">
                        {role.usersCount} Assigned
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm text-[#012D1D] font-heading">Operational Alert Triggers</h3>
                  <p className="text-xs text-[#717973]">Automated notification rules sent to operations administrators.</p>
                </div>

                <div className="space-y-3 divide-y divide-[#C1C8C2]/30">
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#151D18] block">New Dealer KYC Application</span>
                      <span className="text-[11px] text-[#717973]">Notify operations when merchant documents are uploaded.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailOnNewKyc}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailOnNewKyc: e.target.checked }
                      })}
                      className="w-5 h-5 rounded text-[#012D1D]"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#151D18] block">Buyer Cargo Dispute Escalation</span>
                      <span className="text-[11px] text-[#717973]">Instant alert on urgent damage or transit disputes.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailOnEscalatedDispute}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailOnEscalatedDispute: e.target.checked }
                      })}
                      className="w-5 h-5 rounded text-[#012D1D]"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#151D18] block">Depot Low-Stock Warning Alert</span>
                      <span className="text-[11px] text-[#717973]">Email daily digest of SKUs breaching safety stock threshold.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailOnLowStock}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailOnLowStock: e.target.checked }
                      })}
                      className="w-5 h-5 rounded text-[#012D1D]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#C1C8C2]/40 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white font-bold text-xs shadow-xs"
              >
                Save All Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

