import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    short_description: string;
    price: number;
    image: string;
    reason: string;
  };
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 overflow-hidden group border border-slate-200/60 hover:border-slate-300/60">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-52 object-contain bg-gradient-to-br from-slate-50 to-slate-100 group-hover:scale-105 transition-transform duration-300 p-6"
        />
        <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
          ${product.price}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors text-lg">
          {product.title}
        </h3>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.short_description}
        </p>
        
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm p-3 rounded-xl mb-4 border-l-4 border-indigo-400 font-medium">
          {product.reason}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => onViewDetails(product.id)}
            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 text-sm font-semibold"
          >
            View Details
          </button>
          <button
            onClick={() => onAddToCart(product.id)}
            className="flex items-center justify-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-semibold shadow-lg shadow-indigo-500/25"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};