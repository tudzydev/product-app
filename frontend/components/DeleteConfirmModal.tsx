"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Product } from "@/types/product";

interface DeleteConfirmModalProps {
  product: Product | null;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  product,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-md p-6 rounded-2xl bg-base-100 border border-base-200 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-error/15 text-error flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-base-content">
              Delete Product
            </h3>
            <p className="text-xs text-base-content/70 mt-1 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-base-content">
                &ldquo;{product.name}&rdquo;
              </span>{" "}
              (SKU: {product.sku || `#${product.id}`})? This action cannot be
              undone.
            </p>
          </div>
        </div>

        <div className="modal-action pt-4 border-t border-base-200 mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="btn btn-ghost btn-sm rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="btn btn-error btn-sm rounded-xl gap-1.5"
          >
            {isDeleting ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Product</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose} />
    </div>
  );
};
