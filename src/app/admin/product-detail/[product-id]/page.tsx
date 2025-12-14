// Product details (Product Service)

"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit2, Trash2, Package, TrendingUp, TrendingDown, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { mockProducts, mockStockHistory, getProductById } from "@/hooks/mock-data"

export default function AdminProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params["product-id"] as string

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Find the product
  const product = getProductById(productId)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/admin">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    // TODO: Implement delete logic
    console.log("Delete product:", productId)
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 md:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-sm text-gray-600">SKU: {product.sku}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/crud-product?edit=${productId}`}>
                <Button variant="outline">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Product
                </Button>
              </Link>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
                Delete Product
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-6 py-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image & Basic Info */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6 p-6">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {product.category.charAt(0) + product.category.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">${product.price}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.rating}.0)</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Product ID</span>
                      <span className="font-medium text-gray-900">{product.id}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">SKU</span>
                      <span className="font-medium text-gray-900">{product.sku}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Created</span>
                      <span className="font-medium text-gray-900">{product.createdAt}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium text-gray-900">{product.updatedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Stock History</h3>
              <div className="space-y-3">
                {mockStockHistory.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-4 pb-3 border-b border-gray-100 last:border-0">
                    <div
                      className={`p-2 rounded-lg ${entry.type === "ADD" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                    >
                      {entry.type === "ADD" ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">
                          {entry.type === "ADD" ? "+" : ""}
                          {entry.quantity} units
                        </span>
                        <span className="text-sm text-gray-500">{entry.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{entry.notes}</p>
                      <p className="text-xs text-gray-500 mt-1">By: {entry.performedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stock & Stats */}
          <div className="space-y-6">
            {/* Current Stock */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Current Stock</h3>
              <div className="text-center py-6">
                <div
                  className={`text-5xl font-bold mb-2 ${
                    product.stock > 20 ? "text-green-600" : product.stock > 10 ? "text-yellow-600" : "text-red-600"
                  }`}
                >
                  {product.stock}
                </div>
                <p className="text-gray-600">units available</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Add Stock
                </Button>
                <Button className="flex-1" variant="outline">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Stock Level</span>
                    <span
                      className={`text-sm font-semibold ${
                        product.stock > 20 ? "text-green-600" : product.stock > 10 ? "text-yellow-600" : "text-red-600"
                      }`}
                    >
                      {product.stock > 20 ? "Good" : product.stock > 10 ? "Low" : "Critical"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        product.stock > 20 ? "bg-green-500" : product.stock > 10 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Stock</span>
                    <span className="font-medium text-gray-900">{product.stock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reserved</span>
                    <span className="font-medium text-gray-900">0 units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available</span>
                    <span className="font-medium text-green-600">{product.stock} units</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-lg font-bold text-gray-900">127</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-lg font-bold text-gray-900">${(product.price * 127).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Sale</p>
                    <p className="text-lg font-bold text-gray-900">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
