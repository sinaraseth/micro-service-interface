// Product Categories
export enum ProductCategory {
  FURNITURE = "FURNITURE",
  DECOR = "DECOR",
  LIGHTING = "LIGHTING",
  TEXTILES = "TEXTILES",
  ACCESSORIES = "ACCESSORIES",
}

// Product Interface
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  image: string
  rating: number
  stock: number
  sku?: string
  createdAt?: string
  updatedAt?: string
}

// Stock History Interface
export interface StockHistoryEntry {
  id: number
  type: "ADD" | "DEDUCT"
  quantity: number
  date: string
  performedBy: string
  notes: string
}

// Mock Products Data
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Cushion",
    description: "Luxurious velvet cushion with premium filling",
    price: 89,
    category: ProductCategory.TEXTILES,
    image: "/images.jpg",
    rating: 5,
    stock: 45,
    sku: "TXT-CUSH-001",
    createdAt: "2024-11-15",
    updatedAt: "2024-12-10",
  },
  {
    id: "2",
    name: "Wooden Side Table",
    description: "Handcrafted oak side table with modern design",
    price: 249,
    category: ProductCategory.FURNITURE,
    image: "/images (1).jpg",
    rating: 5,
    stock: 12,
    sku: "FRN-TABL-002",
    createdAt: "2024-10-20",
    updatedAt: "2024-12-08",
  },
  {
    id: "3",
    name: "Designer Rug",
    description: "Hand-woven wool rug with geometric patterns",
    price: 399,
    category: ProductCategory.TEXTILES,
    image: "/images (2).jpg",
    rating: 5,
    stock: 8,
    sku: "TXT-RUG-003",
    createdAt: "2024-09-05",
    updatedAt: "2024-12-05",
  },
  {
    id: "4",
    name: "Modern Pendant Light",
    description: "Elegant brass pendant light fixture",
    price: 179,
    category: ProductCategory.LIGHTING,
    image: "/placeholder.svg",
    rating: 4,
    stock: 23,
    sku: "LGT-PEND-004",
    createdAt: "2024-11-01",
    updatedAt: "2024-12-09",
  },
  {
    id: "5",
    name: "Ceramic Vase Set",
    description: "Set of 3 handmade ceramic vases",
    price: 129,
    category: ProductCategory.DECOR,
    image: "/placeholder.svg",
    rating: 5,
    stock: 31,
    sku: "DCR-VASE-005",
    createdAt: "2024-10-15",
    updatedAt: "2024-12-07",
  },
  {
    id: "6",
    name: "Leather Armchair",
    description: "Premium leather armchair with solid wood frame",
    price: 899,
    category: ProductCategory.FURNITURE,
    image: "/placeholder.svg",
    rating: 5,
    stock: 5,
    sku: "FRN-ARMCH-006",
    createdAt: "2024-08-20",
    updatedAt: "2024-12-06",
  },
  {
    id: "7",
    name: "Wall Mirror Set",
    description: "Set of 3 decorative wall mirrors",
    price: 159,
    category: ProductCategory.DECOR,
    image: "/placeholder.svg",
    rating: 4,
    stock: 18,
    sku: "DCR-MIRR-007",
    createdAt: "2024-11-10",
    updatedAt: "2024-12-11",
  },
  {
    id: "8",
    name: "Table Lamp",
    description: "Contemporary table lamp with fabric shade",
    price: 89,
    category: ProductCategory.LIGHTING,
    image: "/placeholder.svg",
    rating: 4,
    stock: 27,
    sku: "LGT-LAMP-008",
    createdAt: "2024-09-25",
    updatedAt: "2024-12-04",
  },
  {
    id: "9",
    name: "Brass Bookends",
    description: "Decorative brass bookends with geometric design",
    price: 69,
    category: ProductCategory.ACCESSORIES,
    image: "/placeholder.svg",
    rating: 5,
    stock: 42,
    sku: "ACC-BOOK-009",
    createdAt: "2024-10-30",
    updatedAt: "2024-12-03",
  },
]

