const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ||
  "http://wgss0wws0osco4o48soo4kko.34.87.12.222.sslip.io/api/v1";

// API Response Types
export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  sku: string;
  stock: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  image?: string;
  category?: string;
  rating?: number;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    active: boolean;
    label: string;
    page: number | null;
    url: string | null;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Product Service
export class ProductService {
  private static baseUrl = `${API_BASE_URL}/products`;

  // Get all products with pagination
  static async getProducts(
    page: number = 1
  ): Promise<PaginatedResponse<ApiProduct>> {
    try {
      const response = await fetch(`${this.baseUrl}?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  // Get single product by ID
  static async getProductById(id: string): Promise<ApiProduct> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  // Create new product
  static async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    sku: string;
    stock: number;
    category?: string;
    image?: string;
    rating?: number;
  }): Promise<ApiProduct> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(
    id: string,
    productData: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
      category?: string;
      image?: string;
      rating?: number;
      is_active?: number;
    }>
  ): Promise<ApiProduct> {
    try {
      console.log("API: Updating product", id, productData);

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(productData),
      });

      const responseText = await response.text();
      console.log("API: Update response status", response.status);
      console.log("API: Update response body", responseText);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          // Response is not JSON
        }
        throw new Error(
          errorData.message ||
            `Failed to update product: ${response.statusText}`
        );
      }

      const data = JSON.parse(responseText);
      return data.data || data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}

// Inventory Service (for stock management)
export class InventoryService {
  private static baseUrl = `${API_BASE_URL}/inventory`;

  // Add stock
  static async addStock(productId: string, quantity: number): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add stock: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding stock:", error);
      throw error;
    }
  }

  // Deduct stock
  static async deductStock(productId: string, quantity: number): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/deduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to deduct stock: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deducting stock:", error);
      throw error;
    }
  }

  // Get stock history
  static async getStockHistory(productId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/history/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch stock history: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching stock history:", error);
      throw error;
    }
  }
}

// Order Service
export class OrderService {
  private static baseUrl = `${API_BASE_URL}/orders`;

  // Create order
  static async createOrder(orderData: {
    customer_name: string;
    customer_email: string;
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
    }>;
    total: number;
  }): Promise<any> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  // Get all orders
  static async getOrders(page: number = 1): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  // Get order by ID
  static async getOrderById(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(id: string, status: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update order status: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }
}

// Helper function to convert API product to local product format
export const mapApiProductToLocal = (apiProduct: ApiProduct) => {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: parseFloat(apiProduct.price),
    sku: apiProduct.sku,
    stock: apiProduct.stock,
    image: apiProduct.image || "/placeholder.svg",
    category: apiProduct.category || "FURNITURE",
    rating: apiProduct.rating || 5,
    isActive: apiProduct.is_active === 1,
    createdAt: apiProduct.created_at,
    updatedAt: apiProduct.updated_at,
  };
};
