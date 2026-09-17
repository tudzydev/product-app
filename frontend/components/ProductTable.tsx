"use client";

import React, { useState } from "react";
import {
  Package,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* Table Header */}
          <thead className="bg-base-200/60 text-xs text-base-content/70 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 pl-4 sm:pl-6">Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th className="text-right pr-4 sm:pr-6">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-base-200 text-sm">
            {products.map((product) => (
              <TableRow
                key={product.id}
                product={product}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableRow: React.FC<{
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}> = ({ product, onView, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <tr className="hover:bg-base-200/40 transition-colors group">
      {/* Product Image & Title */}
      <td className="py-3 pl-4 sm:pl-6">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 h-12 rounded-xl bg-base-200 overflow-hidden relative flex-shrink-0 border border-base-300">
              {product.imageUrl && !imageError ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-base-content/30">
                  <Package className="w-6 h-6 stroke-1" />
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 max-w-xs">
            <button
              type="button"
              onClick={() => onView(product)}
              className="font-bold text-sm text-base-content hover:text-primary transition-colors truncate block text-left"
            >
              {product.name}
            </button>
            <div className="flex items-center gap-2 text-xs text-base-content/50 mt-0.5">
              {product.sku ? (
                <span className="font-mono text-[11px] flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {product.sku}
                </span>
              ) : (
                <span className="font-mono text-[11px]">ID #{product.id}</span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td>
        <span className="badge badge-sm badge-ghost font-medium">
          {product.category}
        </span>
      </td>

      {/* Price */}
      <td className="font-extrabold text-base text-primary whitespace-nowrap">
        ${Number(product.price).toFixed(2)}
      </td>

      {/* Stock */}
      <td className="whitespace-nowrap">
        {isOutOfStock ? (
          <span className="badge badge-sm badge-error gap-1 text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="badge badge-sm badge-warning gap-1 text-xs font-medium">
            {product.stock} units (Low)
          </span>
        ) : (
          <span className="badge badge-sm badge-success/20 text-success border-success/30 gap-1 text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            {product.stock} units
          </span>
        )}
      </td>

      {/* Status */}
      <td className="whitespace-nowrap">
        {product.isActive ? (
          <span className="badge badge-xs badge-success gap-1 text-[11px] py-1.5 px-2">
            Active
          </span>
        ) : (
          <span className="badge badge-xs badge-ghost text-base-content/50 gap-1 text-[11px] py-1.5 px-2">
            Inactive
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="text-right pr-4 sm:pr-6 whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onView(product)}
            className="btn btn-ghost btn-xs btn-circle hover:bg-base-300"
            title="View Details"
            aria-label="View product details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="btn btn-ghost btn-xs btn-circle hover:bg-primary/10 hover:text-primary"
            title="Edit Product"
            aria-label="Edit product"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="btn btn-ghost btn-xs btn-circle hover:bg-error/10 hover:text-error"
            title="Delete Product"
            aria-label="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
