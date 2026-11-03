export const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-2500', label: 'Under ₹2,500', min: 0, max: 2500 },
  { id: '2500-5000', label: '₹2,500 to ₹5,000', min: 2500, max: 5000 },
  { id: '5000-10000', label: '₹5,000 to ₹10,000', min: 5000, max: 10000 },
  { id: 'above-10000', label: 'Above ₹10,000', min: 10000, max: Infinity },
];

export const CATEGORIES = [
  'All',
  'Tires & Wheels',
  'Braking Systems',
  'Suspension & Steering',
  'Electrical & Battery',
  'Engine & Drivetrain',
  'Spares & Accessories',
];

export const BRANDS = [
  'All',
  'MRF',
  'Bosch',
  'Gabriel',
  'Apollo',
  'Brembo',
  'Duramax',
];

export const AUTOMOTIVE_CATEGORY_ITEMS = [
  {
    id: 'Tires & Wheels',
    title: 'Tires & Wheels',
    image: '/images/prod-tyre.png',
    fallback: '/images/card-automotive.png',
  },
  {
    id: 'Braking Systems',
    title: 'Braking Systems',
    image: '/images/prod-brakepads.png',
    fallback: '/images/card-automotive-clean.png',
  },
  {
    id: 'Suspension & Steering',
    title: 'Suspension & Steering',
    image: '/images/prod-shockabsorber.png',
    fallback: '/images/card-automotive.png',
  },
  {
    id: 'Electrical & Battery',
    title: 'Electrical & Battery',
    image: '/images/prod-oilfilter-raw.png',
    fallback: '/images/card-automotive-clean.png',
  },
  {
    id: 'Engine & Drivetrain',
    title: 'Engine & Drivetrain',
    image: '/images/prod-cultivator.png',
    fallback: '/images/card-automotive.png',
  },
  {
    id: 'Spares & Accessories',
    title: 'Spares & Accessories',
    image: '/images/card-automotive-clean.png',
    fallback: '/images/card-automotive.png',
  },
];

