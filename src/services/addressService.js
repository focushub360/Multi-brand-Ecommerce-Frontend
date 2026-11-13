import { addressesApi } from './apiClient.js';

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi (NCR)',
  'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

const MAX_ADDRESSES = 5;

/**
 * Returns saved addresses for a specific customer ID from localStorage cache.
 */
export function getCustomerAddresses(customerId) {
  if (!customerId) return [];
  const key = `grove_addresses_${customerId}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Asynchronously synchronizes addresses from the backend API.
 */
export async function syncCustomerAddresses(customerId) {
  if (!customerId) return [];
  try {
    const res = await addressesApi.getAll();
    const serverList = res?.addresses || (Array.isArray(res) ? res : []);
    if (serverList.length > 0) {
      const normalized = serverList.map((a) => ({
        id: a._id || a.id,
        name: a.name,
        mobile: a.mobile,
        pincode: a.pincode,
        house: a.house,
        street: a.street,
        landmark: a.landmark || '',
        city: a.city,
        state: a.state,
        type: a.type || 'Home',
        isDefault: Boolean(a.isDefault)
      }));
      saveCustomerAddresses(customerId, normalized);
      return normalized;
    }
  } catch (err) {
    console.warn('API addresses fetch failed, using local cache:', err.message);
  }
  return getCustomerAddresses(customerId);
}

/**
 * Saves address list for a customer to localStorage.
 */
export function saveCustomerAddresses(customerId, addresses) {
  if (!customerId) return;
  const key = `grove_addresses_${customerId}`;
  try {
    localStorage.setItem(key, JSON.stringify(addresses));
    window.dispatchEvent(new Event('grove_addresses_updated'));
  } catch (err) {
    console.error('Failed to save addresses to localStorage', err);
  }
}

/**
 * Validates address fields.
 */
export function validateAddress(data) {
  const errors = {};

  const name = (data.name || '').trim();
  if (!name) {
    errors.name = 'Full name is required.';
  } else if (name.length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }

  const mobile = (data.mobile || '').trim();
  if (!mobile) {
    errors.mobile = '10-digit mobile number is required.';
  } else if (!/^[6-9]\d{9}$/.test(mobile)) {
    errors.mobile = 'Enter a valid 10-digit Indian mobile number (starting with 6-9).';
  }

  const pincode = (data.pincode || '').trim();
  if (!pincode) {
    errors.pincode = '6-digit PIN code is required.';
  } else if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    errors.pincode = 'Enter a valid 6-digit Indian PIN code.';
  }

  const house = (data.house || '').trim();
  if (!house) {
    errors.house = 'Flat / House No. / Building is required.';
  }

  const street = (data.street || '').trim();
  if (!street) {
    errors.street = 'Street / Area is required.';
  }

  const city = (data.city || '').trim();
  if (!city) {
    errors.city = 'City / District is required.';
  }

  const state = (data.state || '').trim();
  if (!state) {
    errors.state = 'Please select a state.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Adds a new address for a customer. Max 5 addresses.
 */
export function addCustomerAddress(customerId, addressData) {
  if (!customerId) throw new Error('Customer authentication required.');

  const existing = getCustomerAddresses(customerId);
  if (existing.length >= MAX_ADDRESSES) {
    throw new Error(`Maximum limit of ${MAX_ADDRESSES} saved addresses reached. Please delete an older address first.`);
  }

  const validation = validateAddress(addressData);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const isFirst = existing.length === 0;
  const isDefault = isFirst || Boolean(addressData.isDefault);

  const newAddress = {
    id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    name: addressData.name.trim(),
    mobile: addressData.mobile.trim(),
    pincode: addressData.pincode.trim(),
    house: addressData.house.trim(),
    street: addressData.street.trim(),
    landmark: (addressData.landmark || '').trim(),
    city: addressData.city.trim(),
    state: addressData.state.trim(),
    type: addressData.type || 'Home',
    isDefault
  };

  // If this address is set as default, remove default from others
  const updatedList = isDefault
    ? existing.map((a) => ({ ...a, isDefault: false }))
    : [...existing];

  updatedList.unshift(newAddress);
  saveCustomerAddresses(customerId, updatedList);

  // Sync to backend API
  addressesApi.create({
    name: newAddress.name,
    mobile: newAddress.mobile,
    pincode: newAddress.pincode,
    house: newAddress.house,
    street: newAddress.street,
    landmark: newAddress.landmark,
    city: newAddress.city,
    state: newAddress.state,
    type: newAddress.type,
    isDefault: newAddress.isDefault
  }).catch((err) => console.warn('Backend address create sync failed:', err.message));

  return { success: true, address: newAddress };
}

/**
 * Updates an existing address.
 */
export function updateCustomerAddress(customerId, addressId, updatedData) {
  if (!customerId) throw new Error('Customer authentication required.');

  const existing = getCustomerAddresses(customerId);
  const targetIndex = existing.findIndex((a) => a.id === addressId);
  if (targetIndex === -1) {
    throw new Error('Address not found.');
  }

  const validation = validateAddress(updatedData);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const isDefault = Boolean(updatedData.isDefault);

  let updatedList = existing.map((a) => {
    if (a.id === addressId) {
      return {
        ...a,
        name: updatedData.name.trim(),
        mobile: updatedData.mobile.trim(),
        pincode: updatedData.pincode.trim(),
        house: updatedData.house.trim(),
        street: updatedData.street.trim(),
        landmark: (updatedData.landmark || '').trim(),
        city: updatedData.city.trim(),
        state: updatedData.state.trim(),
        type: updatedData.type || 'Home',
        isDefault
      };
    }
    return isDefault ? { ...a, isDefault: false } : a;
  });

  saveCustomerAddresses(customerId, updatedList);

  if (addressId && addressId.match(/^[0-9a-fA-F]{24}$/)) {
    addressesApi.update(addressId, updatedData).catch((err) => console.warn('Address API update failed:', err.message));
  }

  return { success: true, address: updatedList.find((a) => a.id === addressId) };
}

/**
 * Deletes an address.
 */
export function deleteCustomerAddress(customerId, addressId) {
  if (!customerId) return;
  const existing = getCustomerAddresses(customerId);
  const remaining = existing.filter((a) => a.id !== addressId);

  // If the deleted address was default and other addresses remain, make the first one default
  if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
    remaining[0].isDefault = true;
  }

  saveCustomerAddresses(customerId, remaining);

  if (addressId && addressId.match(/^[0-9a-fA-F]{24}$/)) {
    addressesApi.delete(addressId).catch((err) => console.warn('Address API delete failed:', err.message));
  }
}

/**
 * Sets an address as the default delivery address.
 */
export function setDefaultAddress(customerId, addressId) {
  if (!customerId) return;
  const existing = getCustomerAddresses(customerId);
  const updated = existing.map((a) => ({
    ...a,
    isDefault: a.id === addressId
  }));
  saveCustomerAddresses(customerId, updated);

  if (addressId && addressId.match(/^[0-9a-fA-F]{24}$/)) {
    addressesApi.setDefault(addressId).catch((err) => console.warn('Address API setDefault failed:', err.message));
  }
}

/**
 * Returns default delivery address for a customer, or the first address available.
 */
export function getDefaultAddress(customerId) {
  const list = getCustomerAddresses(customerId);
  if (list.length === 0) return null;
  return list.find((a) => a.isDefault) || list[0];
}

