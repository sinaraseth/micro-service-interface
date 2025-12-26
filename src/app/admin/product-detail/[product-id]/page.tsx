"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Package,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductService, InventoryService, mapApiProductToLocal } from "@/services/api.config";

export default function AdminProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params["product-id"] as string;

  const [product, setProduct] = useState<any>(null);
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showRemoveStockModal, setShowRemoveStockModal] = useState(false);
  const [stockAmount, setStockAmount] = useState("");
  const [processingStock, setProcessingStock] = useState(false);

  useEffect(() => {
    fetchProductData();
    fetchStockHistory();
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiProduct = await ProductService.getProductById(productId);
      const mappedProduct = mapApiProductToLocal(apiProduct);
      setProduct(mappedProduct);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStockHistory = async () => {
    try {
      const history = await InventoryService.getStockHistory(productId);
      setStockHistory(history.data || []);
    } catch (err) {
      console.error("Error fetching stock history:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await ProductService.deleteProduct(productId);
      alert("Product deleted successfully!");
      router.push("/admin");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleAddStock = async () => {
    if (!stockAmount || parseInt(stockAmount) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    try {
      setProcessingStock(true);
      await InventoryService.addStock(productId, parseInt(stockAmount));
      alert("Stock added successfully!");
      setShowAddStockModal(false);
      setStockAmount("");
      await fetchProductData();
      await fetchStockHistory();
    } catch (err) {
      console.error("Error adding stock:", err);
      alert("Failed to add stock. Please try again.");
    } finally {
      setProcessingStock(false);
    }
  };

  const handleRemoveStock = async () => {
    if (!stockAmount || parseInt(stockAmount) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (product && parseInt(stockAmount) > product.stock) {
      alert("Cannot remove more stock than available");
      return;
    }

    try {
      setProcessingStock(true);
      await InventoryService.deductStock(productId, parseInt(stockAmount));
      alert("Stock removed successfully!");
      setShowRemoveStockModal(false);
      setStockAmount("");
      await fetchProductData();
      await fetchStockHistory();
    } catch (err) {
      console.error("Error removing stock:", err);
      alert("Failed to remove stock. Please try again.");
    } finally {
      setProcessingStock(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Link href="/admin">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h1>
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

      {/* Modals remain the same */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Product
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
                Delete Product
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAddStockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Stock</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Add
                </label>
                <input
                  type="number"
                  value={stockAmount}
                  onChange={(e) => setStockAmount(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter quantity"
                  disabled={processingStock}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddStockModal(false);
                  setStockAmount("");
                }}
                disabled={processingStock}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary hover:bg-primary-dark text-white"
                onClick={handleAddStock}
                disabled={processingStock}
              >
                {processingStock ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Stock"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showRemoveStockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Remove Stock</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Remove
                </label>
                <input
                  type="number"
                  value={stockAmount}
                  onChange={(e) => setStockAmount(e.target.value)}
                  min="1"
                  max={product.stock}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter quantity"
                  disabled={processingStock}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {product.stock} units
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRemoveStockModal(false);
                  setStockAmount("");
                }}
                disabled={processingStock}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleRemoveStock}
                disabled={processingStock}
              >
                {processingStock ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Removing...
                  </>
                ) : (
                  "Remove Stock"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    ${product.price}
                  </h2>
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
                      <span className="font-medium text-gray-900">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium text-gray-900">
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Stock History</h3>
              {stockHistory.length > 0 ? (
                <div className="space-y-3">
                  {stockHistory.map((entry: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 pb-3 border-b border-gray-100 last:border-0"
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          entry.type === "ADD" || entry.quantity > 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {entry.type === "ADD" || entry.quantity > 0 ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <TrendingDown className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900">
                            {entry.quantity > 0 ? "+" : ""}
                            {entry.quantity} units
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {entry.notes || entry.reason || "Stock adjustment"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No stock history available</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Current Stock</h3>
              <div className="text-center py-4">
                <div
                  className={`text-5xl font-bold mb-2 ${
                    product.stock > 20
                      ? "text-green-600"
                      : product.stock > 10
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {product.stock}
                </div>
                <p className="text-gray-600">units available</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setShowAddStockModal(true)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Add Stock
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setShowRemoveStockModal(true)}
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Stock Level</span>
                    <span
                      className={`text-sm font-semibold ${
                        product.stock > 20
                          ? "text-green-600"
                          : product.stock > 10
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.stock > 20 ? "Good" : product.stock > 10 ? "Low" : "Critical"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        product.stock > 20
                          ? "bg-green-500"
                          : product.stock > 10
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min((product.stock / 50) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Stock</span>
                    <span className="font-medium text-gray-900">{product.stock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock Value</span>
                    <span className="font-medium text-gray-900">
                      ${(product.stock * product.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href={`/admin/crud-product?edit=${productId}`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Product Details
                  </Button>
                </Link>
                <Link href="/admin/inventory-stock" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    View Inventory
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Product
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}