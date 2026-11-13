/**
 * Distance Calculation Utilities using the Haversine Formula
 * and verified Indian postal code geographic mappings.
 */

// Earth radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates great-circle distance between two geographic coordinates in kilometers
 * using the standard Haversine formula.
 *
 * @param {number} lat1 Latitude of point 1
 * @param {number} lon1 Longitude of point 1
 * @param {number} lat2 Latitude of point 2
 * @param {number} lon2 Longitude of point 2
 * @returns {number|null} Distance in kilometers rounded to 1 decimal place, or null if coordinates invalid
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (
    lat1 === undefined || lon1 === undefined ||
    lat2 === undefined || lon2 === undefined ||
    lat1 === null || lon1 === null ||
    lat2 === null || lon2 === null ||
    isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)
  ) {
    return null;
  }

  const toRad = (angle) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceKm = EARTH_RADIUS_KM * c;
  return Math.round(distanceKm * 10) / 10;
}

/**
 * Verified Indian Pincode Geographic Coordinates Registry.
 * Contains genuine, authoritative geographic coordinates for major agricultural
 * and trade regions across Indian states.
 */
export const VERIFIED_PINCODES = {
  // Maharashtra
  '411001': { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  '411002': { city: 'Pune', state: 'Maharashtra', lat: 18.5138, lng: 73.8553 },
  '400001': { city: 'Mumbai', state: 'Maharashtra', lat: 18.9322, lng: 72.8335 },
  '440001': { city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  '422001': { city: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  '416001': { city: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lng: 74.2433 },
  '431001': { city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', lat: 19.8762, lng: 75.3433 },
  '444601': { city: 'Amravati', state: 'Maharashtra', lat: 20.9320, lng: 77.7523 },
  '413001': { city: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064 },
  '414001': { city: 'Ahmednagar', state: 'Maharashtra', lat: 19.0952, lng: 74.7496 },

  // Madhya Pradesh
  '452001': { city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  '462001': { city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  '482001': { city: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864 },
  '474001': { city: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828 },
  '456001': { city: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885 },
  '457001': { city: 'Ratlam', state: 'Madhya Pradesh', lat: 23.3315, lng: 75.0367 },

  // Haryana & Punjab
  '132001': { city: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905 },
  '141001': { city: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
  '143001': { city: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
  '151001': { city: 'Bathinda', state: 'Punjab', lat: 30.2110, lng: 74.9455 },
  '134112': { city: 'Panchkula / Chandigarh', state: 'Haryana', lat: 30.6942, lng: 76.8606 },
  '125001': { city: 'Hisar', state: 'Haryana', lat: 29.1492, lng: 75.7217 },
  '133001': { city: 'Ambala', state: 'Haryana', lat: 30.3782, lng: 76.7767 },
  '144001': { city: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762 },
  '147001': { city: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869 },

  // Gujarat
  '380001': { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  '395001': { city: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  '390001': { city: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
  '360001': { city: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
  '388001': { city: 'Anand', state: 'Gujarat', lat: 22.5645, lng: 72.9289 },
  '364001': { city: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519 },
  '382010': { city: 'Gandhinagar', state: 'Gujarat', lat: 23.2156, lng: 72.6369 },

  // Rajasthan
  '302001': { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  '342001': { city: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
  '324001': { city: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648 },
  '313001': { city: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125 },
  '301001': { city: 'Alwar', state: 'Rajasthan', lat: 27.5530, lng: 76.6346 },
  '335001': { city: 'Sri Ganganagar', state: 'Rajasthan', lat: 29.9038, lng: 73.8772 },
  '303303': { city: 'Dausa', state: 'Rajasthan', lat: 26.8924, lng: 76.3375 },
  '334001': { city: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119 },

  // Uttar Pradesh
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  '250001': { city: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064 },
  '208001': { city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
  '282001': { city: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  '221001': { city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  '243001': { city: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304 },
  '284001': { city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4484, lng: 78.5685 },

  // Telangana & Andhra Pradesh
  '500001': { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  '506001': { city: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941 },
  '522001': { city: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
  '520001': { city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
  '530001': { city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  '517501': { city: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192 },
  '515001': { city: 'Anantapur', state: 'Andhra Pradesh', lat: 14.6819, lng: 77.6006 },

  // Karnataka
  '560001': { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  '570001': { city: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  '563101': { city: 'Kolar', state: 'Karnataka', lat: 13.1367, lng: 78.1292 },
  '580001': { city: 'Hubballi', state: 'Karnataka', lat: 15.3647, lng: 75.1240 },
  '583101': { city: 'Ballari', state: 'Karnataka', lat: 15.1394, lng: 76.9214 },

  // Tamil Nadu & Kerala
  '600001': { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  '641001': { city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  '636001': { city: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460 },
  '625001': { city: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  '678001': { city: 'Palakkad', state: 'Kerala', lat: 10.7867, lng: 76.6548 },
  '682001': { city: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },

  // National Capital & Eastern States
  '110001': { city: 'New Delhi', state: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
  '800001': { city: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  '700001': { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  '731204': { city: 'Bolpur / Santiniketan', state: 'West Bengal', lat: 23.6693, lng: 87.6883 },
  '751001': { city: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245 }
};

/**
 * Looks up verified geographic coordinates and location details for a given Indian pincode.
 *
 * @param {string} pincode 6-digit Indian PIN code
 * @returns {object|null} Location object { pincode, city, state, lat, lng } or null if unmapped
 */
export function getPincodeLocation(pincode) {
  if (!pincode) return null;
  const cleanPin = String(pincode).trim();
  if (!/^\d{6}$/.test(cleanPin)) return null;

  const match = VERIFIED_PINCODES[cleanPin];
  if (!match) return null;

  return {
    pincode: cleanPin,
    city: match.city,
    state: match.state,
    coordinates: {
      lat: match.lat,
      lng: match.lng
    }
  };
}

/**
 * Formats distance in kilometers into a clean display string
 * e.g. "12.5 km" or "Dealer is 12.5 km away"
 *
 * @param {number} km 
 * @returns {string}
 */
export function formatDistance(km) {
  if (km === null || km === undefined || isNaN(km)) return '';
  if (km < 1) {
    return 'under 1 km';
  }
  return `${km.toFixed(1)} km`;
}

