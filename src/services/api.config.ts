const API_BASE_URL = "/api";

// API Response Types
export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
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

  static async getProducts(page: number = 1): Promise<PaginatedResponse<ApiProduct>> {
    try {
      console.log(`Fetching products from: ${this.baseUrl}?page=${page}`);

      const response = await fetch(`${this.baseUrl}?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Products data:", data);

      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  static async getProductById(id: string): Promise<ApiProduct> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return response.json();
  }

  static async createProduct(data: FormData | any): Promise<ApiProduct> {
    const isFormData = data instanceof FormData;
    
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create product");
    }

    return response.json();
  }

  static async updateProduct(id: string, data: FormData | any): Promise<ApiProduct> {
    const isFormData = data instanceof FormData;
    
    // Add _method field for Laravel to handle FormData as PUT
    if (isFormData) {
      data.append("_method", "PUT");
    }
    
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: isFormData ? "POST" : "PUT", // Use POST for FormData
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update product");
    }

    return response.json();
  }

  static async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
  }
}

// Inventory Service (for stock management)
export class InventoryService {
  private static baseUrl = `${API_BASE_URL}/stock`;
  private static inventoryUrl = `${API_BASE_URL}/inventory`;

  static async getInventory(): Promise<any> {
    const response = await fetch(this.inventoryUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch inventory");
    }

    return response.json();
  }

  static async createInventory(productId: string, quantity: number): Promise<any> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, quantity }),
    });

    if (!response.ok) {
      throw new Error("Failed to create inventory");
    }

    return response.json();
  }

  static async addStock(productId: string, quantity: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${productId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error("Failed to add stock");
    }

    return response.json();
  }

  static async deductStock(productId: string, quantity: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${productId}/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error("Failed to deduct stock");
    }

    return response.json();
  }

  static async getStockHistory(productId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${productId}/history`);

    if (!response.ok) {
      return { data: [] };
    }

    return response.json();
  }
}

// Order Service
export class OrderService {
  private static baseUrl = `${API_BASE_URL}/orders`;

  static async createOrder(orderData: any): Promise<any> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create order");
    }

    return response.json();
  }

  static async getOrderById(orderId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${orderId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch order");
    }

    return response.json();
  }
}

// Helper function to convert API product to local product format
export const mapApiProductToLocal = (apiProduct: ApiProduct | any) => {
  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name,
    description: apiProduct.description || "",
    price: parseFloat(apiProduct.price),
    image: apiProduct.image || "/placeholder.svg",
    stock: apiProduct.stock,
    sku: apiProduct.sku,
    createdAt: apiProduct.created_at,
    updatedAt: apiProduct.updated_at,
  };
};
