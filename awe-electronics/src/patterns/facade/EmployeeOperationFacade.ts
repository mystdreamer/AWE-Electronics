/**
 * Employee Operation Facade - Implements the Facade Design Pattern
 * 
 * Purpose: To simplify the complex subsystem interactions for the client by providing
 * a unified interface that coordinates multiple underlying classes.
 * 
 * This facade handles employee operations including product management,
 * order processing, and shipment coordination.
 */

import { Product, Statistics } from '@shared/schema';
import { ProductRepository } from '../repository/ProductRepository';
import { mockUsers, mockProducts, mockOrders, mockReceipts } from "@/lib/mockData";

export class EmployeeOperationFacade {
  private productRepository: ProductRepository;

  constructor() {
    // Initialize subsystem components
    this.productRepository = new ProductRepository();
  }

  /**
   * Provide mock dashboard data for employee view
   */
  async getDashboardData(): Promise<{
    statistics: Statistics;
    recentOrders: any[];
    inventoryItems: any[];
    pendingShipments: any[];
  }> {
    const statistics: Statistics = {
      id: 1,
      ordersCount: mockOrders.length,
      totalRevenue: mockOrders.reduce((sum, o) => sum + o.total, 0),
      averageOrderValue: mockOrders.length > 0 ? mockOrders.reduce((sum, o) => sum + o.total, 0) / mockOrders.length : 0,
      topSellingProducts: mockProducts.slice(0, 3), // determine top sellers, more of a placeholder atm
      updatedAt: new Date().toISOString(),
    };

    const inventoryItems = mockProducts.map((p) => ({
      ...p,
      status:
        p.stock > 10
          ? "In Stock"
          : p.stock > 0
          ? "Low Stock"
          : "Out of Stock",
    }));

    const pendingShipments = mockOrders.map((order) => {
      const customer = mockUsers.find((u) => u.id === order.userId);
      return {
        orderId: order.id,
        customer: customer?.name || "Unknown",
        date: order.createdAt,
        status: order.status,
      };
    });

    return Promise.resolve({
      statistics,
      recentOrders: mockOrders,
      inventoryItems,
      pendingShipments,
    });
  }

  /**
   * Get all products for management
   */
  public getAllProducts(): Product[] {
    return this.productRepository.getAll();
  }

  /**
   * Get a specific product by id
   */
  public getProduct(id: number): Product | undefined {
    return this.productRepository.getById(id);
  }

  /**
   * Update a product description
   * This is one of the key scenarios: Employee updates product description
   */
  public updateProductDescription(productId: number, newDescription: string): Product {
    const product = this.productRepository.getById(productId);

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    const updatedProduct: Product = {
      ...product,
      description: newDescription,
    };

    return this.productRepository.update(updatedProduct);
  }

  /**
   * Update a product (full update)
   */
  public updateProduct(product: Product): Product {
    return this.productRepository.update(product);
  }

  /**
   * Add a new product
   */
  public addProduct(product: Omit<Product, 'id'>): Product {
    return this.productRepository.add(product);
  }

  /**
   * Delete a product
   */
  public deleteProduct(id: number): void {
    this.productRepository.delete(id);
  }
}
