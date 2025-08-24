import { Product, AssistantResponse } from '../types';
import { fakeStoreApi } from './fakeStoreApi';

interface AssistantContext {
  previousMessages: string[];
  userPreferences: Record<string, any>;
  currentCart: Product[];
}

class VirtualAssistant {
  private products: Product[] = [];
  private categories: string[] = [];

  async initialize() {
    try {
      [this.products, this.categories] = await Promise.all([
        fakeStoreApi.getAllProducts(),
        fakeStoreApi.getCategories()
      ]);
    } catch (error) {
      console.error('Failed to initialize assistant:', error);
    }
  }

  async processMessage(
    message: string, 
    context: Partial<AssistantContext> = {}
  ): Promise<{ reply: string; suggestions: AssistantResponse }> {
    await this.ensureInitialized();

    const normalizedMessage = message.toLowerCase().trim();
    const intent = this.detectIntent(normalizedMessage);
    
    let reply = '';
    let suggestions: AssistantResponse;

    switch (intent) {
      case 'greeting':
        reply = this.generateGreeting();
        suggestions = await this.getPopularProducts();
        break;
      
      case 'search':
        const searchQuery = this.extractSearchQuery(normalizedMessage);
        reply = `I found some great products for "${searchQuery}". Here are my top recommendations:`;
        suggestions = await this.searchProducts(searchQuery);
        break;
      
      case 'category':
        const category = this.extractCategory(normalizedMessage);
        reply = `Here are some excellent ${category} products that customers love:`;
        suggestions = await this.getProductsByCategory(category);
        break;
      
      case 'help':
        reply = this.generateHelpMessage();
        suggestions = await this.getPopularProducts();
        break;
      
      case 'price_inquiry':
        const priceRange = this.extractPriceRange(normalizedMessage);
        reply = `I found some amazing products within your budget. These are highly rated by customers:`;
        suggestions = await this.getProductsByPriceRange(priceRange.min, priceRange.max);
        break;

      default:
        reply = this.generateDefaultResponse(normalizedMessage);
        suggestions = await this.getRelevantProducts(normalizedMessage);
        break;
    }

    return { reply, suggestions };
  }

  private async ensureInitialized() {
    if (this.products.length === 0) {
      await this.initialize();
    }
  }

  private detectIntent(message: string): string {
    const greetingPatterns = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    const searchPatterns = ['looking for', 'need', 'want to buy', 'show me', 'find'];
    const categoryPatterns = ['electronics', 'clothing', 'jewelry', 'men', 'women'];
    const helpPatterns = ['help', 'assist', 'guide', 'how', 'what can you do'];
    const pricePatterns = ['cheap', 'expensive', 'under', 'budget', 'price', 'cost', '$'];

    if (greetingPatterns.some(pattern => message.includes(pattern))) return 'greeting';
    if (searchPatterns.some(pattern => message.includes(pattern))) return 'search';
    if (categoryPatterns.some(pattern => message.includes(pattern))) return 'category';
    if (helpPatterns.some(pattern => message.includes(pattern))) return 'help';
    if (pricePatterns.some(pattern => message.includes(pattern))) return 'price_inquiry';

    return 'general';
  }

  private extractSearchQuery(message: string): string {
    // Extract keywords while removing common stop words
    const stopWords = ['i', 'am', 'looking', 'for', 'need', 'want', 'to', 'buy', 'show', 'me', 'find'];
    const words = message.split(' ').filter(word => 
      word.length > 2 && !stopWords.includes(word.toLowerCase())
    );
    return words.join(' ') || 'popular items';
  }

  private extractCategory(message: string): string {
    const categoryMap: Record<string, string> = {
      'electronics': 'electronics',
      'clothes': "men's clothing",
      'clothing': "men's clothing", 
      'jewelry': 'jewelery',
      'men': "men's clothing",
      'women': "women's clothing"
    };

    for (const [key, value] of Object.entries(categoryMap)) {
      if (message.includes(key)) return value;
    }
    return 'electronics'; // default
  }

