"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "@/types/product";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
}) => {
  const { total, page, limit, totalPages } = pagination;

  if (total === 0) return null;

  const start = Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);

  // Generate visible page numbers
  const pages: number[] = [];
  const maxButtons = 5;
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-base-content/70">
      {/* Items range info & limit selector */}
      <div className="flex items-center gap-3">
        <span>
          Showing <span className="font-semibold text-base-content">{start}</span>{" "}
          to <span className="font-semibold text-base-content">{end}</span> of{" "}
          <span className="font-semibold text-base-content">{total}</span> products
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          <span>Rows:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="select select-bordered select-xs rounded-lg"
            aria-label="Items per page"
          >
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="join border border-base-300 rounded-xl overflow-hidden shadow-xs">
          {/* Previous Page */}
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="join-item btn btn-xs btn-ghost px-2.5 disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Page Buttons */}
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`join-item btn btn-xs font-semibold ${
                p === page
                  ? "btn-primary text-primary-content"
                  : "btn-ghost hover:bg-base-200"
              }`}
            >
              {p}
            </button>
          ))}

          {/* Next Page */}
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="join-item btn btn-xs btn-ghost px-2.5 disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
