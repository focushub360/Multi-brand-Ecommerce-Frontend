
export const GROCERIES_CATEGORY_ITEMS = [
  {
    id: 'fruits',
    label: 'Fruits',
    title: 'Fresh Fruits',
    icon: 'nutrition',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600',
  },
  {
    id: 'vegetables',
    label: 'Vegetables',
    title: 'Fresh Vegetables',
    icon: 'spa',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
  },
  {
    id: 'dairy',
    label: 'Dairy & Eggs',
    title: 'Dairy & Eggs',
    icon: 'egg',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600',
  },
  {
    id: 'rice-grains',
    label: 'Rice & Grains',
    title: 'Rice & Grains',
    icon: 'grain',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600',
  },
  {
    id: 'pulses',
    label: 'Pulses & Lentils',
    title: 'Pulses & Lentils',
    icon: 'grass',
    image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=600',
  },
  {
    id: 'oil-masala',
    label: 'Oil & Masala',
    title: 'Oil & Masala',
    icon: 'oil_barrel',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600',
  },
  {
    id: 'snacks',
    label: 'Snacks & Beverages',
    title: 'Snacks & Beverages',
    icon: 'cookie',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600',
  },
  {
    id: 'bakery',
    label: 'Bakery',
    title: 'Bakery Products',
    icon: 'bakery_dining',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
  },
  {
    id: 'household',
    label: 'Household Essentials',
    title: 'Household Essentials',
    icon: 'cleaning_services',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600',
  },
  {
    id: 'organic',
    label: 'Organic Products',
    title: 'Organic Products',
    icon: 'eco',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
  },
];

export const GROCERY_PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-100', label: 'Under ₹100', min: 0, max: 100 },
  { id: '100-300', label: '₹100 to ₹300', min: 100, max: 300 },
  { id: '300-500', label: '₹300 to ₹500', min: 300, max: 500 },
  { id: 'above-500', label: 'Above ₹500', min: 500, max: Infinity },
];
