// src/models/Product.ts
export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    stock: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
  }

  isInStock(): boolean {
    return this.stock > 0;
  }

  reduceStock(qty: number): void {
    this.stock = Math.max(0, this.stock - qty);
  }

  restock(qty: number): void {
    this.stock += qty;
  }
}
