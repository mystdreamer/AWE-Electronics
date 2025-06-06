import { Product, User, Order, Receipt } from '@shared/schema';

// 👤 Users (1 customer, 1 employee)
export const mockUsers: User[] = [
  {
    id: 1,
    username: 'customer1',
    password: 'pass123',
    name: 'Jane Doe',
    role: 'customer',
  },
  {
    id: 2,
    username: 'employee1',
    password: 'pass456',
    name: 'John Admin',
    role: 'employee',
  },
];

// 📦 Products
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Rovin 100Ah Lithium Battery',
    description: 'High-capacity Deep Cycle Lithium Battery',
    price: 399.99,
    image: 'https://via.placeholder.com/150',
    category: 'Power & Batteries',
    stock: 12,
  },
  {
    id: 2,
    name: 'Gaming Mouse',
    description: 'Ergonomic gaming mouse with RGB lighting',
    price: 89.95,
    image: 'https://via.placeholder.com/150',
    category: 'Peripherals',
    stock: 30,
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with customizable keys',
    price: 129.99,
    image: 'https://via.placeholder.com/150',
    category: 'Peripherals',
    stock: 15,
  },
];

// 🧾 Orders
export const mockOrders: Order[] = [
  {
    id: 1,
    userId: 1,
    orderNumber: 'ORD-10001',
    status: 'Processing',
    items: [
      { productId: 1, name: 'Wireless Keyboard', price: 129.99, quantity: 1, image: '' },
      { productId: 2, name: 'Gaming Mouse', price: 89.95, quantity: 2, image: '' },
    ],
    shippingAddress: '123 Main Street, Melbourne, VIC 3000',
    paymentMethod: 'Credit Card',
    total: 219.94,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 🧾 Receipts
export const mockReceipts: Receipt[] = [
  {
    id: 1,
    orderId: 1,
    receiptNumber: 'RCT-10001',
    amount: 199.89,
    paymentMethod: 'Credit Card',
    createdAt: new Date().toISOString(),
  },
];
