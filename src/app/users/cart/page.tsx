// Shopping cart

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockCart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } from "@/hooks/mock-data"

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState([...mockCart])

  const handleRemove = (productId: string) => {
    removeFromCart(productId)
    setCart([...mockCart])
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateCartQuantity(productId, newQuantity)
    setCart([...mockCart])
  }

  const subtotal = getCartTotal()
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!")
      return
    }
    router.push("/users/orders")
  }

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

      {/* Cart Content */}
      <div className="px-6 py-8 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/users">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">{cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
              <Link href="/users">
                <Button className="bg-primary hover:bg-primary-dark text-white">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.productId} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{item.productName}</h3>
                            <p className="text-gray-600 mt-1">${item.price} each</p>
                          </div>
                          <button
                            onClick={() => handleRemove(item.productId)}
                            className="text-red-600 hover:text-red-700"
                            aria-label="Remove item from cart"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="text-lg font-semibold w-12 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (10%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary-dark text-white text-lg py-6"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  <button
                    onClick={() => {
                      clearCart()
                      setCart([])
                    }}
                    className="w-full mt-3 text-sm text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}