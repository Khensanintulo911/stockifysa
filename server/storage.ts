import { type User, type InsertUser, type Product, type InsertProduct, type Sale, type InsertSale, type StockMovement, type InsertStockMovement, type DashboardMetrics, type LowStockItem, type SaleWithProduct } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  getLowStockProducts(): Promise<LowStockItem[]>;

  // Sale methods
  getSales(): Promise<SaleWithProduct[]>;
  getSale(id: string): Promise<Sale | undefined>;
  createSale(sale: InsertSale): Promise<Sale>;
  getSalesByDateRange(startDate: Date, endDate: Date): Promise<SaleWithProduct[]>;

  // Stock movement methods
  getStockMovements(productId?: string): Promise<StockMovement[]>;
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;

  // Dashboard metrics
  getDashboardMetrics(): Promise<DashboardMetrics>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private sales: Map<string, Sale>;
  private stockMovements: Map<string, StockMovement>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.sales = new Map();
    this.stockMovements = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed some sample products
    const sampleProducts: Product[] = [
      {
        id: randomUUID(),
        name: "Wireless Headphones",
        sku: "WHD-001",
        description: "High-quality wireless headphones with noise cancellation",
        category: "Electronics",
        price: "89.99",
        stock: 156,
        lowStockThreshold: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Smart Watch",
        sku: "SW-002",
        description: "Advanced smartwatch with health monitoring",
        category: "Electronics",
        price: "299.99",
        stock: 23,
        lowStockThreshold: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Bluetooth Speaker",
        sku: "BS-003",
        description: "Portable Bluetooth speaker with premium sound",
        category: "Electronics",
        price: "49.99",
        stock: 89,
        lowStockThreshold: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "USB Cable",
        sku: "UC-004",
        description: "High-speed USB-C cable",
        category: "Electronics",
        price: "12.99",
        stock: 5,
        lowStockThreshold: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Phone Case",
        sku: "PC-005",
        description: "Protective phone case",
        category: "Electronics",
        price: "24.99",
        stock: 18,
        lowStockThreshold: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });

    // Seed some sample sales
    const product1 = Array.from(this.products.values())[0];
    const product2 = Array.from(this.products.values())[1];
    
    const sampleSales: Sale[] = [
      {
        id: randomUUID(),
        productId: product1.id,
        quantity: 2,
        unitPrice: "89.99",
        totalPrice: "179.98",
        saleDate: new Date(Date.now() - 86400000), // Yesterday
      },
      {
        id: randomUUID(),
        productId: product2.id,
        quantity: 1,
        unitPrice: "299.99",
        totalPrice: "299.99",
        saleDate: new Date(Date.now() - 172800000), // 2 days ago
      },
    ];

    sampleSales.forEach(sale => {
      this.sales.set(sale.id, sale);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.sku === sku);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const now = new Date();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product> {
    const existing = this.products.get(id);
    if (!existing) {
      throw new Error('Product not found');
    }
    
    const updated: Product = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getLowStockProducts(): Promise<LowStockItem[]> {
    return Array.from(this.products.values())
      .filter(product => product.stock <= product.lowStockThreshold)
      .map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
      }))
      .sort((a, b) => a.stock - b.stock);
  }

  // Sale methods
  async getSales(): Promise<SaleWithProduct[]> {
    const salesArray = Array.from(this.sales.values()).sort((a, b) => 
      new Date(b.saleDate!).getTime() - new Date(a.saleDate!).getTime()
    );
    
    return salesArray.map(sale => {
      const product = this.products.get(sale.productId);
      return {
        ...sale,
        product: product!,
      };
    });
  }

  async getSale(id: string): Promise<Sale | undefined> {
    return this.sales.get(id);
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = randomUUID();
    const sale: Sale = {
      ...insertSale,
      id,
      saleDate: new Date(),
    };
    
    // Update product stock
    const product = this.products.get(insertSale.productId);
    if (product) {
      const updatedProduct = {
        ...product,
        stock: product.stock - insertSale.quantity,
        updatedAt: new Date(),
      };
      this.products.set(product.id, updatedProduct);
      
      // Create stock movement
      const stockMovement: StockMovement = {
        id: randomUUID(),
        productId: insertSale.productId,
        type: 'out',
        quantity: insertSale.quantity,
        reason: 'sale',
        createdAt: new Date(),
      };
      this.stockMovements.set(stockMovement.id, stockMovement);
    }
    
    this.sales.set(id, sale);
    return sale;
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<SaleWithProduct[]> {
    const salesArray = Array.from(this.sales.values())
      .filter(sale => {
        const saleDate = new Date(sale.saleDate!);
        return saleDate >= startDate && saleDate <= endDate;
      })
      .sort((a, b) => new Date(b.saleDate!).getTime() - new Date(a.saleDate!).getTime());
    
    return salesArray.map(sale => {
      const product = this.products.get(sale.productId);
      return {
        ...sale,
        product: product!,
      };
    });
  }

  // Stock movement methods
  async getStockMovements(productId?: string): Promise<StockMovement[]> {
    let movements = Array.from(this.stockMovements.values());
    
    if (productId) {
      movements = movements.filter(movement => movement.productId === productId);
    }
    
    return movements.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createStockMovement(insertMovement: InsertStockMovement): Promise<StockMovement> {
    const id = randomUUID();
    const movement: StockMovement = {
      ...insertMovement,
      id,
      createdAt: new Date(),
    };
    
    // Update product stock based on movement type
    const product = this.products.get(insertMovement.productId);
    if (product) {
      const stockChange = insertMovement.type === 'in' ? insertMovement.quantity : -insertMovement.quantity;
      const updatedProduct = {
        ...product,
        stock: product.stock + stockChange,
        updatedAt: new Date(),
      };
      this.products.set(product.id, updatedProduct);
    }
    
    this.stockMovements.set(id, movement);
    return movement;
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const products = Array.from(this.products.values());
    const sales = Array.from(this.sales.values());
    
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold).length;
    
    const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.totalPrice), 0);
    const inventoryValue = products.reduce((sum, product) => sum + (parseFloat(product.price) * product.stock), 0);
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const weekSales = sales
      .filter(sale => new Date(sale.saleDate!) >= weekAgo)
      .reduce((sum, sale) => sum + parseFloat(sale.totalPrice), 0);
    
    const monthSales = sales
      .filter(sale => new Date(sale.saleDate!) >= monthAgo)
      .reduce((sum, sale) => sum + parseFloat(sale.totalPrice), 0);
    
    return {
      totalProducts,
      lowStockItems,
      totalSales: Math.round(totalSales),
      inventoryValue: Math.round(inventoryValue),
      weekSales: Math.round(weekSales),
      monthSales: Math.round(monthSales),
    };
  }
}

export const storage = new MemStorage();
