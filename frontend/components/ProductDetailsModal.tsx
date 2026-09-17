"use client";

import React, { useState } from "react";
import {
  X,
  Package,
  Calendar,
  Tag,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Layers,
  DollarSign,
  Boxes,
} from "lucide-react";
import { Product } from "@/types/product";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-2xl p-6 rounded-2xl bg-base-100 border border-base-200 shadow-2xl">
        {/* Header with Title and Close Button */}
        <div className="flex items-start justify-between pb-3 border-b border-base-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-sm badge-outline font-semibold">
                {product.category}
              </span>
              {product.isActive ? (
                <span className="badge badge-xs badge-success text-[11px]">
                  Active
                </span>
              ) : (
                <span className="badge badge-xs badge-ghost text-[11px]">
                  Inactive
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-base-content mt-1">
              {product.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6 mt-4">
          {/* Main Image */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden bg-base-200 border border-base-300 flex items-center justify-center">
            {product.imageUrl && !imageError ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-base-content/30">
                <Package className="w-16 h-16 stroke-1 mb-2" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  No Image Available
                </span>
              </div>
            )}
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Price Card */}
            <div className="bg-base-200/50 p-3.5 rounded-xl border border-base-200">
              <span className="text-xs text-base-content/60 font-medium block">
                Unit Price
              </span>
              <span className="text-2xl font-black text-primary mt-0.5 block">
                ${Number(product.price).toFixed(2)}
              </span>
            </div>

            {/* Stock Level Card */}
            <div className="bg-base-200/50 p-3.5 rounded-xl border border-base-200">
              <span className="text-xs text-base-content/60 font-medium block">
                Inventory Stock
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                {isOutOfStock ? (
                  <span className="badge badge-error gap-1 text-xs font-semibold">
                    <AlertCircle className="w-3 h-3" />
                    0 Units (Out of Stock)
                  </span>
                ) : isLowStock ? (
                  <span className="badge badge-warning gap-1 text-xs font-semibold">
                    {product.stock} Units (Low Stock)
                  </span>
                ) : (
                  <span className="badge badge-success gap-1 text-xs font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    {product.stock} Units
                  </span>
                )}
              </div>
            </div>

            {/* Total Valuation Card */}
            <div className="bg-base-200/50 p-3.5 rounded-xl border border-base-200 col-span-2 sm:col-span-1">
              <span className="text-xs text-base-content/60 font-medium block">
                Total Line Value
              </span>
              <span className="text-2xl font-black text-accent mt-0.5 block">
                ${(Number(product.price) * product.stock).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
              Product Description
            </h4>
            <p className="text-sm text-base-content/80 leading-relaxed bg-base-200/30 p-3.5 rounded-xl border border-base-200">
              {product.description ||
                "No description provided for this product catalog item."}
            </p>
          </div>

          {/* Meta specifications */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-base-200/30 p-3.5 rounded-xl border border-base-200">
            <div>
              <span className="text-base-content/50 block font-medium">SKU / Code</span>
              <span className="font-mono font-semibold text-base-content mt-0.5 block">
                {product.sku || "N/A"}
              </span>
            </div>

            <div>
              <span className="text-base-content/50 block font-medium">Category</span>
              <span className="font-semibold text-base-content mt-0.5 block">
                {product.category}
              </span>
            </div>

            <div>
              <span className="text-base-content/50 block font-medium">Created</span>
              <span className="text-base-content/80 mt-0.5 block">
                {new Date(product.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div>
              <span className="text-base-content/50 block font-medium">Last Modified</span>
              <span className="text-base-content/80 mt-0.5 block">
                {new Date(product.updatedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="modal-action pt-4 border-t border-base-200 mt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(product);
            }}
            className="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="btn btn-primary btn-sm gap-1.5"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose} />
    </div>
  );
};
