"use client";

import React, { useState, useEffect } from "react";
import { X, Package, DollarSign, Layers, Hash, Image as ImageIcon } from "lucide-react";
import { Product, ProductFormData } from "@/types/product";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  productToEdit?: Product | null;
  categories: string[];
}

const initialFormState: ProductFormData = {
  name: "",
  description: "",
  price: "",
  category: "Electronics",
  stock: 0,
  imageUrl: "",
  sku: "",
  isActive: true,
};

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productToEdit,
  categories,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(productToEdit);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description || "",
        price: productToEdit.price,
        category: productToEdit.category,
        stock: productToEdit.stock,
        imageUrl: productToEdit.imageUrl || "",
        sku: productToEdit.sku || "",
        isActive: productToEdit.isActive,
      });
    } else {
      setFormData(initialFormState);
    }
    setError(null);
    setPreviewError(false);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      setError("Price must be a non-negative number.");
      return;
    }

    if (formData.stock === "" || Number(formData.stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const defaultCategoryOptions = [
    "Electronics",
    "Furniture",
    "Apparel",
    "Kitchen",
    "Home",
    "Books",
    "Sports",
    "Toys",
  ];
  const allCategories = Array.from(
    new Set([...defaultCategoryOptions, ...categories.filter(Boolean)])
  );

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-base-100 border border-base-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-base-200">
          <div>
            <h3 className="text-lg font-extrabold text-base-content">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              {isEdit
                ? `Updating product ID #${productToEdit?.id}`
                : "Fill in the details to list a new item in the catalog."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error text-xs py-2 px-3 rounded-xl mt-4">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Product Name */}
          <div>
            <label className="label py-1 text-xs font-semibold text-base-content">
              Product Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wireless Ergonomic Mouse"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input input-bordered input-sm w-full rounded-xl"
            />
          </div>

          {/* Row: Price, Stock, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Price */}
            <div>
              <label className="label py-1 text-xs font-semibold text-base-content">
                Price ($) <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-xs">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="29.99"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="input input-bordered input-sm w-full pl-7 rounded-xl"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="label py-1 text-xs font-semibold text-base-content">
                Stock Quantity <span className="text-error">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                placeholder="50"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="input input-bordered input-sm w-full rounded-xl"
              />
            </div>

            {/* Category */}
            <div>
              <label className="label py-1 text-xs font-semibold text-base-content">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="select select-bordered select-sm w-full rounded-xl text-xs"
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: SKU & Active Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* SKU */}
            <div>
              <label className="label py-1 text-xs font-semibold text-base-content">
                SKU / Barcode (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. ELEC-MOU-005"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                className="input input-bordered input-sm w-full rounded-xl uppercase font-mono text-xs"
              />
            </div>

            {/* Status Toggle */}
            <div className="pt-2 sm:pt-6">
              <label className="label cursor-pointer justify-start gap-3 py-0">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="toggle toggle-primary toggle-sm"
                />
                <span className="text-xs font-semibold text-base-content">
                  Active in Catalog
                </span>
              </label>
              <span className="text-[11px] text-base-content/50 block ml-11">
                Inactive items are hidden from storefront views
              </span>
            </div>
          </div>

          {/* Image URL & Preview */}
          <div>
            <label className="label py-1 text-xs font-semibold text-base-content">
              Product Image URL
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, imageUrl: e.target.value });
                  setPreviewError(false);
                }}
                className="input input-bordered input-sm flex-1 rounded-xl text-xs"
              />

              {/* Thumbnail preview */}
              <div className="w-10 h-10 rounded-lg bg-base-200 border border-base-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                {formData.imageUrl && !previewError ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    onError={() => setPreviewError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-base-content/30" />
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label py-1 text-xs font-semibold text-base-content">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Write a clear and engaging product description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="textarea textarea-bordered w-full rounded-xl text-xs"
            />
          </div>

          {/* Modal Actions */}
          <div className="modal-action pt-4 border-t border-base-200 mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn btn-ghost btn-sm rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-sm rounded-xl px-5"
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  <span>Saving...</span>
                </>
              ) : isEdit ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose} />
    </div>
  );
};
