"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCategory } from "@/hooks/mock-data";
import { ProductService } from "@/services/api.config";

function CrudProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: ProductCategory.FURNITURE,
    image: "",
    rating: 5,
    stock: 0,
    sku: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      fetchProductData(editId);
    }
  }, [isEditMode, editId]);

  const fetchProductData = async (productId: string) => {
    try {
      setFetchingProduct(true);
      const product = await ProductService.getProductById(productId);

      console.log("Fetched product:", product);

      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: (product.category as ProductCategory) || ProductCategory.FURNITURE,
        image: product.image || "",
        rating: product.rating || 5,
        stock: product.stock,
        sku: product.sku,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to load product data");
      router.push("/admin");
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!isEditMode && !formData.sku.trim()) newErrors.sku = "SKU is required";
    if (formData.stock < 0) newErrors.stock = "Stock cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      if (isEditMode && editId) {
        // Update existing product - DON'T send SKU
        const updateData = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock.toString()),
          category: formData.category,
          image: formData.image || undefined,
          rating: formData.rating,
          is_active: 1,
        };

        console.log("Updating product:", editId, updateData);
        await ProductService.updateProduct(editId, updateData);
        alert("Product updated successfully!");
      } else {
        // Create new product - INCLUDE SKU
        const createData = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          sku: formData.sku,
          stock: parseInt(formData.stock.toString()),
          category: formData.category,
          image: formData.image || undefined,
          rating: formData.rating,
        };

        console.log("Creating product:", createData);
        await ProductService.createProduct(createData);
        alert("Product created successfully!");
      }

      router.push("/admin");
    } catch (error: any) {
      console.error("Error saving product:", error);
      
      // Try to get more specific error message
      let errorMessage = `Failed to ${isEditMode ? "update" : "create"} product.`;
      if (error.message) {
        errorMessage += ` ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 md:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm" disabled={loading}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? "Edit Product" : "Add New Product"}
                </h1>
                <p className="text-sm text-gray-600">
                  {isEditMode ? "Update product information" : "Create a new product in your inventory"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="px-6 py-8 md:px-12">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Premium Cushion"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Describe your product..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={loading}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {Object.values(ProductCategory).map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0) + category.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SKU & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                    SKU {!isEditMode && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    disabled={loading || isEditMode}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.sku ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., FRN-TABL-001"
                  />
                  {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
                  {isEditMode && (
                    <p className="mt-1 text-xs text-gray-500">SKU cannot be changed after creation</p>
                  )}
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                    {isEditMode ? "Current Stock" : "Initial Stock"}
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    disabled={loading}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.stock ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0"
                  />
                  {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="/images/product.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">Optional: Leave empty to use default placeholder</p>
              </div>

              {/* Rating */}
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200">
              <Link href="/admin">
                <Button type="button" variant="outline" disabled={loading}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditMode ? "Update Product" : "Create Product"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CrudProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <CrudProductForm />
    </Suspense>
  );
}