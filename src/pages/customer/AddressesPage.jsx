import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Home, 
  Briefcase, 
  Building, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AddressModal from '../../components/customer/AddressModal';
import { getStoredCustomer } from '../../utils/auth';
import { 
  getCustomerAddresses, 
  deleteCustomerAddress, 
  setDefaultAddress 
} from '../../services/addressService';

export default function AddressesPage() {
  const customer = getStoredCustomer();
  const [addresses, setAddresses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [feedback, setFeedback] = useState('');

  const loadAddresses = () => {
    if (!customer?.id) return;
    const list = getCustomerAddresses(customer.id);
    setAddresses(list);
  };

  useEffect(() => {
    loadAddresses();
    const handleUpdate = () => loadAddresses();
    window.addEventListener('grove_addresses_updated', handleUpdate);
    return () => window.removeEventListener('grove_addresses_updated', handleUpdate);
  }, [customer?.id]);

  const showToast = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleSetDefault = (addressId) => {
    if (!customer?.id) return;
    setDefaultAddress(customer.id, addressId);
    showToast('Default delivery address updated.');
  };

  const handleDelete = (addressId) => {
    if (!customer?.id) return;
    deleteCustomerAddress(customer.id, addressId);
    setDeleteConfirmId(null);
    showToast('Address removed successfully.');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Work':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'Other':
        return <Building className="w-3.5 h-3.5" />;
      case 'Home':
      default:
        return <Home className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3FCF3]/40 flex flex-col">
      <div className="border-b border-neutral-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-30">
        <Navbar darkText={true} />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Toast Alert */}
        {feedback && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-3 shadow-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
              <span>Saved Addresses</span>
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-[#E9F3ED] text-[#1B4332] border border-[#c4e3cf]">
                {addresses.length} / 5 Saved
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your residential, office, and farm addresses for quick checkout
            </p>
          </div>

          <button
            type="button"
            disabled={addresses.length >= 5}
            onClick={() => {
              setEditingAddress(null);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        {addresses.length >= 5 && (
          <div className="my-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>You have reached the maximum limit of 5 saved addresses. Delete an unused address to add a new one.</span>
          </div>
        )}

        {/* Addresses Grid */}
        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-8 shadow-sm max-w-md mx-auto">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">No Addresses Saved</h3>
            <p className="text-xs text-gray-500 mb-6">
              Add a delivery address to enable one-click checkout across GROVE marketplace.
            </p>
            <button
              type="button"
              onClick={() => {
                setEditingAddress(null);
                setModalOpen(true);
              }}
              className="px-5 py-2.5 bg-[#012D1D] text-white text-xs font-bold rounded-xl hover:bg-[#1B4332]"
            >
              Add First Address
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`bg-white rounded-2xl border transition-all p-6 flex flex-col justify-between shadow-sm relative ${
                  addr.isDefault
                    ? 'border-[#1B4332] ring-2 ring-[#1B4332]/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
                      {getTypeIcon(addr.type)}
                      <span>{addr.type || 'Home'}</span>
                    </span>

                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E9F3ED] text-[#1B4332] border border-[#c4e3cf]">
                        <Check className="w-3 h-3" /> Default Delivery
                      </span>
                    )}
                  </div>

                  {/* Recipient Details */}
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    {addr.name}
                  </h3>

                  <div className="text-xs text-gray-600 space-y-1 leading-relaxed">
                    <p>{addr.house}</p>
                    <p>{addr.street}</p>
                    {addr.landmark && (
                      <p className="text-gray-500">Landmark: {addr.landmark}</p>
                    )}
                    <p className="font-semibold text-gray-800 pt-1">
                      {addr.city}, {addr.state} – {addr.pincode}
                    </p>
                    <p className="pt-2 text-gray-500">
                      Mobile: <span className="font-medium text-gray-800">+91 {addr.mobile}</span>
                    </p>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddress(addr);
                        setModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(addr.id)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs font-bold text-[#1B4332] hover:underline"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />

      {/* Address Edit / Add Modal */}
      <AddressModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingAddress}
        customerId={customer?.id}
        onSaved={() => {
          loadAddresses();
          showToast(editingAddress ? 'Address updated successfully.' : 'New address added successfully.');
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Delete Address?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to remove this delivery address? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

