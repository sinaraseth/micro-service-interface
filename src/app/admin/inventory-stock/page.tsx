// Manage stock (Inventory Service)

"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, TrendingUp, TrendingDown, AlertCircle, Package, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockProducts, ProductCategory, mockStockHistory } from "@/hooks/mock-data"

export default function InventoryStockPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "ALL">("ALL")
  const [showAddStockModal, setShowAddStockModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [stockAmount, setStockAmount] = useState("")

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "ALL" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate stats
  const totalProducts = mockProducts.length
  const lowStockProducts = mockProducts.filter((p) => p.stock <= 10).length
  const totalStockValue = mockProducts.reduce((sum, p) => sum + p.price * p.stock, 0)

  const handleAddStock = () => {
    if (selectedProduct && stockAmount) {
      // TODO: Implement API call
      console.log("Add stock:", { productId: selectedProduct, amount: parseInt(stockAmount) })
      setShowAddStockModal(false)
      setSelectedProduct(null)
      setStockAmount("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 md:px-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-sm text-gray-600 mt-1">Monitor and manage product stock levels</p>
            </div>
            <Link href="/admin">
              <Button variant="outline">Back to Products</Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Products</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{totalProducts}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Low Stock Items</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">{lowStockProducts}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Stock Value</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">${totalStockValue.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | "ALL")}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Filter by category"
            >
              <option value="ALL">All Categories</option>
              {Object.values(ProductCategory).map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0) + category.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Stock Table */}
      <div className="px-6 py-8 md:px-12">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">${product.price}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                        {product.category.charAt(0) + product.category.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{product.stock} units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          product.stock > 20
                            ? "bg-green-100 text-green-800"
                            : product.stock > 10
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock > 20 ? "Good" : product.stock > 10 ? "Low" : "Critical"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(product.stock * product.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProduct(product.id)
                          setShowAddStockModal(true)
                        }}
                      >
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Add Stock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock History Section */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Stock Movements</h2>
          <div className="space-y-3">
            {mockStockHistory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${entry.type === "ADD" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                  >
                    {entry.type === "ADD" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {entry.type === "ADD" ? "+" : ""}
                      {entry.quantity} units - {entry.notes}
                    </p>
                    <p className="text-xs text-gray-500">
                      {entry.date} • By {entry.performedBy}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Stock</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={stockAmount}
                  onChange={(e) => setStockAmount(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter quantity"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddStockModal(false)
                  setSelectedProduct(null)
                  setStockAmount("")
                }}
              >
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary-dark text-white" onClick={handleAddStock}>
                Add Stock
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}