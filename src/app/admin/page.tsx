"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, Plus, Edit, Trash2, Package, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCategory } from "@/hooks/mock-data"
import { ProductService, mapApiProductToLocal, ApiProduct } from "@/services/api.config"
import Snowfall from "react-snowfall"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "ALL">("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch products from API
  useEffect(() => {
    fetchProducts()
  }, [currentPage])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ProductService.getProducts(currentPage)
      
      // Map API products to local format
      const mappedProducts = response.data.map(mapApiProductToLocal)
      setProducts(mappedProducts)
      setTotalPages(response.last_page)
    } catch (err) {
      setError("Failed to load products. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Filter products based on category and search
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "ALL" || product.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Get product count by category
  const getCategoryCount = (category: ProductCategory | "ALL") => {
    if (category === "ALL") return products.length
    return products.filter((p) => p.category === category).length
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await ProductService.deleteProduct(productId)
      alert("Product deleted successfully!")
      fetchProducts() // Refresh the list
    } catch (err) {
      alert("Failed to delete product. Please try again.")
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchProducts}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Snowfall
        color="#FFFFFF"
        snowflakeCount={200}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 1,
        }}
      />
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 md:px-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your product inventory</p>
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
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/admin/product-detail/${product.id}`}>
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Link href={`/admin/product-detail/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-primary">{product.name}</h3>
                      </Link>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                        {product.category.charAt(0) + product.category.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
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
                    <div className="flex gap-2">
                      <Link href={`/admin/crud-product?edit=${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}