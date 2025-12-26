// View product (Product Service)

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Plus, Minus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCategory, addToCart } from "@/hooks/mock-data"
import { ProductService, mapApiProductToLocal } from "@/services/api.config"

type UserProduct = ReturnType<typeof mapApiProductToLocal> & {
  category: ProductCategory
}

export default function UserProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params["product-id"] as string

  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<UserProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const apiProduct = await ProductService.getProductById(productId)
        const mapped = mapApiProductToLocal(apiProduct)
        setProduct({
          ...mapped,
          category: ProductCategory.ACCESSORIES,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Link href="/users">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      alert("Not enough stock available")
      return
    }
    addToCart(product, quantity)
    router.push("/users/cart")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 md:px-12">
          <div className="flex items-center justify-between">
            <Link href="/home" className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Luxe Store" className="h-11 w-auto" />
            </Link>
            <Link href="/users/cart">
              <Button variant="outline">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Product Detail */}
      <div className="px-6 py-8 md:px-12">
        <Link href="/users">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">
                  {product.category.charAt(0) + product.category.slice(1).toLowerCase()}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${product.price}</span>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-700">Stock Availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded ${
                      product.stock > 20
                        ? "bg-green-100 text-green-800"
                        : product.stock > 10
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock > 20 ? "In Stock" : product.stock > 0 ? "Limited Stock" : "Out of Stock"}
                  </span>
                  <span className="text-sm text-gray-600">({product.stock} units available)</span>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    className="w-full bg-primary hover:bg-primary-dark text-white text-lg py-6"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </Button>
                </>
              )}

              {product.stock === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-600 font-medium">This product is currently out of stock</p>
                </div>
              )}

              {/* Product Details */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium">{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">
                      {product.category.charAt(0) + product.category.slice(1).toLowerCase()}
                    </span>
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
