import React from 'react';
import { Bot, User, Mic } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';
import { ProductCard } from './ProductCard';

interface ChatMessageProps {
  message: ChatMessageType;
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onAddToCart,
  onViewDetails
}) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-4 mb-8 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
          : 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600'
      }`}>
        {isUser ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </div>
      
      <div className={`flex-1 max-w-4xl ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-6 rounded-2xl shadow-lg shadow-slate-900/5 ${
          isUser 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-lg' 
            : 'bg-white text-slate-900 border border-slate-200/60 rounded-bl-lg'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {message.isVoice && (
              <Mic className={`w-4 h-4 ${isUser ? 'text-blue-200' : 'text-slate-400'}`} />
            )}
            <span className={`text-sm font-semibold ${
              isUser ? 'text-blue-200' : 'text-slate-500'
            }`}>
              {isUser ? 'You' : 'ShopAI Pro'}
            </span>
          </div>
          
          <div className="whitespace-pre-line leading-relaxed text-base">
            {message.content}
          </div>
          
          <div className={`text-sm mt-3 ${
            isUser ? 'text-blue-200' : 'text-slate-400'
          }`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
        
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {message.suggestions.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};