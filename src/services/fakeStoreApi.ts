import { Product } from '../types';

const BASE_URL = 'https://fakestoreapi.com';

class FakeStoreAPI {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProduct(id: number): Promise<Product | null> {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/products/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch products by category');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}/products/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async searchProducts(query: string, products?: Product[]): Promise<Product[]> {
    try {
      const allProducts = products || await this.getAllProducts();
      const searchTerm = query.toLowerCase();
      
      return allProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
}

export const fakeStoreApi = new FakeStoreAPI();