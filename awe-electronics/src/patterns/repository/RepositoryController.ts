import { Product, Order, CartItem } from '@shared/schema';
import { mockProducts, mockOrders } from '../../lib/mockData';

/**
 * Repository Pattern Implementation for Data Access
 */

// Repository interface
export interface IRepositoryService<T> {
  execute(...args: any[]): Promise<T>;
}

/**
 * Add Item implementation
 */
export class AddItem<T> implements IRepositoryService<T> {
  private collection: T[];
  
  constructor(collection: T[]) {
    this.collection = collection;
  }
  
  async execute(item: T): Promise<T> {
    // In a real app, this would add to the database
    console.log('Adding item to collection', item);
    return item;
  }
}

/**
 * Remove Item implementation
 */
export class RemoveItem<T> implements IRepositoryService<boolean> {
  private collection: T[];
  private idField: string;
  
  constructor(collection: T[], idField = 'id') {
    this.collection = collection;
    this.idField = idField;
  }
  
  async execute(id: any): Promise<boolean> {
    // In a real app, this would remove from the database
    console.log(`Removing item with ${this.idField} = ${id}`);
    return true;
  }
}

/**
 * Get Item Data implementation
 */
export class GetItemData<T> implements IRepositoryService<T | T[] | undefined> {
  private collection: T[];
  private idField: string;
  
  constructor(collection: T[], idField = 'id') {
    this.collection = collection;
    this.idField = idField;
  }
  
  async execute(id?: any): Promise<T | T[] | undefined> {
    if (id === undefined) {
      // Return all items
      return this.collection;
    } else {
      // Return item by id
      // In TypeScript, we need to use index access for dynamic property
      return this.collection.find(item => (item as any)[this.idField] === id);
    }
  }
}

/**
 * Write Item Data implementation
 */
export class WriteItemData<T> implements IRepositoryService<T> {
  private collection: T[];
  private idField: string;
  
  constructor(collection: T[], idField = 'id') {
    this.collection = collection;
    this.idField = idField;
  }
  
  async execute(id: any, updatedData: Partial<T>): Promise<T> {
    // In a real app, this would update the database
    console.log(`Updating item with ${this.idField} = ${id}`, updatedData);
    
    // Just return the updated data as mock
    return { ...(id as any), ...updatedData } as T;
  }
}

/**
 * Repository Controller
 * Acts as a facade to the repository services
 */
export class RepositoryController {
  // Product repositories
  private getProductRepo: GetItemData<Product>;
  private addProductRepo: AddItem<Product>;
  private removeProductRepo: RemoveItem<Product>;
  private writeProductRepo: WriteItemData<Product>;
  
  // Order repositories
  private getOrderRepo: GetItemData<Order>;
  private addOrderRepo: AddItem<Order>;
  private updateOrderRepo: WriteItemData<Order>;
  
  constructor() {
    // Initialize repositories with mock data
    this.getProductRepo = new GetItemData<Product>(mockProducts);
    this.addProductRepo = new AddItem<Product>(mockProducts);
    this.removeProductRepo = new RemoveItem<Product>(mockProducts);
    this.writeProductRepo = new WriteItemData<Product>(mockProducts);
    
    this.getOrderRepo = new GetItemData<Order>(mockOrders);
    this.addOrderRepo = new AddItem<Order>(mockOrders);
    this.updateOrderRepo = new WriteItemData<Order>(mockOrders);
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return this.getProductRepo.execute() as Promise<Product[]>;
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.getProductRepo.execute(id) as Promise<Product | undefined>;
  }
  
  async addProduct(product: Product): Promise<Product> {
    return this.addProductRepo.execute(product);
  }
  
  async removeProduct(id: number): Promise<boolean> {
    return this.removeProductRepo.execute(id);
  }
  
  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    return this.writeProductRepo.execute(id, data);
  }
  
  // Order methods
  async getOrders(): Promise<Order[]> {
    return this.getOrderRepo.execute() as Promise<Order[]>;
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.getOrderRepo.execute(id) as Promise<Order | undefined>;
  }
  
  async addOrder(order: Order): Promise<Order> {
    return this.addOrderRepo.execute(order);
  }
  
  async updateOrder(id: number, data: Partial<Order>): Promise<Order> {
    return this.updateOrderRepo.execute(id, data);
  }
}
