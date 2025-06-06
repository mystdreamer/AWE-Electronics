/**
 * Order Service - Part of the Repository Pattern implementation
 * 
 * Handles order data operations, allowing for creating, reading,
 * and updating order information.
 */

import { Order } from '@shared/schema';
import { mockOrders } from '@/lib/mockData';

export class OrderService {
  private orders: Order[];

  constructor() {
    // Initialize with mock data
    this.orders = [...mockOrders];
  }

  /**
   * Get all orders
   */
  public getAllOrders(): Order[] {
    return this.orders;
  }

  /**
   * Get order by id
   */
  public getOrderById(id: number): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  /**
   * Create a new order
   */
  public createOrder(order: Order): Order {
    this.orders.push(order);
    return order;
  }

  /**
   * Update an order
   */
  public updateOrder(updatedOrder: Order): Order {
    const index = this.orders.findIndex(order => order.id === updatedOrder.id);
    
    if (index === -1) {
      throw new Error(`Order with id ${updatedOrder.id} not found`);
    }
    
    this.orders[index] = {
      ...updatedOrder,
      updatedAt: new Date()
    };
    
    return this.orders[index];
  }

  /**
   * Get orders by user id
   */
  public getOrdersByUserId(userId: number): Order[] {
    return this.orders.filter(order => order.userId === userId);
  }
}