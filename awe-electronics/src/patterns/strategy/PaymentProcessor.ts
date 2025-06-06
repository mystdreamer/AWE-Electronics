/**
 * Payment Processor - Implements the Strategy Design Pattern
 * 
 * Purpose: To define a family of algorithms (payment methods),
 * encapsulate each one, and make them interchangeable.
 * 
 * This allows the payment method to vary independently from the clients that use it,
 * enabling different payment methods to be chosen at runtime.
 */

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
    // In a real implementation, this would integrate with a payment gateway
    console.log(`Processing credit card payment of $${amount.toFixed(2)}`);
    
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
    // In a real implementation, this would redirect to PayPal
    console.log(`Processing PayPal payment of $${amount.toFixed(2)}`);
    
    return {
      success: true,
      transactionId: `PP-${Date.now()}`,
      message: 'PayPal payment successful'
    };
  }
}

// Apple Pay Payment Strategy
export class ApplePayPayment implements PaymentStrategy {
  getName(): string {
    return 'Apple Pay';
  }

  pay(amount: number): PaymentResult {
    console.log(`Processing Apple Pay payment of $${amount.toFixed(2)}`);
    
    return {
      success: true,
      transactionId: `AP-${Date.now()}`,
      message: 'Apple Pay payment successful'
    };
  }
}

// Bank Transfer Payment Strategy
export class BankTransferPayment implements PaymentStrategy {
  getName(): string {
    return 'Bank Transfer';
  }

  pay(amount: number): PaymentResult {
    console.log(`Processing bank transfer payment of $${amount.toFixed(2)}`);
    
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
    this.strategies.set('Apple Pay', new ApplePayPayment());
    this.strategies.set('Bank Transfer', new BankTransferPayment());
  }
  
  // Get all available payment methods
  public getAvailablePaymentMethods(): string[] {
    return Array.from(this.strategies.keys());
  }
  
  // Process payment using the selected strategy
  public processPayment(method: string, amount: number): PaymentResult {
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