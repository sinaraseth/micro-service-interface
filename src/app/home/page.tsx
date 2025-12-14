"use client"

import Link from "next/link"
import { ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const products = [
  {
    id: 1,
    name: "Premium Cushion",
    price: "$89",
    image: "/images.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Wooden Side Table",
    price: "$249",
    image: "/images (1).jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Designer Rug",
    price: "$399",
    image: "/images (2).jpg",
    rating: 5,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-primary-light via-primary-light to-primary-lighter">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-sm"></div>
          <span className="text-xl font-semibold text-primary">Luxe Store</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-primary hover:text-primary-dark">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary-dark text-primary-foreground">Sign up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 md:px-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6 text-balance">
            Discover Exquisite Home Décor
          </h1>
          <p className="text-lg text-primary-dark/70 mb-8 leading-relaxed">
            Transform your space with our carefully curated collection of premium home furnishings and accessories. Each
            piece is selected for its quality, design, and timeless appeal.
          </p>
          <Link href="#products">
            <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground">
              Browse Collection
            </Button>
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="px-6 md:px-12 py-16">
        <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Featured Products</h2>
        <p className="text-primary-dark/70 mb-12">Handpicked items for the discerning homeowner</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-primary-lighter overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: product.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold text-primary">{product.price}</span>
                  <Link href="/signup">
                    <Button size="sm" className="bg-primary hover:bg-primary-dark text-primary-foreground">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 md:px-12 py-16 bg-primary/5">
        <div className="max-w-md">
          <h2 className="text-2xl font-serif text-primary mb-4">Stay Updated</h2>
          <p className="text-primary-dark/70 mb-6">Get exclusive offers and new arrivals delivered to your inbox.</p>
          <Link href="/signup">
            <Button size="lg" className="w-full bg-primary hover:bg-primary-dark text-primary-foreground">
              Subscribe
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-primary-foreground">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground">
                  Sustainability
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-primary-foreground">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-primary-foreground">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/70">
          <p>&copy; 2025 Luxe Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
