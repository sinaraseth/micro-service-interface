// Order detail/tracking (Order Service)

"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, Clock, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getOrderById, OrderStatus } from "@/hooks/mock-data"

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params["order-id"] as string

  const order = getOrderById(orderId)

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link href="/users">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 1
      case OrderStatus.CONFIRMED:
        return 2
      case OrderStatus.COMPLETED:
        return 3
      default:
        return 0
    }
  }

  const currentStep = getStatusStep(order.status)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 md:px-12">
          <div className="flex items-center justify-between">
            <Link href="/home" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-sm"></div>
              <span className="text-xl font-semibold text-primary">Luxe Store</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Order Confirmation */}
      <div className="px-6 py-8 md:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg">
              Thank you for your order. We'll send a confirmation email shortly.
            </p>
            <p className="text-sm text-gray-500 mt-4">Order ID: {order.id}</p>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Order Status</h2>
            <div className="relative">
              <div className="flex justify-between items-center mb-8">
                {/* Step 1: Pending */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      currentStep >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium ${currentStep >= 1 ? "text-gray-900" : "text-gray-400"}`}>
                    Order Placed
                  </span>
                </div>

                {/* Connector Line */}
                <div className="flex-1 h-1 bg-gray-200 relative top-[-20px]">
                  <div
                    className={`h-full transition-all ${currentStep >= 2 ? "bg-primary" : "bg-gray-200"}`}
                    style={{ width: currentStep >= 2 ? "100%" : "0%" }}
                  ></div>
                </div>

                {/* Step 2: Confirmed */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      currentStep >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Package className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium ${currentStep >= 2 ? "text-gray-900" : "text-gray-400"}`}>
                    Confirmed
                  </span>
                </div>

                {/* Connector Line */}
                <div className="flex-1 h-1 bg-gray-200 relative top-[-20px]">
                  <div
                    className={`h-full transition-all ${currentStep >= 3 ? "bg-primary" : "bg-gray-200"}`}
                    style={{ width: currentStep >= 3 ? "100%" : "0%" }}
                  ></div>
                </div>

                {/* Step 3: Completed */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      currentStep >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium ${currentStep >= 3 ? "text-gray-900" : "text-gray-400"}`}>
                    Delivered
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>
            
            {/* Customer Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-600">Name:</span>{" "}
                  <span className="font-medium">{order.customerName}</span>
                </p>
                <p>
                  <span className="text-gray-600">Email:</span>{" "}
                  <span className="font-medium">{order.customerEmail}</span>
                </p>
                <p>
                  <span className="text-gray-600">Order Date:</span>{" "}
                  <span className="font-medium">{order.orderDate}</span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
  )
}
