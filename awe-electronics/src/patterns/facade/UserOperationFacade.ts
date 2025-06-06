/**
 * User Operation Facade - Implements the Facade Design Pattern
 * 
 * Purpose: To simplify the complex subsystem interactions for the client by providing
 * a unified interface that coordinates multiple underlying classes.
 * 
 * This facade handles all customer operations including browsing products,
 * managing cart, processing payments, and generating receipts.
 */

import { Product, CartItem, Order } from '@shared/schema';
import { mockProducts, mockOrders } from '@/lib/mockData';
import { generateOrderNumber, generateReceiptNumber } from '@/lib/utils';

// Subsystem components
import { ProductRepository } from '../repository/ProductRepository';
import { CartService } from '../repository/CartService';
import { OrderService } from '../repository/OrderService';
import { PaymentProcessor } from '../strategy/PaymentProcessor';
import { PostPaymentProcessor } from '../observer/PostPaymentProcessor';

export class UserOperationFacade {
  private productRepository: ProductRepository;
  private cartService: CartService;
  private orderService: OrderService;
  private paymentProcessor: PaymentProcessor;
  private postPaymentProcessor: PostPaymentProcessor;

  constructor() {
    // Initialize subsystem components
    this.productRepository = new ProductRepository();
    this.cartService = new CartService();
    this.orderService = new OrderService();
    this.paymentProcessor = new PaymentProcessor();
    this.postPaymentProcessor = new PostPaymentProcessor();
  }

  /**
   * Get all products to browse the catalog
   */
  public getAllProducts(): Product[] {
    return this.productRepository.getAll();
  }

  /**
   * Add a product to the shopping cart
   */
  public addToCart(product: Product, quantity: number): CartItem {
    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    };
    return this.cartService.addItem(cartItem);
  }

  /**
   * Process a purchase including payment and post-payment actions
   */
  public processPurchase(
    items: CartItem[],
    paymentMethod: string,
    shippingAddress: string
  ): Order {
    // 1. Create an order
    const orderNumber = generateOrderNumber();
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const newOrder: Order = {
      id: mockOrders.length + 1,
      userId: 1, // Assuming customer id is 1
      orderNumber,
      status: 'Processing',
      items,
      shippingAddress,
      paymentMethod,
      total: total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 2. Process payment (Strategy Pattern)
    const paymentResult = this.paymentProcessor.processPayment(paymentMethod, total);
    
    if (!paymentResult.success) {
      throw new Error('Payment failed: ' + paymentResult.message);
    }

    // 3. Save order
    const savedOrder = this.orderService.createOrder(newOrder);

    // 4. Trigger post-payment processing (Observer Pattern)
    // This will trigger receipt generation, inventory update, shipping preparation etc.
    this.postPaymentProcessor.notify({
      order: savedOrder,
      paymentMethod,
      paymentAmount: total
    });

    return savedOrder;
  }

  /**
   * Get all orders for the current user
   */
  public getOrders(): Order[] {
    // This is a simple in-memory mock, filtered by userId = 1
    return this.orderService.getOrdersByUserId(1); // You can parameterise this later if needed
  }
}