import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  getAdminLocations,
  createAdminLocation,
  updateAdminLocation,
  deleteAdminLocation,
  syncAdminDataFromApi
} from '../../services/adminService';
import {
  Search,
  Plus,
  Compass,
  CheckCircle2,
  X,
  Edit2,
  Trash2
} from 'lucide-react';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const initialForm = {
    hubCode: '',
    dealerName: 'Apex Agri-Tech & Machinery',
    dealerId: 'DEALER_001',
    hubType: 'Regional Spares Depot',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411026',
    address: '',
    contactPhone: '+91 98201 44219',
    capacityTons: 250,
    serviceRadiusKm: 140,
    activePinCodesCount: 45,
    status: 'Operational'
  };
  const [formData, setFormData] = useState(initialForm);

  const loadData = () => {
    setLocations(getAdminLocations());
  };

  useEffect(() => {
    document.title = 'Dealer Locations | GROVE Admin';
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

  const uniqueStates = useMemo(() => {
    return Array.from(new Set(locations.map((l) => l.state).filter(Boolean)));
  }, [locations]);

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        loc.city.toLowerCase().includes(q) ||
        loc.hubCode.toLowerCase().includes(q) ||
        loc.dealerName.toLowerCase().includes(q) ||
        loc.address.toLowerCase().includes(q);

      const matchState = stateFilter === 'All' || loc.state === stateFilter;
      const matchType = typeFilter === 'All' || loc.hubType === typeFilter;

      return matchSearch && matchState && matchType;
    });
  }, [locations, searchQuery, stateFilter, typeFilter]);

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (loc, e) => {
    if (e) e.stopPropagation();
    setFormData(loc);
    setIsEditing(true);
    setIsAddEditOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.city.trim() || !formData.address.trim()) {
      showToast('City and physical address are required.');
      return;
    }

    if (isEditing && formData.id) {
      updateAdminLocation(formData.id, formData);
      showToast(`Updated hub location ${formData.hubCode}.`);
    } else {
      createAdminLocation(formData);
      showToast(`Created new regional hub in ${formData.city}.`);
    }

    loadData();
    setIsAddEditOpen(false);
  };

  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Delete this dealer location from the regional fulfillment network?')) {
      deleteAdminLocation(id);
      loadData();
      showToast('Location deleted.');
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
        title="Dealer Logistics Locations"
        subtitle="Manage authorized warehouse depots, delivery clusters, service radius, and regional freight corridors."
        badge={`${locations.length} Active Hubs`}
        breadcrumbs={[{ label: 'Locations' }]}
        actions={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#AEEECB]" />
            <span>Add Logistics Depot</span>
          </button>
        }
      />

      {/* 1. Regional Network Visualization (Pure CSS/SVG Map-Style Grid) */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#012D1D]" />
              <h3 className="font-extrabold text-sm sm:text-base text-[#012D1D] font-heading">
                Regional Hub Coverage &amp; Delivery Radii
              </h3>
            </div>
            <p className="text-xs text-[#717973]">
              Active fulfillment hubs mapped across Maharashtra, Punjab, Madhya Pradesh, and Telangana.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#0E5138] bg-[#F3FCF3] px-2.5 py-1 rounded-xl border border-[#C1C8C2]/40">
            520+ Pin Codes Covered
          </span>
        </div>

        {/* Regional Hub Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="p-3.5 rounded-2xl bg-[#F8FAF8] border border-[#C1C8C2]/40 hover:border-[#012D1D] transition-all space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-black text-[#012D1D] bg-white px-2 py-0.5 rounded border border-[#C1C8C2]/50">
                  {loc.hubCode}
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  {loc.serviceRadiusKm} km radius
                </span>
              </div>

              <div>
                <span className="font-extrabold text-[#151D18] text-sm block">{loc.city}</span>
                <span className="text-[11px] text-[#717973]">{loc.state} • {loc.pincode}</span>
              </div>

              <div className="pt-2 border-t border-[#C1C8C2]/30 flex items-center justify-between text-[11px] font-mono text-[#3F4943]">
                <span>Cap: {loc.capacityTons} T</span>
                <span>{loc.activePinCodesCount} Pin Codes</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#717973] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, hub code, address, or dealer..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium text-[#151D18] focus:outline-none focus:border-[#012D1D]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold text-[#151D18]"
            >
              <option value="All">All States</option>
              {uniqueStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold text-[#151D18]"
            >
              <option value="All">All Depot Types</option>
              <option value="Primary Central Depot">Primary Central Depot</option>
              <option value="Regional Spares Depot">Regional Spares Depot</option>
              <option value="Heavy Implements Yard">Heavy Implements Yard</option>
              <option value="Machinery Assembly Yard">Machinery Assembly Yard</option>
            </select>

            {(searchQuery || stateFilter !== 'All' || typeFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStateFilter('All');
                  setTypeFilter('All');
                }}
                className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Locations Table */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#C1C8C2]/50 bg-[#F8FAF8] text-[#717973] font-mono uppercase text-[10px]">
                <th className="py-3 px-4 font-bold">Hub Code &amp; City</th>
                <th className="py-3 px-4 font-bold">Associated Dealer</th>
                <th className="py-3 px-4 font-bold">Facility Type</th>
                <th className="py-3 px-4 font-bold">Physical Address</th>
                <th className="py-3 px-3 font-bold text-center">Capacity</th>
                <th className="py-3 px-3 font-bold text-center">Radius</th>
                <th className="py-3 px-4 font-bold text-center">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C1C8C2]/30">
              {filteredLocations.map((loc) => (
                <tr key={loc.id} className="hover:bg-[#F8FAF8] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#012D1D] block">{loc.hubCode}</span>
                    <span className="font-extrabold text-[#151D18]">{loc.city}, {loc.state}</span>
                  </td>

                  <td className="py-3 px-4 text-[#3F4943]">
                    <span className="font-semibold">{loc.dealerName}</span>
                    <span className="text-[10px] font-mono text-[#717973] block">{loc.contactPhone}</span>
                  </td>

                  <td className="py-3 px-4 text-[#3F4943]">
                    <span className="px-2 py-0.5 rounded-full bg-[#F3FCF3] border border-[#C1C8C2]/50 text-[10px] font-mono text-[#0E5138]">
                      {loc.hubType}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-[#717973] max-w-xs truncate" title={loc.address}>
                    {loc.address}
                  </td>

                  <td className="py-3 px-3 text-center font-mono font-bold text-[#012D1D]">
                    {loc.capacityTons} Tons
                  </td>

                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-800">
                    {loc.serviceRadiusKm} km
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                      {loc.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEdit(loc, e)}
                        className="p-1.5 rounded-lg text-[#717973] hover:text-[#012D1D] hover:bg-[#F3FCF3]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(loc.id, e)}
                        className="p-1.5 rounded-lg text-[#717973] hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Location Modal */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#012D1D]/50 backdrop-blur-xs" onClick={() => setIsAddEditOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#C1C8C2]/70 shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#C1C8C2]/40">
              <h3 className="font-extrabold text-base text-[#012D1D]">
                {isEditing ? 'Edit Depot Location' : 'Register New Regional Depot'}
              </h3>
              <button type="button" onClick={() => setIsAddEditOpen(false)} className="p-1 rounded-xl text-[#717973]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Hub Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.hubCode}
                    onChange={(e) => setFormData({ ...formData, hubCode: e.target.value })}
                    placeholder="e.g. HUB-KOL-09"
                    className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Associated Dealer</label>
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
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#3F4943] mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3F4943] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Physical Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Plot 18, MIDC Heavy Logistics Park"
                  className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Capacity (Tons)</label>
                  <input
                    type="number"
                    value={formData.capacityTons}
                    onChange={(e) => setFormData({ ...formData, capacityTons: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3F4943] mb-1">Service Radius (km)</label>
                  <input
                    type="number"
                    value={formData.serviceRadiusKm}
                    onChange={(e) => setFormData({ ...formData, serviceRadiusKm: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#C1C8C2]/40">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#C1C8C2]/60 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white font-bold"
                >
                  {isEditing ? 'Save Changes' : 'Register Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

