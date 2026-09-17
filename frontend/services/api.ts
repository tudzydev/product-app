import {
  ApiResponse,
  CategoryCount,
  FilterParams,
  PaginationMeta,
  Product,
  ProductFormData,
  ProductStats,
} from "@/types/product";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export async function checkBackendHealth(): Promise<{
  online: boolean;
  database: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${API_BASE}/health`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        online: true,
        database: data.database || "unknown",
      };
    }
    return { online: false, database: "disconnected" };
  } catch {
    return { online: false, database: "disconnected" };
  }
}

export async function fetchProducts(
  params: FilterParams = {}
): Promise<{ products: Product[]; pagination: PaginationMeta }> {
  const query = new URLSearchParams();

  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.category && params.category !== "All")
    query.set("category", params.category);
  if (params.minPrice !== undefined && params.minPrice !== "")
    query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined && params.maxPrice !== "")
    query.set("maxPrice", String(params.maxPrice));
  if (params.inStock !== undefined && params.inStock !== "")
    query.set("inStock", String(params.inStock));
  if (params.isActive !== undefined && params.isActive !== "")
    query.set("isActive", String(params.isActive));
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.order) query.set("order", params.order);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const url = `${API_BASE}/products?${query.toString()}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Failed to fetch products: ${res.statusText}`);
  }

  const json: ApiResponse<Product[]> = await res.json();
  return {
    products: json.data || [],
    pagination: json.pagination || {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, { cache: "no-store" });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Failed to fetch product");
  }
  const json: ApiResponse<Product> = await res.json();
  if (!json.data) throw new Error("Product data not found");
  return json.data;
}

export async function createProduct(
  data: ProductFormData
): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      description: data.description || null,
      price: Number(data.price),
      category: data.category || "General",
      stock: Number(data.stock || 0),
      imageUrl: data.imageUrl || null,
      sku: data.sku || null,
      isActive: data.isActive,
    }),
  });

  const json: ApiResponse<Product> = await res.json();
  if (!res.ok) {
    throw new Error(json.message || json.errors?.join(", ") || "Failed to create product");
  }
  return json.data!;
}

export async function updateProduct(
  id: number,
  data: Partial<ProductFormData>
): Promise<Product> {
  const payload: any = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.description !== undefined) payload.description = data.description || null;
  if (data.price !== undefined && data.price !== "") payload.price = Number(data.price);
  if (data.category !== undefined) payload.category = data.category;
  if (data.stock !== undefined && data.stock !== "") payload.stock = Number(data.stock);
  if (data.imageUrl !== undefined) payload.imageUrl = data.imageUrl || null;
  if (data.sku !== undefined) payload.sku = data.sku || null;
  if (data.isActive !== undefined) payload.isActive = data.isActive;

  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: ApiResponse<Product> = await res.json();
  if (!res.ok) {
    throw new Error(json.message || json.errors?.join(", ") || "Failed to update product");
  }
  return json.data!;
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Failed to delete product");
  }
}

export async function fetchCategories(): Promise<CategoryCount[]> {
  const res = await fetch(`${API_BASE}/products/categories`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return [];
  }
  const json: ApiResponse<CategoryCount[]> = await res.json();
  return json.data || [];
}

export async function fetchStats(): Promise<ProductStats | null> {
  try {
    const res = await fetch(`${API_BASE}/products/stats`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json: ApiResponse<ProductStats> = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function seedDemoProducts(
  force: boolean = false
): Promise<{ count: number; message: string }> {
  const res = await fetch(`${API_BASE}/products/seed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ force }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to seed demo products");
  }
  return {
    count: json.count || 0,
    message: json.message || "Seeding complete",
  };
}