// Mock stock history data
export const mockStockHistory: StockHistoryEntry[] = [
  { id: 1, type: "ADD", quantity: 50, date: "2024-12-10", performedBy: "Admin", notes: "Initial stock" },
  { id: 2, type: "DEDUCT", quantity: -5, date: "2024-12-09", performedBy: "System", notes: "Order #1234" },
  { id: 3, type: "ADD", quantity: 10, date: "2024-12-08", performedBy: "Admin", notes: "Restock" },
  { id: 4, type: "DEDUCT", quantity: -8, date: "2024-12-07", performedBy: "System", notes: "Order #1235" },
  { id: 5, type: "DEDUCT", quantity: -2, date: "2024-12-06", performedBy: "System", notes: "Order #1236" },
]

// Helper function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((p) => p.id === id)
}

// Helper function to get products by category
export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return mockProducts.filter((p) => p.category === category)
}

// Helper function to get stock history for a product (in a real app, this would be product-specific)
export const getStockHistoryByProductId = (productId: string): StockHistoryEntry[] => {
  // For now, return the same history for all products
  // In a real app, this would filter by productId
  return mockStockHistory
}


// Order Status Enum
export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// Order Interface
export interface Order {
  id: string
  customerName: string
  customerEmail: string
  orderDate: string
  status: OrderStatus
  total: number
  items: OrderItem[]
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    orderDate: "2024-12-11",
    status: OrderStatus.COMPLETED,
    total: 338,
    items: [
      { productId: "1", productName: "Premium Cushion", quantity: 2, price: 89 },
      { productId: "5", productName: "Ceramic Vase Set", quantity: 1, price: 129 },
    ],
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    orderDate: "2024-12-10",
    status: OrderStatus.CONFIRMED,
    total: 648,
    items: [
      { productId: "2", productName: "Wooden Side Table", quantity: 1, price: 249 },
      { productId: "3", productName: "Designer Rug", quantity: 1, price: 399 },
    ],
  },
  {
    id: "ORD-003",
    customerName: "Bob Johnson",
    customerEmail: "bob@example.com",
    orderDate: "2024-12-10",
    status: OrderStatus.PENDING,
    total: 179,
    items: [{ productId: "4", productName: "Modern Pendant Light", quantity: 1, price: 179 }],
  },
  {
    id: "ORD-004",
    customerName: "Alice Williams",
    customerEmail: "alice@example.com",
    orderDate: "2024-12-09",
    status: OrderStatus.COMPLETED,
    total: 1798,
    items: [
      { productId: "6", productName: "Leather Armchair", quantity: 2, price: 899 },
    ],
  },
  {
    id: "ORD-005",
    customerName: "Charlie Brown",
    customerEmail: "charlie@example.com",
    orderDate: "2024-12-09",
    status: OrderStatus.CONFIRMED,
    total: 427,
    items: [
      { productId: "7", productName: "Wall Mirror Set", quantity: 1, price: 159 },
      { productId: "8", productName: "Table Lamp", quantity: 2, price: 89 },
      { productId: "9", productName: "Brass Bookends", quantity: 1, price: 69 },
    ],
  },
]

// Helper function to get order by ID
export const getOrderById = (id: string): Order | undefined => {
  return mockOrders.find((o) => o.id === id)
}

// Helper function to get orders by status
export const getOrdersByStatus = (status: OrderStatus): Order[] => {
  return mockOrders.filter((o) => o.status === status)
}

// Cart Interface
export interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
}

// Mock Cart (in real app, this would be in localStorage or context)
export let mockCart: CartItem[] = []

// Cart Helper Functions
export const addToCart = (product: Product, quantity: number = 1) => {
  const existingItem = mockCart.find((item) => item.productId === product.id)
  
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    mockCart.push({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      image: product.image,
    })
  }
}

export const removeFromCart = (productId: string) => {
  mockCart = mockCart.filter((item) => item.productId !== productId)
}

export const updateCartQuantity = (productId: string, quantity: number) => {
  const item = mockCart.find((item) => item.productId === productId)
  if (item) {
    item.quantity = quantity
  }
}

export const clearCart = () => {
  mockCart = []
}

export const getCartTotal = () => {
  return mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export const getCartItemCount = () => {
  return mockCart.reduce((sum, item) => sum + item.quantity, 0)
}