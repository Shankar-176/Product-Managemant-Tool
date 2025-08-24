import React from 'react';
import { X, Minus, Plus, ShoppingBag, CreditCard } from 'lucide-react';
import { CartItem } from '../types';

interface ShoppingCartProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Shopping Cart</h2>
            <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-lg font-semibold text-slate-700 mb-2">Your cart is empty</p>
              <p className="text-sm">Start shopping to add items!</p>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-18 h-18 object-contain bg-slate-50 rounded-xl"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-base font-bold text-emerald-600">
                      ${item.price}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="w-8 h-8 rounded-xl border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-base font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-xl border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-200 p-6 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-slate-900 text-lg">Total:</span>
              <span className="font-bold text-2xl text-emerald-600">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/25"
            >
              <CreditCard className="w-6 h-6" />
              Proceed to Checkout
            </button>
            <p className="text-sm text-slate-500 text-center mt-3 font-medium">
              Secure checkout simulation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};