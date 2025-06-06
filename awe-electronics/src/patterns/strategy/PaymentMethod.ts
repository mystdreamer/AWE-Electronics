/**
 * Strategy Pattern Implementation for Payment Processing
 */

// Payment result interface
export interface PaymentResult {
  success: boolean;
  methodName: string;
  transactionId?: string;
  error?: string;
}

// Strategy interface
export interface PaymentMethod {
  processPayment(amount: number): Promise<PaymentResult>;
}

// Credit Card payment strategy
export class PaymentCreditCard implements PaymentMethod {
  private cardNumber: string;
  private expiryDate: string;
  private cvv: string;
  private cardholderName: string;

  constructor(cardNumber: string, expiryDate: string, cvv: string, cardholderName: string) {
    this.cardNumber = cardNumber;
    this.expiryDate = expiryDate;
    this.cvv = cvv;
    this.cardholderName = cardholderName;
  }

  async processPayment(amount: number): Promise<PaymentResult> {
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        // Basic validation
        if (!this.cardNumber || !this.expiryDate || !this.cvv || !this.cardholderName) {
          resolve({
            success: false,
            methodName: 'Credit Card',
            error: 'Invalid card details'
          });
          return;
        }

        // Simulate successful payment
        resolve({
          success: true,
          methodName: 'Credit Card',
          transactionId: `CC-${Date.now()}`
        });
      }, 500);
    });
  }
}

// PayPal payment strategy
export class PaymentPayPal implements PaymentMethod {
  private email: string;

  constructor(email: string) {
    this.email = email;
  }

  async processPayment(amount: number): Promise<PaymentResult> {
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        // Basic validation
        if (!this.email || !this.email.includes('@')) {
          resolve({
            success: false,
            methodName: 'PayPal',
            error: 'Invalid PayPal email'
          });
          return;
        }

        // Simulate successful payment
        resolve({
          success: true,
          methodName: 'PayPal',
          transactionId: `PP-${Date.now()}`
        });
      }, 500);
    });
  }
}

// In-store payment strategy
export class PaymentShop implements PaymentMethod {
  async processPayment(amount: number): Promise<PaymentResult> {
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        // Always succeeds since payment will happen in-store
        resolve({
          success: true,
          methodName: 'Pay in Store',
          transactionId: `SHOP-${Date.now()}`
        });
      }, 500);
    });
  }
}
