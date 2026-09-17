"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";
import { CategoryCount, FilterParams } from "@/types/product";

interface FilterBarProps {
  filters: FilterParams;
  categories: CategoryCount[];
  totalProducts: number;
  viewMode: "grid" | "table";
  onChangeViewMode: (mode: "grid" | "table") => void;
  onFilterChange: (updated: Partial<FilterParams>) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  categories,
  totalProducts,
  viewMode,
  onChangeViewMode,
  onFilterChange,
  onResetFilters,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeCategory = filters.category || "All";
  const hasActiveFilters = Boolean(
    filters.search ||
      (filters.category && filters.category !== "All") ||
      filters.inStock !== "" && filters.inStock !== undefined ||
      filters.isActive !== "" && filters.isActive !== undefined ||
      filters.minPrice !== "" && filters.minPrice !== undefined ||
      filters.maxPrice !== "" && filters.maxPrice !== undefined
  );

  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm p-4 space-y-4">
      {/* Top Row: Search Input, Quick Actions, Sort & View Mode */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-base-content/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name, description, SKU..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="input input-bordered w-full pl-10 pr-10 text-sm rounded-xl focus:outline-primary"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ search: "", page: 1 })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right side controls: Sort, Filter Toggle, View Switcher */}
        <div className="flex items-center gap-2">
          {/* Advanced Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`btn btn-sm rounded-xl gap-1.5 ${
              showAdvanced || hasActiveFilters
                ? "btn-neutral"
                : "btn-outline border-base-300"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="badge badge-xs badge-primary">!</span>
            )}
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5">
            <select
              value={`${filters.sortBy || "createdAt"}-${filters.order || "DESC"}`}
              onChange={(e) => {
                const [sortBy, order] = e.target.value.split("-");
                onFilterChange({
                  sortBy,
                  order: order as "ASC" | "DESC",
                  page: 1,
                });
              }}
              className="select select-bordered select-sm rounded-xl text-xs font-medium"
              aria-label="Sort products by"
            >
              <option value="createdAt-DESC">Newest First</option>
              <option value="createdAt-ASC">Oldest First</option>
              <option value="price-ASC">Price: Low to High</option>
              <option value="price-DESC">Price: High to Low</option>
              <option value="name-ASC">Name: A to Z</option>
              <option value="name-DESC">Name: Z to A</option>
              <option value="stock-DESC">Stock: High to Low</option>
              <option value="stock-ASC">Stock: Low to High</option>
            </select>
          </div>

          {/* Grid / Table View Switcher */}
          <div className="join border border-base-300 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => onChangeViewMode("grid")}
              className={`join-item btn btn-sm btn-ghost px-2.5 ${
                viewMode === "grid" ? "btn-active bg-base-200" : ""
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode("table")}
              className={`join-item btn btn-sm btn-ghost px-2.5 ${
                viewMode === "table" ? "btn-active bg-base-200" : ""
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => onFilterChange({ category: "All", page: 1 })}
          className={`btn btn-xs rounded-lg font-medium whitespace-nowrap transition-all ${
            activeCategory === "All"
              ? "btn-primary text-primary-content"
              : "btn-ghost text-base-content/70 hover:bg-base-200"
          }`}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat.category}
            type="button"
            onClick={() => onFilterChange({ category: cat.category, page: 1 })}
            className={`btn btn-xs rounded-lg font-medium whitespace-nowrap gap-1.5 transition-all ${
              activeCategory === cat.category
                ? "btn-primary text-primary-content"
                : "btn-ghost text-base-content/70 hover:bg-base-200"
            }`}
          >
            <span>{cat.category}</span>
            <span
              className={`badge badge-xs ${
                activeCategory === cat.category
                  ? "badge-primary-content/20 text-primary-content"
                  : "badge-ghost opacity-70"
              }`}
            >
              {cat.productCount}
            </span>
          </button>
        ))}
      </div>

      {/* Advanced Filter Collapse Row */}
      {showAdvanced && (
        <div className="pt-3 border-t border-base-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-fade-in">
          {/* Stock Filter */}
          <div>
            <label className="label py-1 text-base-content/60 font-medium">
              Stock Availability
            </label>
            <select
              value={
                filters.inStock === undefined || filters.inStock === ""
                  ? ""
                  : String(filters.inStock)
              }
              onChange={(e) =>
                onFilterChange({
                  inStock:
                    e.target.value === "" ? "" : e.target.value === "true",
                  page: 1,
                })
              }
              className="select select-bordered select-sm w-full rounded-lg"
            >
              <option value="">All Stock Levels</option>
              <option value="true">In Stock Only ( &gt; 0 )</option>
              <option value="false">Out of Stock ( 0 )</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="label py-1 text-base-content/60 font-medium">
              Product Status
            </label>
            <select
              value={
                filters.isActive === undefined || filters.isActive === ""
                  ? ""
                  : String(filters.isActive)
              }
              onChange={(e) =>
                onFilterChange({
                  isActive:
                    e.target.value === "" ? "" : e.target.value === "true",
                  page: 1,
                })
              }
              className="select select-bordered select-sm w-full rounded-lg"
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          </div>

          {/* Price Range: Min */}
          <div>
            <label className="label py-1 text-base-content/60 font-medium">
              Min Price ($)
            </label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={filters.minPrice ?? ""}
              onChange={(e) =>
                onFilterChange({
                  minPrice: e.target.value ? Number(e.target.value) : "",
                  page: 1,
                })
              }
              className="input input-bordered input-sm w-full rounded-lg"
            />
          </div>

          {/* Price Range: Max */}
          <div>
            <label className="label py-1 text-base-content/60 font-medium">
              Max Price ($)
            </label>
            <input
              type="number"
              placeholder="1000.00"
              min="0"
              step="0.01"
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                onFilterChange({
                  maxPrice: e.target.value ? Number(e.target.value) : "",
                  page: 1,
                })
              }
              className="input input-bordered input-sm w-full rounded-lg"
            />
          </div>

          {/* Reset Filters CTA */}
          {hasActiveFilters && (
            <div className="sm:col-span-2 md:col-span-4 flex justify-end pt-1">
              <button
                type="button"
                onClick={onResetFilters}
                className="btn btn-ghost btn-xs text-error gap-1 hover:bg-error/10"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
