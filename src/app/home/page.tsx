"use client";

import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Snowfall from "react-snowfall";
import { useEffect, useState } from "react";

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
  {
    id: 4,
    name: "Modern Lamp",
    price: "$159",
    image: "/images.jpg",
    rating: 5,
  },
  {
    id: 5,
    name: "Ceramic Vase",
    price: "$129",
    image: "/images (1).jpg",
    rating: 5,
  },
  {
    id: 6,
    name: "Accent Chair",
    price: "$599",
    image: "/images (2).jpg",
    rating: 5,
  },
  {
    id: 7,
    name: "Wall Art",
    price: "$299",
    image: "/images.jpg",
    rating: 5,
  },
  {
    id: 8,
    name: "Coffee Table",
    price: "$449",
    image: "/images (1).jpg",
    rating: 5,
  },
];

const heroImages = ["/images.jpg", "/images (1).jpg", "/images (2).jpg"];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-primary-light via-primary-light to-primary-lighter">
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
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 relative z-10">
        <div className="flex items-center gap-2">
          <Link href="/home" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Luxe Store" className="h-11 w-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary-dark"
            >
              Log in
            </Button>
          </Link>
          <Link href="/users">
            <Button className="bg-primary hover:bg-primary-dark text-primary-foreground">
              Sign up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section with Image Carousel */}
      <section className="px-6 py-16 md:py-24 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Text Content */}
          <div>
            <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6 text-balance">
              Discover Exquisite Home Décor
            </h1>
            <p className="text-lg text-primary-dark/70 mb-8 leading-relaxed">
              Transform your space with our carefully curated collection of
              premium home furnishings and accessories. Each piece is selected
              for its quality, design, and timeless appeal.
            </p>
            <Link href="#products">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-dark text-primary-foreground"
              >
                Browse Collection
              </Button>
            </Link>
          </div>

          {/* Right Side - Auto-scrolling Images with 5:3 aspect ratio */}
          <div className="relative aspect-[5/3] w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Hero ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="px-6 md:px-12 py-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
          Featured Products
        </h2>
        <p className="text-primary-dark/70 mb-12">
          Handpicked items for the discerning homeowner
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[5/3] bg-primary-lighter overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: product.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold text-primary">
                    {product.price}
                  </span>
                  <Link href="/users">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary-dark text-primary-foreground"
                    >
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
      <section className="px-6 md:px-12 py-16 bg-primary/5 relative z-10">
        <div className="max-w-md">
          <h2 className="text-2xl font-serif text-primary mb-4">
            Stay Updated
          </h2>
          <p className="text-primary-dark/70 mb-6">
            Get exclusive offers and new arrivals delivered to your inbox.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
            >
              Subscribe
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground px-6 md:px-12 py-12 relative z-10">
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
  );
}
