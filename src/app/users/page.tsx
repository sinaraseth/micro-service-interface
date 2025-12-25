// Browse all products (Product Service)

"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  mockProducts,
  ProductCategory,
  addToCart,
  getCartItemCount,
} from "@/hooks/mock-data";

export default function UserProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "ALL"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(getCartItemCount());

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "ALL" || product.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && product.stock > 0; // Only show in-stock items
  });

  const handleAddToCart = (product: (typeof mockProducts)[0]) => {
    addToCart(product, 1);
    setCartCount(getCartItemCount());
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 md:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/home" className="flex items-center gap-2">
                <img src="/logo.jpg" alt="Luxe Store" className="h-11 w-auto" />
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/users/cart">
                <Button variant="outline" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-6 md:px-12">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Browse Products
            </h1>
            <p className="text-gray-600 mt-2">
              Discover our carefully curated collection
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
            All Products
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
              {category.charAt(0) + category.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-6 py-8 md:px-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/users/product-detail/${product.id}`}>
                    <div className="aspect-[5/3] relative overflow-hidden bg-gray-100">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                      {/* Stock Badge Overlay */}
                      <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-gray-200">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              product.stock > 20
                                ? "bg-green-500"
                                : product.stock > 10
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className="text-xs font-semibold text-gray-700">
                            {product.stock} left
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Link href={`/users/product-detail/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-primary">
                          {product.name}
                        </h3>
                      </Link>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                        {product.category.charAt(0) +
                          product.category.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < product.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        ({product.rating})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary-dark text-white"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
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
  );
}
