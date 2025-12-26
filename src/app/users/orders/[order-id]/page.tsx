"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderService } from "@/services/api.config";

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

type OrderDetail = {
  id: string;
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params["order-id"] as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await OrderService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The order you're looking for doesn't exist."}</p>
          <Link href="/users">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const orderTotal = Number(order.total) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 md:px-12">
          <div className="flex items-center justify-between">
            <Link href="/home" className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Luxe Store" className="h-11 w-auto" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="px-6 py-8 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg">
              Thank you for your order. We'll send a confirmation email shortly.
            </p>
            <p className="text-sm text-gray-500 mt-4">Order ID: {order.id}</p>
          </div>


          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-600">Name:</span>{" "}
                  <span className="font-medium">{order.fullName}</span>
                </p>
                <p>
                  <span className="text-gray-600">Email:</span>{" "}
                  <span className="font-medium">{order.email}</span>
                </p>
                <p>
                  <span className="text-gray-600">Order Date:</span>{" "}
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={`${item.productId}-${item.quantity}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Product {item.productId}</p>
                      <p className="text-sm text-gray-600">
                        ${item.price} A- {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/users" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/home" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary-dark text-white">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
