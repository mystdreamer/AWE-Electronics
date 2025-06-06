/**
 * Cart Service - Part of the Repository Pattern implementation
 * 
 * Handles shopping cart data operations, keeping cart data in memory
 * for the current session.
 */

import { CartItem } from '@shared/schema';

export class CartService {
  private items: CartItem[] = [];

  /**
   * Get all items in the cart
   */
  public getItems(): CartItem[] {
    return this.items;
  }

  /**
   * Add an item to the cart
   */
  public addItem(item: CartItem): CartItem {
    // Check if the product is already in the cart
    const existingItemIndex = this.items.findIndex(
      (cartItem) => cartItem.productId === item.productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if the product is already in the cart
      this.items[existingItemIndex].quantity += item.quantity;
      return this.items[existingItemIndex];
    } else {
      // Add new item if the product is not in the cart
      this.items.push(item);
      return item;
    }
  }

  /**
   * Update item quantity in the cart
   */
  public updateItemQuantity(productId: number, quantity: number): CartItem | undefined {
    const itemIndex = this.items.findIndex(
      (cartItem) => cartItem.productId === productId
    );

    if (itemIndex >= 0) {
      this.items[itemIndex].quantity = quantity;
      return this.items[itemIndex];
    }
    
    return undefined;
  }

  /**
   * Remove an item from the cart
   */
  public removeItem(productId: number): void {
    this.items = this.items.filter(
      (cartItem) => cartItem.productId !== productId
    );
  }

  /**
   * Clear the cart
   */
  public clearCart(): void {
    this.items = [];
  }

  /**
   * Calculate cart subtotal
   */
  public calculateSubtotal(): number {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}