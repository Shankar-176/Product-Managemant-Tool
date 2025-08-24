import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Product } from '../types';
import { fakeStoreApi } from '../services/fakeStoreApi';

interface ProductModalProps {
  isOpen: boolean;
  productId: string | null;
  onClose: () => void;
  onAddToCart: (productId: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  productId,
  onClose,
  onAddToCart
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && productId) {
      setLoading(true);
      fakeStoreApi.getProduct(parseInt(productId))
        .then(setProduct)
        .finally(() => setLoading(false));
    }
  }, [isOpen, productId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : product ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain p-8"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full mb-2 capitalize">
                    {product.category}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {product.title}
                  </h1>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating.rate)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {product.rating.rate}/5
                    </span>
                    <span className="text-sm text-gray-500">
                      ({product.rating.count} reviews)
                    </span>
                  </div>

                  <div className="text-3xl font-bold text-green-600 mb-6">
                    ${product.price}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-700">In Stock</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    ⭐ Highly rated by {product.rating.count}+ customers
                  </p>
                  <p className="text-sm text-blue-700">
                    🚚 Free shipping on orders over $50
                  </p>
                  <p className="text-sm text-blue-700">
                    💰 30-day money-back guarantee
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onAddToCart(productId!);
                      onClose();
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Product not found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};