"use client";

import React, { useState } from "react";
import {
  Package,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all duration-200 group rounded-2xl overflow-hidden flex flex-col">
      {/* Image container */}
      <div className="relative w-full pt-[65%] bg-base-200/50 overflow-hidden">
        {product.imageUrl && !imageError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-base-200 to-base-300 text-base-content/40">
            <Package className="w-12 h-12 stroke-1 mb-1" />
            <span className="text-[11px] font-medium tracking-wider uppercase">
              No Image
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          <span className="badge badge-sm badge-neutral/85 backdrop-blur-md font-medium text-xs shadow-sm">
            {product.category}
          </span>
          {!product.isActive && (
            <span className="badge badge-sm badge-error/90 backdrop-blur-md text-white font-medium text-xs shadow-sm">
              Inactive
            </span>
          )}
        </div>

        {/* Quick View Overlay Button */}
        <button
          type="button"
          onClick={() => onView(product)}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-medium text-xs backdrop-blur-[2px] cursor-pointer"
          aria-label={`View details of ${product.name}`}
        >
          <Eye className="w-4 h-4" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="card-body p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* SKU & Category */}
          <div className="flex items-center justify-between gap-2 text-xs text-base-content/60 mb-1">
            {product.sku ? (
              <span className="flex items-center gap-1 font-mono text-[11px] bg-base-200 px-1.5 py-0.5 rounded">
                <Tag className="w-3 h-3" />
                {product.sku}
              </span>
            ) : (
              <span className="font-mono text-[11px] text-base-content/40">
                #ID-{product.id}
              </span>
            )}

            {/* Stock Pill */}
            {isOutOfStock ? (
              <span className="badge badge-xs badge-error gap-1 py-2 px-2 text-[10px] font-semibold">
                <AlertCircle className="w-3 h-3" />
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="badge badge-xs badge-warning gap-1 py-2 px-2 text-[10px] font-semibold">
                Low: {product.stock} left
              </span>
            ) : (
              <span className="badge badge-xs badge-success/20 text-success gap-1 py-2 px-2 text-[10px] font-semibold border-success/30">
                <CheckCircle2 className="w-3 h-3" />
                {product.stock} in stock
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onView(product)}
            className="font-bold text-sm text-base-content line-clamp-1 hover:text-primary transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Truncated Description */}
          <p className="text-xs text-base-content/60 line-clamp-2 mt-1 min-h-[2rem]">
            {product.description || "No description provided for this product."}
          </p>
        </div>

        {/* Footer: Price & Actions */}
        <div className="pt-2 border-t border-base-200 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-xs text-base-content/50 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-primary">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          {/* Edit / Delete Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="btn btn-ghost btn-sm btn-circle hover:bg-primary/10 hover:text-primary"
              title="Edit Product"
              aria-label="Edit product"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(product)}
              className="btn btn-ghost btn-sm btn-circle hover:bg-error/10 hover:text-error"
              title="Delete Product"
              aria-label="Delete product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
