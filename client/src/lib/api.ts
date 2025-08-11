import { apiRequest } from "./queryClient";
import type { Product, InsertProduct, Sale, InsertSale, InsertStockMovement, DashboardMetrics, LowStockItem, SaleWithProduct, StockMovement } from "@shared/schema";

export const api = {
  // Dashboard
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const res = await apiRequest("GET", "/api/dashboard/metrics");
    return res.json();
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    const res = await apiRequest("GET", "/api/products");
    return res.json();
  },

  getProduct: async (id: string): Promise<Product> => {
    const res = await apiRequest("GET", `/api/products/${id}`);
    return res.json();
  },

  createProduct: async (product: InsertProduct): Promise<Product> => {
    const res = await apiRequest("POST", "/api/products", product);
    return res.json();
  },

  updateProduct: async (id: string, updates: Partial<InsertProduct>): Promise<Product> => {
    const res = await apiRequest("PUT", `/api/products/${id}`, updates);
    return res.json();
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiRequest("DELETE", `/api/products/${id}`);
  },

  getLowStockProducts: async (): Promise<LowStockItem[]> => {
    const res = await apiRequest("GET", "/api/products/low-stock");
    return res.json();
  },

  // Sales
  getSales: async (): Promise<SaleWithProduct[]> => {
    const res = await apiRequest("GET", "/api/sales");
    return res.json();
  },

  createSale: async (sale: InsertSale): Promise<Sale> => {
    const res = await apiRequest("POST", "/api/sales", sale);
    return res.json();
  },

  // Stock movements
  getStockMovements: async (productId?: string): Promise<StockMovement[]> => {
    const url = productId ? `/api/stock-movements?productId=${productId}` : "/api/stock-movements";
    const res = await apiRequest("GET", url);
    return res.json();
  },

  createStockMovement: async (movement: InsertStockMovement): Promise<StockMovement> => {
    const res = await apiRequest("POST", "/api/stock-movements", movement);
    return res.json();
  },
};
