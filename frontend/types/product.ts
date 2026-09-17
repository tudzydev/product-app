export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  imageUrl: string | null;
  sku: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number | "";
  category: string;
  stock: number | "";
  imageUrl: string;
  sku: string;
  isActive: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inStock: number;
  outOfStock: number;
  totalUnits: number;
  totalInventoryValue: number;
  averagePrice: number;
}

export interface CategoryCount {
  category: string;
  productCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: PaginationMeta;
}

export interface FilterParams {
  search?: string;
  category?: string;
  minPrice?: number | "";
  maxPrice?: number | "";
  inStock?: boolean | "";
  isActive?: boolean | "";
  sortBy?: string;
  order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}
