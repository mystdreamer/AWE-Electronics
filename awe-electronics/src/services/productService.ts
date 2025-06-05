// src/services/productService.ts
import { Product } from "../models/Product";

// Simulated in-memory product list
let mockProducts: Product[] = [
  new Product("p1", "Laptop", "High performance laptop", 1500, 10),
  new Product("p2", "Mouse", "Wireless mouse", 30, 25),
  new Product("p3", "Keyboard", "Mechanical keyboard", 90, 15),
];

// Simulate GET /products
export function fetchAllProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProducts), 300); // Simulate async delay
  });
}

// Simulate PUT /products/:id
export function updateProduct(updated: Product): Promise<boolean> {
  return new Promise((resolve) => {
    const index = mockProducts.findIndex((p) => p.id === updated.id);
    if (index !== -1) {
      mockProducts[index] = updated;
      resolve(true);
    } else {
      resolve(false);
    }
  });
}
