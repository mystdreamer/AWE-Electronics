// === USER (used by Facade for authentication) ===
export type UserRole = "customer" | "employee";

export interface User {
  id: number;
  username: string;
  password: string; // used only for mock login
  name: string;
  role: UserRole;
}

// === PRODUCT (used in Repository pattern & Catalogue) ===
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

// === CART (used by UserOperationFacade) ===
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  updatedAt: string;
}

// === ORDER (created by Customer, read by Observers) ===
export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  status: string;
  items: CartItem[];
  shippingAddress: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// === SHIPMENT (created by ShipmentObserver) ===
export interface Shipment {
  id: number;
  orderId: number;
  status: string;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  updatedAt: string;
}

// === RECEIPT (created by ReceiptObserver) ===
export interface Receipt {
  id: number;
  orderId: number;
  receiptNumber: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
}

// === STATISTICS (updated by StatisticsObserver) ===
export interface Statistics {
  id: number;
  ordersCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingProducts: Product[];
  updatedAt: string;
}
