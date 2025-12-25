import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Luxe Store - Premium Home Décor",
  description:
    "Discover exquisite home furnishings and accessories. Transform your space with our carefully curated collection.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logo top.jpg",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/logo top.jpg",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: "/luxe-apple-icon.png",
    shortcut: "/luxe-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}