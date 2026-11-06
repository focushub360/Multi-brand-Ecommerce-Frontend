
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Check,
  Leaf,
  Truck,
  ShieldCheck,
  MapPin,
  Package,
  BadgeCheck,
  Zap,
} from 'lucide-react';

const groceries = [
  {
    id: 'gr-01',
    name: 'Fresh Red Apples',
    category: 'Fruits & Vegetables',
    price: 180,
    originalPrice: 220,
    unit: '1 kg',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=1000',
    description: 'Fresh and crunchy red apples, carefully selected for quality and taste.',
    highlights: ['Freshly selected quality apples', 'Naturally sweet and crunchy', 'Perfect for daily consumption'],
  },
  {
    id: 'gr-02',
    name: 'Fresh Bananas',
    category: 'Fruits & Vegetables',
    price: 60,
    originalPrice: 75,
    unit: '1 dozen',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=1000',
    description: 'Naturally sweet bananas, perfect for everyday eating.',
    highlights: ['Naturally sweet taste', 'Carefully selected', 'Suitable for everyday use'],
  },
  {
    id: 'gr-03',
    name: 'Fresh Tomatoes',
    category: 'Fruits & Vegetables',
    price: 40,
    originalPrice: 50,
    unit: '1 kg',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=1000',
    description: 'Fresh tomatoes suitable for salads and everyday cooking.',
    highlights: ['Freshly selected tomatoes', 'Suitable for cooking and salads', 'Quality checked'],
  },
  {
    id: 'gr-04',
    name: 'Farm Fresh Milk',
    category: 'Dairy & Eggs',
    price: 32,
    originalPrice: 36,
    unit: '500 ml',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=1000',
    description: 'Fresh milk for your daily breakfast and cooking needs.',
    highlights: ['Fresh dairy product', 'Suitable for daily use', 'Quality checked'],
  },
  {
    id: 'gr-05',
    name: 'Fresh Brown Eggs',
    category: 'Dairy & Eggs',
    price: 90,
    originalPrice: 100,
    unit: '6 pieces',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=1000',
    description: 'Farm fresh eggs for your everyday meals.',
    highlights: ['Carefully selected eggs', 'Suitable for everyday meals', 'Quality checked'],
  },
  {
    id: 'gr-06',
    name: 'Organic Rice',
    category: 'Rice & Grains',
    price: 95,
    originalPrice: 110,
    unit: '1 kg',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1000',
    description: 'Quality rice selected for your everyday meals.',
    highlights: ['Quality selected rice', 'Suitable for everyday cooking', 'Convenient packaging'],
  },
  {
    id: 'gr-07',
    name: 'Whole Wheat Flour',
    category: 'Rice & Grains',
    price: 55,
    originalPrice: 65,
    unit: '1 kg',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=1000',
    description: 'Whole wheat flour for making fresh rotis and other recipes.',
    highlights: ['Suitable for daily cooking', 'Quality selected flour', 'Convenient packaging'],
  },
  {
    id: 'gr-08',
    name: 'Mixed Cookies',
    category: 'Snacks & Bakery',
    price: 75,
    originalPrice: 90,
    unit: '250 g',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1000',
    description: 'A tasty selection of cookies for snack time.',
    highlights: ['Tasty snack option', 'Convenient pack size', 'Perfect for tea time'],
  },
  {
    id: 'gr-09',
    name: 'Fresh Orange Juice',
    category: 'Beverages',
    price: 85,
    originalPrice: 100,
    unit: '1 litre',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=1000',
    description: 'Refreshing orange juice for a delicious drink.',
    highlights: ['Refreshing beverage', 'Ready to serve', 'Convenient packaging'],
  },
  {
    id: 'gr-10',
    name: 'Premium Coffee',
    category: 'Beverages',
    price: 140,
    originalPrice: 160,
    unit: '200 g',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1000',
    description: 'Rich coffee for your daily cup.',
    highlights: ['Rich coffee flavour', 'Suitable for daily use', 'Convenient packaging'],
  },
  {
    id: 'gr-11',
    name: 'Sunflower Cooking Oil',
    category: 'Cooking Essentials',
    price: 145,
    originalPrice: 165,
    unit: '1 litre',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1000',
    description: 'Everyday cooking oil for your kitchen.',
    highlights: ['Everyday cooking essential', 'Convenient bottle packaging', 'Suitable for daily cooking'],
  },
  {
    id: 'gr-12',
    name: 'Fresh Carrots',
    category: 'Fruits & Vegetables',
    price: 50,
    originalPrice: 60,
    unit: '500 g',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=1000',
    description: 'Fresh carrots, great for salads and cooking.',
    highlights: ['Freshly selected carrots', 'Suitable for salads and cooking', 'Quality checked'],
  },
];

