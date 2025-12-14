// View all products (Product Service)

"use client"

import Link from "next/link"
import { Search, Filter, Plus, Edit, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { mockProducts, ProductCategory } from "@/hooks/mock-data"

export default function AdminProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "ALL">("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter products based on category and search
  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory = selectedCategory === "ALL" || product.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Get product count by category
  const getCategoryCount = (category: ProductCategory | "ALL") => {
    if (category === "ALL") return mockProducts.length
    return mockProducts.filter((p) => p.category === category).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 md:px-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your store inventory and products</p>
            </div>
            <Link href="/admin/crud-product">
              <Button className="bg-primary hover:bg-primary-dark text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 md:px-12">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === "ALL"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Products ({getCategoryCount("ALL")})
          </button>
          {Object.values(ProductCategory).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.charAt(0) + category.slice(1).toLowerCase()} ({getCategoryCount(category)})
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-6 py-8 md:px-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 overflow-hidden relative group">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          product.stock > 20
                            ? "bg-green-100 text-green-800"
                            : product.stock > 10
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                        {product.category.charAt(0) + product.category.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">${product.price}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link href={`/admin/product-detail/${product.id}`} className="flex-1">
                        <Button variant="outline" className="w-full text-sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
