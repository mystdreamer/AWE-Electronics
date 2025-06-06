/**
 * Post Payment Processor - Implements the Observer Design Pattern
 * 
 * Purpose: To define a one-to-many dependency between objects so that
 * when one object changes state, all its dependents are notified and updated automatically.
 * 
 * This class acts as the Subject (Publisher) in the Observer pattern, notifying
 * various observers when a payment is successfully processed.
 */

import { Order, Receipt, CartItem } from '@shared/schema';
import { generateReceiptNumber } from '@/lib/utils';
import { mockReceipts } from '@/lib/mockData';

// Payment event data passed to observers
export interface PaymentEventData {
  order: Order;
  paymentMethod: string;
  paymentAmount: number;
}

// Observer interface
export interface PaymentObserver {
  update(data: PaymentEventData): void;
}

// Receipt Generator - One of the observers
export class ReceiptGenerator implements PaymentObserver {
  update(data: PaymentEventData): Receipt {
    console.log('Generating receipt for order:', data.order.orderNumber);
    
    const receiptNumber = generateReceiptNumber();
    
    const receipt: Receipt = {
      id: mockReceipts.length + 1,
      orderId: data.order.id,
      receiptNumber,
      amount: data.paymentAmount.toString(),
      paymentMethod: data.paymentMethod,
      createdAt: new Date()
    };
    
    console.log('Receipt generated:', receipt);
    return receipt;
  }
}

// Inventory Manager - Another observer
export class InventoryManager implements PaymentObserver {
  update(data: PaymentEventData): void {
    console.log('Updating inventory for order:', data.order.orderNumber);
    
    // In a real implementation, this would update the product inventory
    const items = data.order.items as CartItem[];
    if (items && Array.isArray(items)) {
      items.forEach(item => {
        console.log(`Reducing stock for product #${item.productId} by ${item.quantity}`);
      });
    }
  }
}

// Shipping Coordinator - Another observer
export class ShippingCoordinator implements PaymentObserver {
  update(data: PaymentEventData): void {
    console.log('Preparing shipment for order:', data.order.orderNumber);
    
    // In a real implementation, this would create a shipping record
    console.log(`Shipping address: ${data.order.shippingAddress}`);
    console.log('Shipping preparation initiated');
  }
}

// Email Notifier - Another observer
export class EmailNotifier implements PaymentObserver {
  update(data: PaymentEventData): void {
    console.log('Sending order confirmation email for order:', data.order.orderNumber);
    
    // In a real implementation, this would send an email to the customer
    console.log('Order confirmation email sent');
  }
}

// Post Payment Processor - The Subject (Publisher) in the Observer pattern
export class PostPaymentProcessor {
  private observers: PaymentObserver[] = [];
  
  constructor() {
    // Register observers
    this.attach(new ReceiptGenerator());
    this.attach(new InventoryManager());
    this.attach(new ShippingCoordinator());
    this.attach(new EmailNotifier());
  }
  
  // Add an observer
  public attach(observer: PaymentObserver): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Observer has been attached already.');
    }
    
    this.observers.push(observer);
    console.log('Observer attached!');
  }
  
  // Remove an observer
  public detach(observer: PaymentObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Nonexistent observer.');
    }
    
    this.observers.splice(observerIndex, 1);
    console.log('Observer detached.');
  }
  
  // Notify all observers about an event
  public notify(data: PaymentEventData): void {
    console.log('PostPaymentProcessor: Notifying observers...');
    
    for (const observer of this.observers) {
      observer.update(data);
    }
  }
}