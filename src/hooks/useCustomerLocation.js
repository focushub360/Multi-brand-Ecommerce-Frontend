import { useState, useEffect } from 'react';
import { getPincodeLocation } from '../utils/distance';

const LOCATION_STORAGE_KEY = 'grove_customer_location';

export function useCustomerLocation() {
  const [customerLocation, setCustomerLocation] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (customerLocation) {
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(customerLocation));
      } else {
        localStorage.removeItem(LOCATION_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to save customer location to localStorage', err);
    }
  }, [customerLocation]);

  /**
   * Sets customer location by a 6-digit Indian postal code.
   * If the postal code exists in the verified database, coordinates are attached.
   * If not, the pincode is recorded without fabricating coordinates.
   */
  const setLocationFromPincode = (rawPincode) => {
    const cleanPin = String(rawPincode || '').trim().replace(/\D/g, '');
    if (!/^\d{6}$/.test(cleanPin)) {
      return { success: false, error: 'Please enter a valid 6-digit Indian PIN code.' };
    }

    const verified = getPincodeLocation(cleanPin);

    if (verified) {
      const locData = {
        pincode: cleanPin,
        city: verified.city,
        state: verified.state,
        coordinates: verified.coordinates,
        hasCoordinates: true,
        type: 'pincode',
        displayLabel: `${cleanPin} (${verified.city}, ${verified.state})`
      };
      setCustomerLocation(locData);
      return { success: true, location: locData, hasCoordinates: true };
    }

    // Pincode is valid format (6 digits), but coordinates are not in mapping table
    const unmappedData = {
      pincode: cleanPin,
      city: null,
      state: null,
      coordinates: null,
      hasCoordinates: false,
      type: 'pincode',
      displayLabel: `PIN ${cleanPin}`
    };
    setCustomerLocation(unmappedData);
    return { success: true, location: unmappedData, hasCoordinates: false };
  };

  /**
   * Sets customer location from browser GPS coordinates (if user allows)
   */
  const setLocationFromCoordinates = (lat, lng, label = 'Your Current GPS Location') => {
    if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
      return { success: false, error: 'Invalid geographic coordinates.' };
    }

    const locData = {
      pincode: null,
      city: null,
      state: null,
      coordinates: { lat: Number(lat), lng: Number(lng) },
      hasCoordinates: true,
      type: 'geolocation',
      displayLabel: label
    };
    setCustomerLocation(locData);
    return { success: true, location: locData, hasCoordinates: true };
  };

  /**
   * Clears the current customer location
   */
  const clearCustomerLocation = () => {
    setCustomerLocation(null);
  };

  return {
    customerLocation,
    setLocationFromPincode,
    setLocationFromCoordinates,
    clearCustomerLocation
  };
}

