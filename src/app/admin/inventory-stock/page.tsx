"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Package, Search, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryService, ProductService, mapApiProductToLocal } from "@/services/api.config";

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  stock: number;
  stockKey: string;
};

const normalizeInventory = (raw: any): InventoryItem[] => {
  const list = Array.isArray(raw)
    ? raw
    : raw?.data || raw?.inventory || raw?.items || [];

  return list.map((item: any, index: number) => {
    const product = item.product || item.product_detail || item.productInfo || {};
    const idValue = item.product_id ?? item.productId ?? item.id ?? index;
    const stockKey = item.product_id ?? item.productId ?? item.sku ?? item.id ?? index;

    return {
      id: idValue.toString(),
      name: product.name || item.name || "Unknown Product",
      sku: product.sku || item.sku || "--",
      price: Number(product.price ?? item.price ?? 0),
      image: product.image || item.image || "/placeholder.svg",
      stock: Number(item.stock ?? item.quantity ?? item.qty ?? item.available ?? 0),
      stockKey: stockKey.toString(),
    };
  });
};

export default function InventoryStockPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showRemoveStockModal, setShowRemoveStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [stockAmount, setStockAmount] = useState("");
  const [processingStock, setProcessingStock] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const inventoryResponse = await InventoryService.getInventory();
      const inventoryItems = normalizeInventory(inventoryResponse);

      const products: any[] = [];
      let page = 1;
      let lastPage = 1;

      do {
        const productPage = await ProductService.getProducts(page);
        products.push(...productPage.data.map(mapApiProductToLocal));
        lastPage = productPage.last_page;
        page += 1;
      } while (page <= lastPage);

      const productIndex = new Map<string, any>();
      for (const product of products) {
        if (product.id) productIndex.set(product.id.toString(), product);
        if (product.sku) productIndex.set(product.sku.toString(), product);
      }

      const mergedInventory = inventoryItems
        .map((item) => {
        const matchedProduct =
          productIndex.get(item.id) || productIndex.get(item.sku);

        if (!matchedProduct) {
          return null;
        }

        return {
          ...item,
          id: matchedProduct.id || item.id,
          name: matchedProduct.name || item.name,
          sku: matchedProduct.sku || item.sku,
          price: matchedProduct.price ?? item.price,
          image: matchedProduct.image || item.image,
        };
      })
        .filter((item): item is InventoryItem => item !== null);

      setInventoryItems(mergedInventory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return inventoryItems;
    const query = searchQuery.toLowerCase();
    return inventoryItems.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
    );
  }, [inventoryItems, searchQuery]);

  const totalProducts = inventoryItems.length;
  const lowStockProducts = inventoryItems.filter((p) => p.stock <= 10).length;
  const totalStockValue = inventoryItems.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  );

  const handleAddStock = async () => {
    if (!selectedProduct || !stockAmount || parseInt(stockAmount) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    try {
      setProcessingStock(true);
      await InventoryService.addStock(selectedProduct.stockKey, parseInt(stockAmount));
      setShowAddStockModal(false);
      setSelectedProduct(null);
      setStockAmount("");
      await fetchInventory();
    } catch (err) {
      console.error(err);
      alert("Failed to add stock. Please try again.");
    } finally {
      setProcessingStock(false);
    }
  };

  const handleRemoveStock = async () => {
    if (!selectedProduct || !stockAmount || parseInt(stockAmount) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (parseInt(stockAmount) > selectedProduct.stock) {
      alert("Cannot remove more stock than available");
      return;
    }

    try {
      setProcessingStock(true);
      await InventoryService.deductStock(selectedProduct.stockKey, parseInt(stockAmount));
      setShowRemoveStockModal(false);
      setSelectedProduct(null);
      setStockAmount("");
      await fetchInventory();
    } catch (err) {
      console.error(err);
      alert("Failed to remove stock. Please try again.");
    } finally {
      setProcessingStock(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 md:px-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-sm text-gray-600 mt-1">Monitor and manage product stock levels</p>
            </div>
            <Link href="/admin">
              <Button variant="outline">Back to Products</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Products</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{totalProducts}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Low Stock Items</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">{lowStockProducts}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Stock Value</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    ${totalStockValue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8 md:px-12">
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading inventory...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">${product.price}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{product.stock} units</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            product.stock > 20
                              ? "bg-green-100 text-green-800"
                              : product.stock > 10
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock > 20 ? "Good" : product.stock > 10 ? "Low" : "Critical"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(product.stock * product.price).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowAddStockModal(true);
                            }}
                          >
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowRemoveStockModal(true);
                            }}
                          >
                            <TrendingDown className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAddStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Stock</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
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
                  setSelectedProduct(null);
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
                {processingStock ? "Adding..." : "Add Stock"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showRemoveStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Remove Stock</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={stockAmount}
                  onChange={(e) => setStockAmount(e.target.value)}
                  min="1"
                  max={selectedProduct.stock}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter quantity"
                  disabled={processingStock}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {selectedProduct.stock} units
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRemoveStockModal(false);
                  setSelectedProduct(null);
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
                {processingStock ? "Removing..." : "Remove Stock"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
