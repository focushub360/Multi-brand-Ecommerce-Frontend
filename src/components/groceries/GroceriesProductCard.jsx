import React from 'react';
import { Heart, Star, Plus, Minus, ShoppingCart, Eye } from 'lucide-react';

export default function GroceriesProductCard({
  product,
  quantity = 0,
  wished = false,
  onViewProduct,
  onToggleWishlist,
  onChangeQuantity,
  onAddToCart,
}) {
  return (
    <article className="group relative flex flex-col bg-white rounded-[20px] border border-[#E2EBDE] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Product Image & Badges */}
      <div className="relative w-full aspect-square bg-[#F3FCEF] overflow-hidden cursor-pointer" onClick={() => onViewProduct(product.id)}>
        <img
          src={product.image || product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.discount && (
          <span className="absolute top-3 left-3 bg-[#BA1A1A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product.discount}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
            wished ? 'bg-[#FFDAD6] text-[#BA1A1A]' : 'bg-white/90 text-[#40493D] hover:text-[#BA1A1A]'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wished ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-[#707A6C] mb-1">
            <span>{product.unit || '1 kg'}</span>
            <div className="flex items-center gap-1 text-[#794B00] font-semibold">
              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>{product.rating || '4.8'}</span>
            </div>
          </div>
          <h3
            onClick={() => onViewProduct(product.id)}
            className="font-semibold text-sm text-[#161D16] line-clamp-2 hover:text-[#0D631B] cursor-pointer transition-colors"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Cart Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F0F5ED]">
          <div>
            <span className="text-base font-bold text-[#161D16]">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-[#707A6C] line-through ml-1.5">₹{product.originalPrice}</span>
            )}
          </div>

          {quantity === 0 ? (
            <button
              onClick={() => onAddToCart(product)}
              className="bg-[#2E7D32] hover:bg-[#0D631B] text-white p-2.5 rounded-xl transition-colors flex items-center justify-center shadow-sm"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center bg-[#F3FCEF] border border-[#A3F69C] rounded-xl overflow-hidden">
              <button
                onClick={() => onChangeQuantity(product.id, quantity - 1)}
                className="p-1.5 hover:bg-[#BE-EAD1] text-[#0D631B] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 text-xs font-bold text-[#161D16]">{quantity}</span>
              <button
                onClick={() => onChangeQuantity(product.id, quantity + 1)}
                className="p-1.5 hover:bg-[#BE-EAD1] text-[#0D631B] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}