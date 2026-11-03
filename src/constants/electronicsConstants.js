export const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-3000', label: 'Under ₹3,000', min: 0, max: 3000 },
  { id: '3000-10000', label: '₹3,000 to ₹10,000', min: 3000, max: 10000 },
  { id: '10000-50000', label: '₹10,000 to ₹50,000', min: 10000, max: 50000 },
  { id: 'above-50000', label: 'Above ₹50,000', min: 50000, max: Infinity },
];

export const CATEGORIES = [
  'All',
  'Audio & Headphones',
  'Laptops & Computers',
  'Wearables & Smartwatches',
  'Keyboards & Accessories',
  'Smart Sensors & IoT',
  'Drones & Robotics',
];

export const BRANDS = [
  'All',
  'Noise',
  'Lenovo',
  'GROVE Tech',
  'Keychron',
  'Audio-Technica',
  'AgroSense',
  'AeroKisan',
];

export const ELECTRONICS_CATEGORY_ITEMS = [
  {
    id: 'Audio & Headphones',
    title: 'Audio & Headphones',
    image: '/images/prod-headphones.png',
    fallback: '/images/card-electronics.png',
  },
  {
    id: 'Laptops & Computers',
    title: 'Laptops & Computers',
    image: '/images/prod-laptop.png',
    fallback: '/images/card-electronics-clean.png',
  },
  {
    id: 'Wearables & Smartwatches',
    title: 'Wearables & Smartwatches',
    image: '/images/prod-smartwatch.png',
    fallback: '/images/card-electronics.png',
  },
  {
    id: 'Keyboards & Accessories',
    title: 'Keyboards & Accessories',
    image: '/images/prod-keyboard.png',
    fallback: '/images/card-electronics-clean.png',
  },
  {
    id: 'Smart Sensors & IoT',
    title: 'Smart Sensors & IoT',
    image: '/images/card-electronics.png',
    fallback: '/images/prod-smartwatch.png',
  },
  {
    id: 'Drones & Robotics',
    title: 'Drones & Robotics',
    image: '/images/card-electronics-clean.png',
    fallback: '/images/card-electronics.png',
  },
];

