/**
 * Design Patterns for E-commerce Application
 * 
 * This file centralises the implementation of the four design patterns:
 * 1. Facade Pattern - Simplifies complex subsystems interactions
 * 2. Strategy Pattern - Encapsulates family of algorithms for payment processing
 * 3. Observer Pattern - Defines one-to-many dependency for post-payment actions
 * 4. Repository Pattern - Abstracts data access logic
 */

import { 
  Product, 
  CartItem, 
  Order, 
  Receipt,
  User
} from '@shared/schema';
import { 
  mockProducts, 
  mockOrders, 
  mockReceipts,
  mockUsers 
} from '@/lib/mockData';
import { 
  generateOrderNumber, 
  generateReceiptNumber,
  formatCurrency
} from '@/lib/utils';

// ============ REPOSITORY PATTERN ============

// Product Repository
export class ProductRepository {
  private products: Product[];

  constructor() {
    this.products = [...mockProducts];
  }

  getAll(): Product[] {
    return this.products;
  }

  getById(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  update(updatedProduct: Product): Product {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index === -1) {
      throw new Error(`Product not found: ${updatedProduct.id}`);
    }
    this.products[index] = updatedProduct;
    return this.products[index];
  }

  updateDescription(id: number, description: string): Product {
    const product = this.getById(id);
    if (!product) {
      throw new Error(`Product not found: ${id}`);
    }
    const updatedProduct = {...product, description};
    return this.update(updatedProduct);
  }
}

// Order Repository
export class OrderRepository {
  private orders: Order[];

  constructor() {
    this.orders = [...mockOrders];
  }

  getAll(): Order[] {
    return this.orders;
  }

  getById(id: number): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  create(order: Omit<Order, 'id'>): Order {
    const newId = this.orders.length > 0 
      ? Math.max(...this.orders.map(o => o.id)) + 1 
      : 1;
    
    const newOrder: Order = {
      ...order,
      id: newId
    };
    
    this.orders.push(newOrder);
    return newOrder;
  }
}

// Receipt Repository
export class ReceiptRepository {
  private receipts: Receipt[];

  constructor() {
    this.receipts = [...mockReceipts];
  }

  getAll(): Receipt[] {
    return this.receipts;
  }

  getById(id: number): Receipt | undefined {
    return this.receipts.find(receipt => receipt.id === id);
  }

  getByOrderId(orderId: number): Receipt | undefined {
    return this.receipts.find(receipt => receipt.orderId === orderId);
  }

  create(receipt: Omit<Receipt, 'id'>): Receipt {
    const newId = this.receipts.length > 0 
      ? Math.max(...this.receipts.map(r => r.id)) + 1 
      : 1;
    
    const newReceipt: Receipt = {
      ...receipt,
      id: newId
    };
    
    this.receipts.push(newReceipt);
    return newReceipt;
  }
}

// User Repository
export class UserRepository {
  private users: User[];

  constructor() {
    this.users = [...mockUsers];
  }

  getByCredentials(username: string, password: string): User | undefined {
    return this.users.find(
      user => user.username === username && user.password === password
    );
  }
}

// ============ STRATEGY PATTERN ============

// Payment Strategy Interface
export interface PaymentStrategy {
  pay(amount: number): PaymentResult;
  getName(): string;
}

// Payment Result Type
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

// Credit Card Payment Strategy
export class CreditCardPayment implements PaymentStrategy {
  getName(): string {
    return 'Credit Card';
  }

  pay(amount: number): PaymentResult {
    console.log(`Processing credit card payment of ${formatCurrency(amount)}`);
    
    return {
      success: true,
      transactionId: `CC-${Date.now()}`,
      message: 'Credit card payment successful'
    };
  }
}

// PayPal Payment Strategy
export class PayPalPayment implements PaymentStrategy {
  getName(): string {
    return 'PayPal';
  }

  pay(amount: number): PaymentResult {
    console.log(`Processing PayPal payment of ${formatCurrency(amount)}`);
    
    return {
      success: true,
      transactionId: `PP-${Date.now()}`,
      message: 'PayPal payment successful'
    };
  }
}

// Bank Transfer Payment Strategy
export class BankTransferPayment implements PaymentStrategy {
  getName(): string {
    return 'Bank Transfer';
  }

  pay(amount: number): PaymentResult {
    console.log(`Processing bank transfer of ${formatCurrency(amount)}`);
    
    return {
      success: true,
      transactionId: `BT-${Date.now()}`,
      message: 'Bank transfer initiated successfully'
    };
  }
}

// Payment Processor - Context class for the Strategy pattern
export class PaymentProcessor {
  private strategies: Map<string, PaymentStrategy>;
  
  constructor() {
    // Register available payment strategies
    this.strategies = new Map();
    this.strategies.set('Credit Card', new CreditCardPayment());
    this.strategies.set('PayPal', new PayPalPayment());
    this.strategies.set('Bank Transfer', new BankTransferPayment());
  }
  
