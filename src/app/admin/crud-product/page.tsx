"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X, Loader2, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductService } from "@/services/api.config";

function CrudProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: 0,
    sku: "",
    image: "" as string, // Changed to string for base64
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);

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
        price: product.price.toString(),
        stock: product.stock,
        sku: product.sku,
        image: product.image || "",
      });

      if (product.image) {
        setImagePreview(product.image);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to load product data");
      router.push("/admin");
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Please select a valid image file" }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image size should not exceed 5MB" }));
        return;
      }

      setErrors((prev) => ({ ...prev, image: "" }));

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
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
        // For updates
        const updateData: any = {
          name: formData.name,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock.toString()),
        };

        // Include image only if it was changed (starts with data:image)
        if (formData.image && formData.image.startsWith('data:image')) {
          updateData.image = formData.image;
        }

        console.log("Updating product:", editId);
        await ProductService.updateProduct(editId, updateData);
        alert("Product updated successfully!");
      } else {
        // For creation
        const createData: any = {
          name: formData.name,
          price: parseFloat(formData.price),
          sku: formData.sku,
          stock: parseInt(formData.stock.toString()),
        };

        // Include image if present
        if (formData.image) {
          createData.image = formData.image;
        }

        console.log("Creating product with data:", {
          ...createData,
          image: createData.image ? `${createData.image.substring(0, 50)}...` : null
        });

        await ProductService.createProduct(createData);
        alert("Product created successfully!");
      }

      router.push("/admin");
    } catch (error: any) {
      console.error("Error saving product:", error);
      
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

      <div className="px-6 py-8 md:px-12">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Product Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <div className="flex gap-4">
                  {/* Image Preview */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Upload Button */}
                  <div className="flex-1 flex flex-col justify-center">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                      className="hidden"
                    />
                    <label htmlFor="image">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={loading}
                        onClick={() => document.getElementById("image")?.click()}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {imagePreview ? "Change Image" : "Upload Image"}
                      </Button>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, JPEG up to 5MB (will be converted to base64)
                    </p>
                    {errors.image && (
                      <p className="text-sm text-red-600 mt-1">{errors.image}</p>
                    )}
                  </div>
                </div>
              </div>

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

              {/* Price */}
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