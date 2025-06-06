import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to readable string
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format currency
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numAmount);
}

// Generate a random order number
export function generateOrderNumber(): string {
  return `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
}

// Generate a random receipt number
export function generateReceiptNumber(): string {
  return `RCT-${Math.floor(10000 + Math.random() * 90000)}`;
}

// Generate a random tracking number
export function generateTrackingNumber(): string {
  return `TRK${Math.floor(100000000 + Math.random() * 900000000)}`;
}

// Calculate subtotal from cart items
export function calculateSubtotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Calculate tax (8% of subtotal)
export function calculateTax(subtotal: number): number {
  return subtotal * 0.08;
}

// Calculate shipping (fixed $5.00 for non-empty carts)
export function calculateShipping(items: Array<{ price: number; quantity: number }>): number {
  return items.length > 0 ? 5.0 : 0;
}

// Calculate total (subtotal + tax + shipping)
export function calculateTotal(items: Array<{ price: number; quantity: number }>): number {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(items);
  return subtotal + tax + shipping;
}
