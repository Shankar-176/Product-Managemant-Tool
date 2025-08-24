export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AssistantResponse {
  suggestions: Array<{
    id: string;
    title: string;
    short_description: string;
    price: number;
    image: string;
    source: string;
    reason: string;
  }>;
  next_actions: string[];
  confidence: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: AssistantResponse['suggestions'];
  isVoice?: boolean;
}