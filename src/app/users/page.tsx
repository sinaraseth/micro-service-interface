// Browse all products (Product Service)

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCategory, addToCart, getCartItemCount } from "@/hooks/mock-data";
import { ProductService, mapApiProductToLocal } from "@/services/api.config";

type UserProduct = ReturnType<typeof mapApiProductToLocal> & {
  category: ProductCategory;
  rating: number;
};

export default function UserProductsPage() {
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(getCartItemCount());

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const allProducts: UserProduct[] = [];
      let page = 1;
      let lastPage = 1;

      do {
        const response = await ProductService.getProducts(page);
        allProducts.push(
          ...response.data.map((product) => ({
            ...mapApiProductToLocal(product),
            category: ProductCategory.ACCESSORIES,
            rating: 0,
          }))
        );
        lastPage = response.last_page;
        page += 1;
      } while (page <= lastPage);

      setProducts(allProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch && product.stock > 0;
    });
  }, [products, searchQuery]);

  const handleAddToCart = (product: UserProduct) => {
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

      {/* Products Grid */}
      <div className="px-6 py-8 md:px-12">
        {loading ? (
          <div className="text-center py-16 text-gray-600">Loading products...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : filteredProducts.length === 0 ? (
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
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
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
