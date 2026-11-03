import React, { useState, useEffect } from 'react';
import { X, MapPin, Building, Home, Briefcase, Check } from 'lucide-react';
import { INDIAN_STATES, addCustomerAddress, updateCustomerAddress, validateAddress } from '../../services/addressService';

export default function AddressModal({ isOpen, onClose, onSaved, initialData = null, customerId }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pincode: '',
    house: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    type: 'Home',
    isDefault: false
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const isEditMode = Boolean(initialData && initialData.id);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          mobile: initialData.mobile || '',
          pincode: initialData.pincode || '',
          house: initialData.house || '',
          street: initialData.street || '',
          landmark: initialData.landmark || '',
          city: initialData.city || '',
          state: initialData.state || '',
          type: initialData.type || 'Home',
          isDefault: Boolean(initialData.isDefault)
        });
      } else {
        setFormData({
          name: '',
          mobile: '',
          pincode: '',
          house: '',
          street: '',
          landmark: '',
          city: '',
          state: 'Maharashtra',
          type: 'Home',
          isDefault: false
        });
      }
      setErrors({});
      setGeneralError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: val }));
    if (errors.pincode) {
      setErrors((prev) => {
        const u = { ...prev };
        delete u.pincode;
        return u;
      });
    }
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, mobile: val }));
    if (errors.mobile) {
      setErrors((prev) => {
        const u = { ...prev };
        delete u.mobile;
        return u;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError('');

    const validation = validateAddress(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (isEditMode) {
        res = updateCustomerAddress(customerId, initialData.id, formData);
      } else {
        res = addCustomerAddress(customerId, formData);
      }

      if (res.success) {
        if (onSaved) onSaved(res.address);
        onClose();
      } else if (res.errors) {
        setErrors(res.errors);
      }
    } catch (err) {
      setGeneralError(err.message || 'Failed to save address.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#012D1D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-green-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 id="address-modal-title" className="text-base font-bold text-white leading-tight">
                {isEditMode ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <p className="text-xs text-green-200">
                Ensure accurate postal details for swift doorstep delivery
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {generalError && (
            <div className="p-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg">
              {generalError}
            </div>
          )}

          {/* Row 1: Name and Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Harish Patel"
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                  errors.name ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                10-Digit Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-gray-500 font-medium">+91</span>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleMobileChange}
                  placeholder="9876543210"
                  maxLength={10}
                  className={`w-full pl-12 pr-3.5 py-2.5 text-sm rounded-lg border ${
                    errors.mobile ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
                />
              </div>
              {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
            </div>
          </div>

          {/* Row 2: PIN Code, City, State */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                6-Digit PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handlePincodeChange}
                placeholder="411001"
                maxLength={6}
                className={`w-full px-3 py-2.5 text-sm rounded-lg border ${
                  errors.pincode ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
              />
              {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                City / District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Pune"
                className={`w-full px-3 py-2.5 text-sm rounded-lg border ${
                  errors.city ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
              />
              {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white ${
                  errors.state ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
            </div>
          </div>

          {/* Row 3: House / Building */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Flat / House No. / Building / Apartment <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="house"
              value={formData.house}
              onChange={handleChange}
              placeholder="e.g. Flat 402, Green Fields Enclave"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                errors.house ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
            />
            {errors.house && <p className="text-xs text-red-600 mt-1">{errors.house}</p>}
          </div>

          {/* Row 4: Street / Area */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Street / Area / Sector / Village <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="e.g. Kisan Mandi Marg, Shivajinagar"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                errors.street ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#1B4332]`}
            />
            {errors.street && <p className="text-xs text-red-600 mt-1">{errors.street}</p>}
          </div>

          {/* Row 5: Landmark (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Landmark <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="e.g. Near Central Agricultural Depot"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          {/* Row 6: Address Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Address Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'Home', icon: Home, desc: 'All Day (7 AM – 9 PM)' },
                { type: 'Work', icon: Briefcase, desc: 'Office (10 AM – 6 PM)' },
                { type: 'Other', icon: Building, desc: 'Farm / Depot / Warehouse' }
              ].map((item) => {
                const isSelected = formData.type === item.type;
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: item.type }))}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'border-[#1B4332] bg-[#E9F3ED] text-[#012D1D] ring-2 ring-[#1B4332]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-xs">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.type}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#1B4332]" />}
                    </div>
                    <span className="text-[11px] text-gray-500 leading-tight">
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 7: Set Default Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="w-4 h-4 text-[#1B4332] border-gray-300 rounded focus:ring-[#1B4332]"
              />
              <span className="text-sm text-gray-700 font-medium">
                Make this my default delivery address
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg bg-[#012D1D] hover:bg-[#1B4332] text-white text-sm font-semibold shadow-md transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving Address...' : isEditMode ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

