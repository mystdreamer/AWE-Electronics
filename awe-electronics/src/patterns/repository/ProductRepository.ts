/**
 * Product Repository - Implements the Repository Design Pattern
 * 
 * Purpose: To abstract the data access logic and provide a clean API for
 * the domain objects to interact with the data source.
 */

import { Product } from '@shared/schema';
import { mockProducts } from '@/lib/mockData';

export class ProductRepository {
  private products: Product[];

  constructor() {
    // Initialize with mock data
    this.products = [...mockProducts];
  }

  /**
   * Get all products
   */
  public getAll(): Product[] {
    return this.products;
  }

  /**
   * Get a product by id
   */
  public getById(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  /**
   * Update a product
   */
  public update(updatedProduct: Product): Product {
    const index = this.products.findIndex(product => product.id === updatedProduct.id);
    
    if (index === -1) {
      throw new Error(`Product with id ${updatedProduct.id} not found`);
    }
    
    this.products[index] = updatedProduct;
    return this.products[index];
  }

  /**
   * Add a new product
   */
  public add(product: Omit<Product, 'id'>): Product {
    const newId = Math.max(...this.products.map(p => p.id)) + 1;
    const newProduct: Product = {
      ...product,
      id: newId
    };
    
    this.products.push(newProduct);
    return newProduct;
  }

  /**
   * Delete a product
   */
  public delete(id: number): void {
    const index = this.products.findIndex(product => product.id === id);
    
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    this.products.splice(index, 1);
  }
}