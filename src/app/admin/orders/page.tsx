// View all orders (Order Service)

"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Eye, ShoppingBag, Clock, CheckCircle, XCircle, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockOrders, OrderStatus } from "@/hooks/mock-data"

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">("ALL")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  // Filter orders
  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "ALL" || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const totalOrders = mockOrders.length
  const pendingOrders = mockOrders.filter((o) => o.status === OrderStatus.PENDING).length
  const completedOrders = mockOrders.filter((o) => o.status === OrderStatus.COMPLETED).length
  const totalRevenue = mockOrders
    .filter((o) => o.status === OrderStatus.COMPLETED)
    .reduce((sum, o) => sum + o.total, 0)

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="w-5 h-5" />
      case OrderStatus.CONFIRMED:
        return <ShoppingBag className="w-5 h-5" />
      case OrderStatus.COMPLETED:
        return <CheckCircle className="w-5 h-5" />
      case OrderStatus.CANCELLED:
        return <XCircle className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800"
      case OrderStatus.CONFIRMED:
        return "bg-blue-100 text-blue-800"
      case OrderStatus.COMPLETED:
        return "bg-green-100 text-green-800"
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800"
    }
  }

  const selectedOrderDetails = mockOrders.find((o) => o.id === selectedOrder)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 md:px-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <p className="text-sm text-gray-600 mt-1">View and manage customer orders</p>
            </div>
            <Link href="/admin">
              <Button variant="outline">Back to Products</Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{totalOrders}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900 mt-1">{pendingOrders}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">{completedOrders}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Revenue</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">${totalRevenue.toLocaleString()}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                aria-label="Filter orders by status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | "ALL")}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Status</option>
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Orders Table */}
      <div className="px-6 py-8 md:px-12">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.items.length} items</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">${order.total}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full inline-flex items-center gap-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order.id)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && selectedOrderDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
                <p className="text-sm text-gray-600">{selectedOrderDetails.id}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            {/* Customer Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-600">Name:</span> <span className="font-medium">{selectedOrderDetails.customerName}</span>
                </p>
                <p>
                  <span className="text-gray-600">Email:</span> <span className="font-medium">{selectedOrderDetails.customerEmail}</span>
                </p>
                <p>
                  <span className="text-gray-600">Order Date:</span> <span className="font-medium">{selectedOrderDetails.orderDate}</span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
              <div className="space-y-3">
                {selectedOrderDetails.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">${item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary">${selectedOrderDetails.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full inline-flex items-center gap-2 ${getStatusColor(selectedOrderDetails.status)}`}>
                  {getStatusIcon(selectedOrderDetails.status)}
                  {selectedOrderDetails.status.charAt(0) + selectedOrderDetails.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedOrderDetails.status === OrderStatus.PENDING && (
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Order
                </Button>
                <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}