  // Get all available payment methods
  getAvailablePaymentMethods(): string[] {
    return Array.from(this.strategies.keys());
  }
  
  // Process payment using the selected strategy
  processPayment(method: string, amount: number): PaymentResult {
    const strategy = this.strategies.get(method);
    
    if (!strategy) {
      return {
        success: false,
        message: `Payment method '${method}' is not supported`
      };
    }
    
    try {
      return strategy.pay(amount);
    } catch (error) {
      return {
        success: false,
        message: `Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// ============ OBSERVER PATTERN ============

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
  private receiptRepository: ReceiptRepository;
  
  constructor() {
    this.receiptRepository = new ReceiptRepository();
  }
  
  update(data: PaymentEventData): Receipt {
    console.log('Generating receipt for order:', data.order.orderNumber);
    
    const receiptNumber = generateReceiptNumber();
    
    const receipt: Omit<Receipt, 'id'> = {
      orderId: data.order.id,
      receiptNumber,
      amount: data.paymentAmount.toString(),
      paymentMethod: data.paymentMethod,
      createdAt: new Date()
    };
    
    const newReceipt = this.receiptRepository.create(receipt);
    console.log('Receipt generated:', newReceipt);
    return newReceipt;
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
    console.log(`Shipping address: ${data.order.shippingAddress}`);
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
  }
  
  // Add an observer
  attach(observer: PaymentObserver): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Observer has been attached already.');
    }
    
    this.observers.push(observer);
    console.log('Observer attached!');
  }
  
  // Remove an observer
  detach(observer: PaymentObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Nonexistent observer.');
    }
    
    this.observers.splice(observerIndex, 1);
    console.log('Observer detached.');
  }
  
  // Notify all observers about an event
  notify(data: PaymentEventData): void {
    console.log('PostPaymentProcessor: Notifying observers...');
    
    for (const observer of this.observers) {
      observer.update(data);
    }
  }
}

// ============ FACADE PATTERN ============

// Customer Facade - Simplifies operations for customer users
export class CustomerFacade {
  private productRepository: ProductRepository;
  private orderRepository: OrderRepository;
  private paymentProcessor: PaymentProcessor;
  private postPaymentProcessor: PostPaymentProcessor;
  
  constructor() {
    this.productRepository = new ProductRepository();
    this.orderRepository = new OrderRepository();
    this.paymentProcessor = new PaymentProcessor();
    this.postPaymentProcessor = new PostPaymentProcessor();
  }
  
  // Get all products for browsing
  getAllProducts(): Product[] {
    return this.productRepository.getAll();
  }
  
  // Get available payment methods
  getPaymentMethods(): string[] {
    return this.paymentProcessor.getAvailablePaymentMethods();
  }
  
  // Process a complete purchase
  processPurchase(
    items: CartItem[],
    paymentMethod: string,
    shippingAddress: string
  ): Order {
    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Create new order
    const newOrder: Omit<Order, 'id'> = {
      userId: 1, // Assuming customer id is 1
      orderNumber: generateOrderNumber(),
      status: 'Processing',
      items: items,
      shippingAddress,
      paymentMethod,
      total: total.toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Process payment using Strategy Pattern
    const paymentResult = this.paymentProcessor.processPayment(paymentMethod, total);
    
    if (!paymentResult.success) {
      throw new Error('Payment failed: ' + paymentResult.message);
    }
    
    // Create order in repository
    const savedOrder = this.orderRepository.create(newOrder);
    
    // Trigger post-payment processing (Observer Pattern)
    this.postPaymentProcessor.notify({
      order: savedOrder,
      paymentMethod,
      paymentAmount: total
    });
    
    return savedOrder;
  }
  
  // Get order details
  getOrder(orderId: number): Order | undefined {
    return this.orderRepository.getById(orderId);
  }
  
  // Get receipt for an order
  getReceipt(orderId: number): Receipt | undefined {
    const receiptRepository = new ReceiptRepository();
    return receiptRepository.getByOrderId(orderId);
  }
}

// Employee Facade - Simplifies operations for employee users
export class EmployeeFacade {
  private productRepository: ProductRepository;
  
  constructor() {
    this.productRepository = new ProductRepository();
  }
  
  // Get all products
  getAllProducts(): Product[] {
    return this.productRepository.getAll();
  }
  
  // Get a specific product
  getProduct(id: number): Product | undefined {
    return this.productRepository.getById(id);
  }
  
  // Update a product description
  updateProductDescription(id: number, description: string): Product {
    return this.productRepository.updateDescription(id, description);
  }
  
  // Update a product (full update)
  updateProduct(product: Product): Product {
    return this.productRepository.update(product);
  }
}

// Authentication Facade - Simplifies user authentication
export class AuthFacade {
  private userRepository: UserRepository;
  
  constructor() {
    this.userRepository = new UserRepository();
  }
  
  // Authenticate a user
  login(username: string, password: string): User | undefined {
    return this.userRepository.getByCredentials(username, password);
  }
}