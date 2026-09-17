"use client";

import React from "react";
import {
  Package,
  Plus,
  Database,
  Sparkles,
  RefreshCw,
  Server,
  Sun,
  Moon,
} from "lucide-react";

interface NavbarProps {
  backendOnline: boolean;
  dbStatus: string;
  isSeeding: boolean;
  onOpenCreateModal: () => void;
  onSeedData: () => void;
  onRefresh: () => void;
  theme: string;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  backendOnline,
  dbStatus,
  isSeeding,
  onOpenCreateModal,
  onSeedData,
  onRefresh,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-base-100/90 backdrop-blur-md border-b border-base-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="navbar min-h-16 px-0 gap-3">
          {/* Brand Logo & Name */}
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-content shadow-md shadow-primary/20">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ProductHub
                </span>
                <span className="badge badge-sm badge-outline font-semibold">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-base-content/60 hidden sm:block">
                Inventory & Catalog Management
              </p>
            </div>
          </div>

          {/* Center/Right Status & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Backend Connectivity Status Badge */}
            <div className="hidden md:flex items-center">
              {backendOnline ? (
                <div
                  className="badge badge-success/15 text-success border-success/30 gap-1.5 py-3 px-3 text-xs font-medium"
                  title={`Backend online • Database: ${dbStatus}`}
                >
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span>API Connected</span>
                  <span className="opacity-60 text-[10px]">({dbStatus})</span>
                </div>
              ) : (
                <div
                  className="badge badge-error/15 text-error border-error/30 gap-1.5 py-3 px-3 text-xs font-medium"
                  title="Backend is not responding at http://localhost:5000/api"
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>API Offline</span>
                </div>
              )}
            </div>

            {/* Refresh Data Button */}
            <button
              type="button"
              onClick={onRefresh}
              className="btn btn-ghost btn-sm btn-circle tooltip tooltip-bottom"
              data-tip="Refresh Data"
              aria-label="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="btn btn-ghost btn-sm btn-circle tooltip tooltip-bottom"
              data-tip={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-base-content/70" />
              ) : (
                <Sun className="w-4 h-4 text-warning" />
              )}
            </button>

            {/* Seed Demo Products Button */}
            <button
              type="button"
              onClick={onSeedData}
              disabled={isSeeding || !backendOnline}
              className="btn btn-outline btn-sm gap-1.5 hidden sm:inline-flex"
            >
              {isSeeding ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  <span>Seeding...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-warning" />
                  <span>Seed Demo</span>
                </>
              )}
            </button>

            {/* Add Product Button */}
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="btn btn-primary btn-sm gap-1.5 shadow-sm shadow-primary/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
