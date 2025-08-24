import React, { useState, useEffect, useRef } from 'react';
import { Send, ShoppingCart, Bot, Sparkles, Menu, Search, User, Bell } from 'lucide-react';
import { ChatMessage, Product, CartItem, AssistantResponse } from './types';
import { useVoice } from './hooks/useVoice';
import { virtualAssistant } from './services/assistantService';
import { fakeStoreApi } from './services/fakeStoreApi';
import { VoiceControls } from './components/VoiceControls';
import { ChatMessage as ChatMessageComponent } from './components/ChatMessage';
import { ShoppingCart as ShoppingCartComponent } from './components/ShoppingCart';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductModal } from './components/ProductModal';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const voice = useVoice({
    onSpeechResult: (text) => {
      setInputValue(text);
      handleSendMessage(text, true);
    },
    onSpeechStart: () => {
      console.log('Speech started');
    },
    onSpeechEnd: () => {
      console.log('Speech ended');
    },
    onSpeechError: (error) => {
      console.error('Speech error:', error);
    }
  });

  useEffect(() => {
    // Initialize assistant
    virtualAssistant.initialize();
    
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'assistant',
      content: "Hello! I'm your personal shopping assistant. I'm here to help you find amazing products with great reviews and excellent value! What can I help you find today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text?: string, isVoice = false) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
      isVoice
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { reply, suggestions } = await virtualAssistant.processMessage(messageText);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: reply,
        timestamp: new Date(),
        suggestions: suggestions.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response if voice was used for input
      if (isVoice && voice.isSupported) {
        voice.speak(reply);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again, and I'll do my best to help you find great products!",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const product = await fakeStoreApi.getProduct(parseInt(productId));
      if (!product) return;

      setCartItems(prev => {
        const existingItem = prev.find(item => item.id === product.id);
        if (existingItem) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { ...product, quantity: 1 }];
        }
      });

      // Add confirmation message
      const confirmationMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Great choice! I've added "${product.title}" to your cart. This product has excellent customer reviews (${product.rating.rate}/5 stars) and is very popular with our shoppers. Would you like to continue shopping or proceed to checkout?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== productId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutComplete = () => {
    setCartItems([]);
    
    const confirmationMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: "🎉 Congratulations! Your order has been successfully placed. You'll receive a confirmation email shortly, and we'll keep you updated on your delivery status. Thank you for shopping with us! Is there anything else I can help you find today?",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const handleViewDetails = (productId: string) => {
    setSelectedProductId(productId);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 shadow-lg shadow-slate-900/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  ShopAI Pro
                </h1>
                <p className="text-sm text-slate-500 font-medium">Enterprise Shopping Intelligence</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-4">
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">
                  <User className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 font-medium"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                </div>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
            
            <button className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">AI-Powered Shopping Experience</h2>
              <p className="text-indigo-100 text-lg">Discover products through intelligent conversation • Voice-enabled • Personalized recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 pb-32">
        <div className="space-y-8">
          {messages.map((message) => (
            <ChatMessageComponent
              key={message.id}
              message={message}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
            />
          ))}
          
          {isLoading && (
            <div className="flex gap-4 mb-8">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div className="bg-white p-6 rounded-2xl rounded-bl-lg shadow-lg shadow-slate-900/5 border border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-slate-600 font-medium">Analyzing your request and finding the best products...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/60 p-6 z-30 shadow-2xl shadow-slate-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <VoiceControls
              isListening={voice.isListening}
              isSpeaking={voice.isSpeaking}
              isSupported={voice.isSupported}
              onStartListening={voice.startListening}
              onStopListening={voice.stopListening}
              onStopSpeaking={voice.stopSpeaking}
            />
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe what you're looking for, ask about products, or let me guide your shopping experience..."
              className="flex-1 px-6 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-lg shadow-slate-900/5 text-slate-900 placeholder-slate-500 font-medium"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 font-medium"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
          
          <div className="flex items-center justify-center gap-3 mt-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">AI-Powered</span>
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <span>Enterprise-grade shopping intelligence</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <span>Secure & Trusted</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ShoppingCartComponent
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={cartItems}
        onClose={() => setIsCheckoutOpen(false)}
        onComplete={handleCheckoutComplete}
      />

      <ProductModal
        isOpen={!!selectedProductId}
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default App;