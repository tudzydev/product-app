"use client";

import React from "react";
import {
  Boxes,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { ProductStats } from "@/types/product";

interface StatsSectionProps {
  stats: ProductStats | null;
  loading: boolean;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-base-200/80 border border-base-300"
          />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {/* Total Products */}
      <div className="stat bg-base-100 rounded-2xl border border-base-200 shadow-sm p-4 sm:p-5">
        <div className="stat-figure text-primary">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Boxes className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/60">
          Total Products
        </div>
        <div className="stat-value text-2xl sm:text-3xl font-extrabold text-base-content mt-1">
          {stats.totalProducts}
        </div>
        <div className="stat-desc text-xs text-base-content/60 mt-0.5">
          {stats.activeProducts} active catalog items
        </div>
      </div>

      {/* In Stock & Out of Stock */}
      <div className="stat bg-base-100 rounded-2xl border border-base-200 shadow-sm p-4 sm:p-5">
        <div className="stat-figure text-success">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
        </div>
        <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/60">
          Stock Availability
        </div>
        <div className="stat-value text-2xl sm:text-3xl font-extrabold text-success mt-1">
          {stats.inStock}
        </div>
        <div className="stat-desc text-xs flex items-center gap-1.5 mt-0.5">
          {stats.outOfStock > 0 ? (
            <span className="text-error font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 inline" />
              {stats.outOfStock} out of stock
            </span>
          ) : (
            <span className="text-success font-medium">All items in stock</span>
          )}
        </div>
      </div>

      {/* Total Inventory Units */}
      <div className="stat bg-base-100 rounded-2xl border border-base-200 shadow-sm p-4 sm:p-5">
        <div className="stat-figure text-secondary">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
        </div>
        <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/60">
          Total Units
        </div>
        <div className="stat-value text-2xl sm:text-3xl font-extrabold text-base-content mt-1">
          {stats.totalUnits.toLocaleString()}
        </div>
        <div className="stat-desc text-xs text-base-content/60 mt-0.5">
          Avg. ${(stats.averagePrice || 0).toFixed(2)} / product
        </div>
      </div>

      {/* Total Inventory Value */}
      <div className="stat bg-base-100 rounded-2xl border border-base-200 shadow-sm p-4 sm:p-5">
        <div className="stat-figure text-accent">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-accent" />
          </div>
        </div>
        <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/60">
          Inventory Value
        </div>
        <div className="stat-value text-2xl sm:text-3xl font-extrabold text-accent mt-1">
          ${(stats.totalInventoryValue || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div className="stat-desc text-xs text-base-content/60 mt-0.5">
          Estimated asset value
        </div>
      </div>
    </div>
  );
};
