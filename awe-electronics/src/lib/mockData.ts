import {
  User,
  Product,
  Order,
  Shipment,
  Receipt,
  Statistics,
  CartItem
} from "@shared/schema";

type TopSellingProduct = {
  id: number;
  name: string;
  quantity: number;
};

// Users
export const mockUsers: User[] = [
  {
    id: 1,
    username: "customer1",
    password: "pass123",
    name: "Alice Customer",
    role: "customer"
  },
  {
    id: 2,
    username: "employee1",
    password: "pass456",
    name: "Bob Manager",
    role: "employee"
  }
];

// Fallback image for products
const fallbackImage = "/images/fallback.png";

// Products (Only 2 categories: Components and Tools)
export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Soldering Station Kit",
    description: "60W adjustable soldering iron kit for electronics work.",
    price: 89.95,
    image: fallbackImage,
    category: "Tools",
    stock: 12
  },
  {
    id: 2,
    name: "Arduino-Compatible UNO Board",
    description: "ATmega328-based microcontroller board for prototyping projects.",
    price: 39.95,
    image: fallbackImage,
    category: "Components",
    stock: 25
  },
  {
    id: 3,
    name: "Digital Multimeter",
    description: "Auto-ranging digital multimeter with voltage, current, and continuity functions.",
    price: 59.99,
    image: fallbackImage,
    category: "Tools",
    stock: 18
  },
  {
    id: 4,
    name: "Raspberry Pi 4 Model B (4GB)",
    description: "Single-board computer with 4GB RAM and dual micro-HDMI.",
    price: 129.00,
    image: fallbackImage,
    category: "Components",
    stock: 10
  },
  {
    id: 5,
    name: "Jumper Wire Set",
    description: "120-piece jumper wire kit (male/male, male/female, female/female).",
    price: 9.95,
    image: fallbackImage,
    category: "Components",
    stock: 50
  }
];

// Orders
export const mockOrders: Order[] = [
  {
    id: 1,
    userId: 1,
    orderNumber: "ORD-70001",
    status: "Delivered",
    items: [
      {
        productId: 1,
        name: "Soldering Station Kit",
        price: 89.95,
        quantity: 1,
        image: mockProducts[0].image
      },
      {
        productId: 2,
        name: "Arduino-Compatible UNO Board",
        price: 39.95,
        quantity: 2,
        image: mockProducts[1].image
      }
    ],
    shippingAddress: "123 Maker Street, Melbourne, VIC 3000",
    paymentMethod: "Credit Card",
    total: 89.95 + 2 * 39.95,
    createdAt: new Date("2024-10-01").toISOString(),
    updatedAt: new Date("2024-10-02").toISOString()
  },
  {
    id: 2,
    userId: 1,
    orderNumber: "ORD-70002",
    status: "Shipped",
    items: [
      {
        productId: 5,
        name: "Jumper Wire Set",
        price: 9.95,
        quantity: 3,
        image: mockProducts[4].image
      },
      {
        productId: 3,
        name: "Digital Multimeter",
        price: 59.99,
        quantity: 1,
        image: mockProducts[2].image
      }
    ],
    shippingAddress: "123 Maker Street, Melbourne, VIC 3000",
    paymentMethod: "PayPal",
    total: 3 * 9.95 + 59.99,
    createdAt: new Date("2024-10-03").toISOString(),
    updatedAt: new Date("2024-10-04").toISOString()
  }
];

// Shipments
export const mockShipments: Shipment[] = [
  {
    id: 1,
    orderId: 1,
    status: "Delivered",
    trackingNumber: "TRK-JAY123",
    carrier: "Australia Post",
    createdAt: new Date("2024-10-02").toISOString(),
    updatedAt: new Date("2024-10-04").toISOString()
  },
  {
    id: 2,
    orderId: 2,
    status: "In Transit",
    trackingNumber: "TRK-JAY456",
    carrier: "StarTrack",
    createdAt: new Date("2024-10-04").toISOString(),
    updatedAt: new Date("2024-10-05").toISOString()
  }
];

// Receipts
export const mockReceipts: Receipt[] = [
  {
    id: 1,
    orderId: 1,
    receiptNumber: "RCT-70001",
    amount: 169.85,
    paymentMethod: "Credit Card",
    createdAt: new Date("2024-10-01").toISOString()
  },
  {
    id: 2,
    orderId: 2,
    receiptNumber: "RCT-70002",
    amount: 89.84,
    paymentMethod: "PayPal",
    createdAt: new Date("2024-10-03").toISOString()
  }
];

// Statistics
export const mockStatistics: Omit<Statistics, "topSellingProducts"> & { topSellingProducts: TopSellingProduct[] } = {
  id: 1,
  ordersCount: 52,
  totalRevenue: 14325.80,
  averageOrderValue: 275.50,
  topSellingProducts: [
    { id: 2, name: "Arduino-Compatible UNO Board", quantity: 40 },
    { id: 5, name: "Jumper Wire Set", quantity: 38 },
    { id: 3, name: "Digital Multimeter", quantity: 28 }
  ],
  updatedAt: new Date().toISOString()
};

// Cart Items (for demo/testing)
export const mockCartItems: CartItem[] = [
  {
    productId: 4,
    quantity: 1,
    name: mockProducts[3].name,
    price: mockProducts[3].price,
    image: mockProducts[3].image
  },
  {
    productId: 5,
    quantity: 2,
    name: mockProducts[4].name,
    price: mockProducts[4].price,
    image: mockProducts[4].image
  }
];
