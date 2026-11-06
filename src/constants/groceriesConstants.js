export const GROCERY_PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-100', label: 'Under ₹100', min: 0, max: 100 },
  { id: '100-300', label: '₹100 to ₹300', min: 100, max: 300 },
  { id: '300-500', label: '₹300 to ₹500', min: 300, max: 500 },
  { id: 'above-500', label: 'Above ₹500', min: 500, max: Infinity },
];

export const GROCERY_CATEGORIES = [
  'All',
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Rice & Grains',
  'Snacks & Bakery',
  'Beverages',
  'Cooking Essentials',
];

export const GROCERY_BRANDS = [
  'All',
  'GROVE Fresh',
];

export const GROCERIES_CATEGORY_ITEMS = [
  {
    id: 'Fruits & Vegetables',
    title: 'Fruits & Vegetables',
    image: '/images/grocery-fruits.png',
    fallback: '/images/card-groceries.png',
  },
  {
    id: 'Dairy & Eggs',
    title: 'Dairy & Eggs',
    image: '/images/grocery-dairy.png',
    fallback: '/images/card-groceries.png',
  },
  {
    id: 'Rice & Grains',
    title: 'Rice & Grains',
    image: '/images/grocery-rice.png',
    fallback: '/images/card-groceries.png',
  },
  {
    id: 'Snacks & Bakery',
    title: 'Snacks & Bakery',
    image: '/images/grocery-snacks.png',
    fallback: '/images/card-groceries.png',
  },
  {
    id: 'Beverages',
    title: 'Beverages',
    image: '/images/grocery-beverages.png',
    fallback: '/images/card-groceries.png',
  },
  {
    id: 'Cooking Essentials',
    title: 'Cooking Essentials',
    image: '/images/grocery-oil.png',
    fallback: '/images/card-groceries.png',
  },
];