export default function GroceriesProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  const { addToCart, totalCartCount } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const product = groceries.find((item) => item.id === productId);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (product) {
      setSelectedImage(product.image);
    }

    document.title = product
      ? `${product.name} | GROVE Groceries`
      : 'Product Not Found | GROVE';
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8FAF5] flex flex-col">
        <Navbar darkText={true} />

        <main className="flex-1 max-w-3xl mx-auto text-center px-5 py-20">
          <h1 className="text-3xl font-bold">Product Not Found</h1>
          <p className="text-neutral-500 mt-3">
            This grocery product is not available.
          </p>

          <Link
            to="/groceries"
            className="inline-flex mt-6 bg-[#173D2B] text-white px-6 py-3 rounded-xl"
          >
            Back to Groceries
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      stockStatus: 'In Stock',
      inStock: true,
      brand: 'GROVE Fresh',
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="min-h-screen bg-[#F8FAF5] text-neutral-900">

      {/* Navbar */}
      <div className="sticky top-0 z-30 bg-white border-b border-neutral-200">
        <Navbar darkText={true} />
      </div>

      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Back Navigation */}
        <button
          onClick={() => navigate('/groceries')}
          className="flex items-center gap-2 text-sm font-semibold text-[#1B4332] hover:text-green-700 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Groceries
        </button>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_0.72fr] gap-5 lg:gap-6 items-start">

          {/* LEFT: Product Images */}
          <section>
            <div className="bg-white border border-neutral-200 rounded-2xl p-3 sm:p-5">
              <div className="relative bg-[#F8FAF5] rounded-xl h-[320px] sm:h-[420px] flex items-center justify-center overflow-hidden">

                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = product.image;
                  }}
                  className="w-full h-full object-contain p-5 sm:p-8"
                />

                <span className="absolute top-4 left-4 bg-[#1B4332] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Fresh Selection
                </span>
              </div>

              {/* Image Thumbnail */}
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedImage(product.image)}
                  className="w-[76px] h-[70px] rounded-xl border-2 border-[#1B4332] bg-[#F8FAF5] p-2"
                  aria-label="View product image"
                >
                  <img
                    src={product.image}
                    alt={`${product.name} thumbnail`}
                    className="w-full h-full object-contain"
                  />
                </button>
              </div>
            </div>

            {/* Quality Information */}
            <div className="mt-4 bg-[#EAF5EE] border border-[#B7DCC5] rounded-xl p-4 flex gap-3 items-center">
              <ShieldCheck size={22} className="text-[#218653] shrink-0" />
              <p className="text-xs sm:text-sm text-[#174C32] font-medium">
                Quality checked grocery product with careful selection and secure packaging.
              </p>
            </div>
          </section>

          {/* MIDDLE: Product Information */}
          <section className="bg-white lg:bg-transparent rounded-2xl lg:rounded-none p-4 sm:p-5 lg:p-0">

            <p className="text-xs uppercase tracking-wider text-[#2D6A4F] font-bold">
              {product.category}
            </p>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#081C15] mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <div className="flex items-center gap-1 bg-[#FFF7E6] border border-[#F5DCA2] rounded-lg px-3 py-1">
                <Star size={15} fill="currentColor" className="text-amber-500" />
                <span className="text-sm font-bold">{product.rating}</span>
              </div>

              <span className="text-xs text-neutral-600">
                Customer rating
              </span>

              <span className="text-neutral-300">•</span>

              <span className="text-xs text-[#218653] font-semibold">
                Quality Selected
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-600 leading-7 mt-5">
              {product.description}
            </p>

            {/* Product Highlights */}
            <div className="mt-6">
              <h2 className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center gap-2">
                <Check size={16} className="text-[#218653]" />
                Key Highlights
              </h2>

              <ul className="mt-3 space-y-3">
                {product.highlights.map((item, index) => (
                  <li
                    key={index}
                    className="flex gap-2 text-sm text-neutral-600 leading-6"
                  >
                    <span className="text-[#218653] font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Product Information Card */}
            <div className="mt-7 bg-white border border-neutral-200 rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-xs font-bold text-neutral-700 uppercase">
                  Product Information
                </h2>

                <span className="text-[10px] font-bold text-[#1B4332] border border-[#B7DCC5] rounded-md px-2 py-1">
                  GROVE FRESH
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#F8FAF5] rounded-lg p-3">
                  <p className="text-[10px] text-neutral-500 uppercase">
                    Category
                  </p>
                  <p className="text-xs font-bold mt-1">
                    {product.category}
                  </p>
                </div>

                <div className="bg-[#F8FAF5] rounded-lg p-3">
                  <p className="text-[10px] text-neutral-500 uppercase">
                    Pack Size
                  </p>
                  <p className="text-xs font-bold mt-1">
                    {product.unit}
                  </p>
                </div>

                <div className="bg-[#F8FAF5] rounded-lg p-3">
                  <p className="text-[10px] text-neutral-500 uppercase">
                    Brand
                  </p>
                  <p className="text-xs font-bold mt-1">GROVE Fresh</p>
                </div>

                <div className="bg-[#F8FAF5] rounded-lg p-3">
                  <p className="text-[10px] text-neutral-500 uppercase">
                    Availability
                  </p>
                  <p className="text-xs font-bold text-green-700 mt-1">
                    In Stock
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <Leaf size={19} className="text-green-700 shrink-0" />
                Fresh Selection
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <Truck size={19} className="text-green-700 shrink-0" />
                Delivery Available
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <ShieldCheck size={19} className="text-green-700 shrink-0" />
                Quality Checked
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <Package size={19} className="text-green-700 shrink-0" />
                Secure Packaging
              </div>
            </div>
          </section>

          {/* RIGHT: Purchase Card */}
          <aside className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 lg:sticky lg:top-24">

            {/* Price */}
            <div className="border-b border-neutral-200 pb-4">
              <p className="text-xs text-neutral-500 font-semibold">
                Product Price
              </p>

              <div className="flex items-baseline flex-wrap gap-2 mt-2">
                <span className="text-3xl font-extrabold text-[#081C15]">
                  ₹{product.price}
                </span>

                <span className="text-sm text-neutral-400 line-through">
                  ₹{product.originalPrice}
                </span>

                <span className="text-[10px] bg-[#1B4332] text-white font-bold px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              </div>

              <p className="text-xs text-neutral-500 mt-2">
                Price per {product.unit}
              </p>

              <p className="text-xs text-[#218653] font-semibold mt-2 flex items-center gap-1">
                <Check size={14} />
                You Save ₹{product.originalPrice - product.price}
              </p>
            </div>

            {/* Stock */}
            <div className="py-4 border-b border-neutral-200">
              <p className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                <span className="w-2 h-2 rounded-full bg-green-600" />
                In Stock — Ready for Delivery
              </p>
            </div>

            {/* Delivery */}
            <div className="bg-[#F8FAF5] border border-neutral-200 rounded-xl p-3 mt-1">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <MapPin size={16} className="text-[#1B4332]" />
                Delivery Information
              </div>

              <p className="text-xs text-neutral-500 mt-2 leading-5">
                Delivery availability depends on your location.
              </p>
            </div>

            {/* Quantity */}
            <div className="mt-5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-neutral-700">
                  Quantity
                </span>

                <div className="flex items-center border border-neutral-200 rounded-xl h-10">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => Math.max(1, value - 1))
                    }
                    disabled={quantity <= 1}
                    className="w-10 h-full flex items-center justify-center text-neutral-600 hover:text-[#1B4332] disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="min-w-8 text-center text-sm font-bold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((value) => value + 1)}
                    className="w-10 h-full flex items-center justify-center text-neutral-600 hover:text-[#1B4332]"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full mt-5 h-12 bg-[#173D2B] hover:bg-[#24583E] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <ShoppingCart size={17} />
              Add to Cart
            </button>

            {/* Buy Now */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full mt-2 h-11 bg-[#52B788] hover:bg-[#409D76] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Zap size={16} fill="currentColor" />
              Buy Now
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`w-full mt-2 h-11 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                wishlisted
                  ? 'border-red-200 bg-red-50 text-red-600'
                  : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Heart
                size={17}
                fill={wishlisted ? 'currentColor' : 'none'}
              />
              {wishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Cart Link */}
            {totalCartCount > 0 && (
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="w-full mt-4 text-sm text-[#1B4332] font-bold hover:underline"
              >
                View Cart ({totalCartCount} items)
              </button>
            )}

            {/* Trust Information */}
            <div className="border-t border-neutral-200 mt-5 pt-4 space-y-3">
              <div className="flex gap-2 items-center text-xs text-neutral-600">
                <BadgeCheck size={17} className="text-green-700" />
                Quality checked products
              </div>

              <div className="flex gap-2 items-center text-xs text-neutral-600">
                <Truck size={17} className="text-green-700" />
                Delivery availability by location
              </div>

              <div className="flex gap-2 items-center text-xs text-neutral-600">
                <ShieldCheck size={17} className="text-green-700" />
                Secure shopping experience
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
