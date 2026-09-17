"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Package,
  Plus,
  Sparkles,
  AlertTriangle,
  RotateCw,
  SearchX,
  ServerOff,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StatsSection } from "@/components/StatsSection";
import { FilterBar } from "@/components/FilterBar";
import { ProductCard } from "@/components/ProductCard";
import { ProductTable } from "@/components/ProductTable";
import { ProductModal } from "@/components/ProductModal";
import { ProductDetailsModal } from "@/components/ProductDetailsModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { Pagination } from "@/components/Pagination";
import { ToastContainer, ToastMessage } from "@/components/Toast";
import {
  CategoryCount,
  FilterParams,
  PaginationMeta,
  Product,
  ProductFormData,
  ProductStats,
} from "@/types/product";
import {
  checkBackendHealth,
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  fetchStats,
  seedDemoProducts,
  updateProduct,
} from "@/services/api";

export default function Home() {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Backend status
  const [backendOnline, setBackendOnline] = useState(false);
  const [dbStatus, setDbStatus] = useState("disconnected");
  const [checkedHealth, setCheckedHealth] = useState(false);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // View & Filter states
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [filters, setFilters] = useState<FilterParams>({
    search: "",
    category: "All",
    minPrice: "",
    maxPrice: "",
    inStock: "",
    isActive: "",
    sortBy: "createdAt",
    order: "DESC",
    page: 1,
    limit: 12,
  });

  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToView, setProductToView] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  // Check Backend Connectivity
  const verifyBackend = useCallback(async () => {
    const health = await checkBackendHealth();
    setBackendOnline(health.online);
    setDbStatus(health.database);
    setCheckedHealth(true);
    return health.online;
  }, []);

  // Fetch Core Data (Categories, Stats)
  const loadMetadata = useCallback(async () => {
    setStatsLoading(true);
    try {
      const [cats, statsData] = await Promise.all([
        fetchCategories(),
        fetchStats(),
      ]);
      setCategories(cats);
      setStats(statsData);
    } catch {
      // Ignore metadata failures if backend is offline
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Products based on current filters
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchProducts(filters);
      setProducts(result.products);
      setPagination(result.pagination);
    } catch (err: any) {
      if (backendOnline) {
        addToast("error", err.message || "Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  }, [filters, backendOnline]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      const online = await verifyBackend();
      if (online) {
        loadMetadata();
      }
      loadProducts();
    };
    init();
  }, [verifyBackend, loadMetadata, loadProducts]);

  // Debounced Search filter
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleFilterChange = (updated: Partial<FilterParams>) => {
    if ("search" in updated) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        setFilters((prev) => ({ ...prev, ...updated, page: 1 }));
      }, 300);
    } else {
      setFilters((prev) => ({ ...prev, ...updated }));
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "All",
      minPrice: "",
      maxPrice: "",
      inStock: "",
      isActive: "",
      sortBy: "createdAt",
      order: "DESC",
      page: 1,
      limit: 12,
    });
  };

  // Handle Create or Update
  const handleSaveProduct = async (formData: ProductFormData) => {
    if (productToEdit) {
      const updated = await updateProduct(productToEdit.id, formData);
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      addToast("success", `Product "${updated.name}" updated successfully!`);
    } else {
      const created = await createProduct(formData);
      setProducts((prev) => [created, ...prev]);
      addToast("success", `Product "${created.name}" created successfully!`);
    }
    loadMetadata();
    loadProducts();
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setIsDeleting(true);
      await deleteProduct(productToDelete.id);
      addToast(
        "success",
        `Product "${productToDelete.name}" deleted successfully.`
      );
      setProductToDelete(null);
      loadMetadata();
      loadProducts();
    } catch (err: any) {
      addToast("error", err.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Seeding Demo Products
  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await seedDemoProducts(false);
      addToast("success", res.message);
      await loadMetadata();
      await loadProducts();
    } catch (err: any) {
      addToast("error", err.message || "Failed to seed demo products");
    } finally {
      setIsSeeding(false);
    }
  };

  // Refresh All Data
  const handleRefresh = async () => {
    await verifyBackend();
    await loadMetadata();
    await loadProducts();
    addToast("info", "Data refreshed");
  };

  const categoryNames = categories.map((c) => c.category);

  return (
    <div className="min-h-screen flex flex-col bg-base-200/40 text-base-content selection:bg-primary/20 selection:text-primary">
      {/* Toast Alert Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Navigation Bar */}
      <Navbar
        backendOnline={backendOnline}
        dbStatus={dbStatus}
        isSeeding={isSeeding}
        onOpenCreateModal={() => {
          setProductToEdit(null);
          setIsProductModalOpen(true);
        }}
        onSeedData={handleSeedData}
        onRefresh={handleRefresh}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Backend Offline Warning Banner */}
        {checkedHealth && !backendOnline && (
          <div className="alert alert-warning shadow-md rounded-2xl border border-warning/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <ServerOff className="w-5 h-5 flex-shrink-0 text-warning" />
              <div>
                <h4 className="font-bold text-sm">Backend API is currently offline</h4>
                <p className="text-xs text-base-content/70 mt-0.5">
                  Cannot connect to <code className="font-mono font-semibold">http://localhost:5000/api</code>.
                  Start the backend container via <code className="bg-base-100 px-1.5 py-0.5 rounded font-mono font-semibold">docker compose up</code> or run <code className="bg-base-100 px-1.5 py-0.5 rounded font-mono font-semibold">npm run dev</code> inside <code className="font-mono">backend/</code>.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="btn btn-sm btn-outline border-warning/50 hover:bg-warning hover:text-warning-content rounded-xl whitespace-nowrap"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Inventory Statistics Section */}
        <StatsSection stats={stats} loading={statsLoading} />

        {/* Filters, Search and View Controls */}
        <FilterBar
          filters={filters}
          categories={categories}
          totalProducts={pagination.total}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Product Catalog Display */}
        {loading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-base-200 border border-base-300"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          // Products Content
          <div className="space-y-4">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={(p) => setProductToView(p)}
                    onEdit={(p) => {
                      setProductToEdit(p);
                      setIsProductModalOpen(true);
                    }}
                    onDelete={(p) => setProductToDelete(p)}
                  />
                ))}
              </div>
            ) : (
              <ProductTable
                products={products}
                onView={(p) => setProductToView(p)}
                onEdit={(p) => {
                  setProductToEdit(p);
                  setIsProductModalOpen(true);
                }}
                onDelete={(p) => setProductToDelete(p)}
              />
            )}

            {/* Pagination */}
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
              onLimitChange={(limit) =>
                setFilters((f) => ({ ...f, limit, page: 1 }))
              }
            />
          </div>
        ) : (
          // Empty State
          <div className="bg-base-100 rounded-3xl border border-base-200 shadow-sm p-12 text-center max-w-lg mx-auto my-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mx-auto text-base-content/40">
              {filters.search || filters.category !== "All" ? (
                <SearchX className="w-8 h-8" />
              ) : (
                <Package className="w-8 h-8" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-base-content">
                {filters.search || filters.category !== "All"
                  ? "No matching products"
                  : "Your product catalog is empty"}
              </h3>
              <p className="text-xs text-base-content/60 mt-1 max-w-xs mx-auto">
                {filters.search || filters.category !== "All"
                  ? "No items match your active search and filter criteria. Try adjusting or clearing your filters."
                  : "Get started by adding your first product, or seed the catalog with realistic sample items."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {filters.search || filters.category !== "All" ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-outline btn-sm rounded-xl"
                >
                  Clear All Filters
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSeedData}
                    disabled={isSeeding || !backendOnline}
                    className="btn btn-outline btn-sm rounded-xl gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-warning" />
                    <span>Seed Demo Products</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProductToEdit(null);
                      setIsProductModalOpen(true);
                    }}
                    className="btn btn-primary btn-sm rounded-xl gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Product</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-base-200 bg-base-100 py-6 text-center text-xs text-base-content/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ProductHub
            </span>
            <span>&bull; Fullstack Product & Inventory Management</span>
          </div>
          <div>
            Built with Next.js 16 &bull; Tailwind CSS &bull; DaisyUI 5 &bull; PostgreSQL
          </div>
        </div>
      </footer>

      {/* Product Create/Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        onSubmit={handleSaveProduct}
        productToEdit={productToEdit}
        categories={categoryNames}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={productToView}
        isOpen={Boolean(productToView)}
        onClose={() => setProductToView(null)}
        onEdit={(p) => {
          setProductToView(null);
          setProductToEdit(p);
          setIsProductModalOpen(true);
        }}
        onDelete={(p) => {
          setProductToView(null);
          setProductToDelete(p);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        product={productToDelete}
        isOpen={Boolean(productToDelete)}
        isDeleting={isDeleting}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