  private extractPriceRange(message: string): { min: number; max: number } {
    if (message.includes('cheap') || message.includes('budget')) return { min: 0, max: 50 };
    if (message.includes('expensive') || message.includes('premium')) return { min: 100, max: 1000 };
    if (message.includes('under')) {
      const match = message.match(/under\s*\$?(\d+)/);
      if (match) return { min: 0, max: parseInt(match[1]) };
    }
    return { min: 0, max: 100 }; // default range
  }

  private generateGreeting(): string {
    const greetings = [
      "Hello! I'm your personal shopping assistant. I'm here to help you find amazing products with great reviews and excellent value!",
      "Hi there! Welcome to your personalized shopping experience. I can help you discover the best products that match your needs and budget!",
      "Good day! I'm excited to help you find the perfect products today. Let me show you some popular items that customers absolutely love!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private generateHelpMessage(): string {
    return "I'm here to make your shopping experience amazing! I can help you:\n\n" +
           "• Find products by describing what you need\n" +
           "• Browse different categories\n" +
           "• Get recommendations based on customer reviews\n" +
           "• Find products within your budget\n" +
           "• Guide you through checkout\n\n" +
           "Just tell me what you're looking for, and I'll show you the best options!";
  }

  private generateDefaultResponse(message: string): string {
    return "I understand you're interested in shopping! Let me show you some highly-rated products that might interest you. These items have excellent customer reviews and great value:";
  }

  private async searchProducts(query: string): Promise<AssistantResponse> {
    const results = await fakeStoreApi.searchProducts(query, this.products);
    return this.formatProductSuggestions(results.slice(0, 3), query);
  }

  private async getProductsByCategory(category: string): Promise<AssistantResponse> {
    const results = await fakeStoreApi.getProductsByCategory(category);
    return this.formatProductSuggestions(results.slice(0, 3), `${category} products`);
  }

  private async getPopularProducts(): Promise<AssistantResponse> {
    const popular = this.products
      .sort((a, b) => (b.rating.rate * b.rating.count) - (a.rating.rate * a.rating.count))
      .slice(0, 3);
    return this.formatProductSuggestions(popular, 'popular items');
  }

  private async getProductsByPriceRange(min: number, max: number): Promise<AssistantResponse> {
    const filtered = this.products.filter(p => p.price >= min && p.price <= max);
    const sorted = filtered.sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 3);
    return this.formatProductSuggestions(sorted, `products under $${max}`);
  }

  private async getRelevantProducts(message: string): Promise<AssistantResponse> {
    // Try to find relevant products based on message content
    const searchResults = await this.searchProducts(message);
    if (searchResults.suggestions.length > 0) {
      return searchResults;
    }
    // Fallback to popular products
    return this.getPopularProducts();
  }

  private formatProductSuggestions(products: Product[], context: string): AssistantResponse {
    const suggestions = products.map(product => ({
      id: product.id.toString(),
      title: product.title,
      short_description: this.truncateDescription(product.description),
      price: Math.round(product.price * 100) / 100,
      image: product.image,
      source: 'FakeStore',
      reason: this.generateReasonForRecommendation(product)
    }));

    const nextActions = this.generateNextActions(context, products.length > 0);

    return {
      suggestions,
      next_actions: nextActions,
      confidence: products.length > 0 ? 0.9 : 0.3
    };
  }

  private truncateDescription(description: string): string {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  }

  private generateReasonForRecommendation(product: Product): string {
    const reasons = [
      `⭐ ${product.rating.rate}/5 rating with ${product.rating.count} customer reviews`,
      `💰 Great value at $${product.price} with excellent customer satisfaction`,
      `🏆 Top-rated in ${product.category} category`,
      `👥 Popular choice with ${product.rating.count}+ happy customers`,
      `✨ Highly recommended based on customer reviews`
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private generateNextActions(context: string, hasResults: boolean): string[] {
    if (!hasResults) {
      return [
        'Try a different search term',
        'Browse categories',
        'Ask for help finding specific items'
      ];
    }

    return [
      'Add to cart',
      'View more details',
      'Compare similar products',
      'Ask about other categories'
    ];
  }
}

export const virtualAssistant = new VirtualAssistant();