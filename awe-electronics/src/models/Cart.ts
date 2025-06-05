// src/models/Cart.ts
import { Product } from "./Product";

export class Cart {
  private items: Map<string, number> = new Map(); // productId → quantity
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  addItem(product: Product, quantity: number = 1): void {
    if (!product.isInStock()) return;

    const existingQty = this.items.get(product.id) || 0;
    this.items.set(product.id, existingQty + quantity);
  }

  removeItem(productId: string): void {
    this.items.delete(productId);
  }

  clear(): void {
    this.items.clear();
  }

  getItems(): Map<string, number> {
    return this.items;
  }
}
