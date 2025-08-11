import { useMemo } from "react";
import { Package, AlertTriangle, TrendingDown, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Product, LowStockItem } from "@shared/schema";

interface InventoryReportProps {
  products: Product[];
  lowStockProducts: LowStockItem[];
}

export default function InventoryReport({ products, lowStockProducts }: InventoryReportProps) {
  const inventoryMetrics = useMemo(() => {
    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, product) => {
      return sum + (parseFloat(product.price) * product.stock);
    }, 0);

    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const lowStockCount = lowStockProducts.length;
    const inStockProducts = totalProducts - outOfStockProducts - lowStockCount;

    // Category breakdown
    const categoryBreakdown = products.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = {
          count: 0,
          totalStock: 0,
          totalValue: 0,
        };
      }
      acc[category].count += 1;
      acc[category].totalStock += product.stock;
      acc[category].totalValue += parseFloat(product.price) * product.stock;
      return acc;
    }, {} as Record<string, { count: number; totalStock: number; totalValue: number }>);

    // Top value products
    const topValueProducts = [...products]
      .sort((a, b) => (parseFloat(b.price) * b.stock) - (parseFloat(a.price) * a.stock))
      .slice(0, 5);

    return {
      totalProducts,
      totalStockValue,
      outOfStockProducts,
      lowStockCount,
      inStockProducts,
      categoryBreakdown,
      topValueProducts,
    };
  }, [products, lowStockProducts]);

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const, color: "bg-red-500" };
    if (stock <= threshold) return { label: "Low Stock", variant: "secondary" as const, color: "bg-yellow-500" };
    return { label: "In Stock", variant: "default" as const, color: "bg-green-500" };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Inventory Analysis</h2>

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">${inventoryMetrics.totalStockValue.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart className="w-5 h-5 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products In Stock</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryMetrics.inStockProducts}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryMetrics.lowStockCount}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryMetrics.outOfStockProducts}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">In Stock</span>
              <span className="text-sm text-gray-900">{inventoryMetrics.inStockProducts} products</span>
            </div>
            <Progress 
              value={(inventoryMetrics.inStockProducts / inventoryMetrics.totalProducts) * 100} 
              className="h-2"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Low Stock</span>
              <span className="text-sm text-gray-900">{inventoryMetrics.lowStockCount} products</span>
            </div>
            <Progress 
              value={(inventoryMetrics.lowStockCount / inventoryMetrics.totalProducts) * 100} 
              className="h-2"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Out of Stock</span>
              <span className="text-sm text-gray-900">{inventoryMetrics.outOfStockProducts} products</span>
            </div>
            <Progress 
              value={(inventoryMetrics.outOfStockProducts / inventoryMetrics.totalProducts) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown and Top Value Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(inventoryMetrics.categoryBreakdown).map(([category, data]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{category}</p>
                    <p className="text-sm text-gray-500">{data.count} products • {data.totalStock} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${data.totalValue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Value Products */}
        <Card>
          <CardHeader>
            <CardTitle>Highest Value Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryMetrics.topValueProducts.map((product, index) => {
                const totalValue = parseFloat(product.price) * product.stock;
                const status = getStockStatus(product.stock, product.lowStockThreshold);
                
                return (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.stock} units @ ${product.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${totalValue.toFixed(2)}</p>
                      <Badge variant={status.variant} className="text-xs">{status.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span>Critical Stock Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3">Product</th>
                    <th className="text-left py-3">SKU</th>
                    <th className="text-left py-3">Current Stock</th>
                    <th className="text-left py-3">Threshold</th>
                    <th className="text-left py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lowStockProducts.map((item) => {
                    const isVeryLow = item.stock <= item.lowStockThreshold * 0.5;
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-4">
                          <p className="font-medium text-gray-900">{item.name}</p>
                        </td>
                        <td className="py-4 text-sm text-gray-600">{item.sku}</td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${isVeryLow ? 'text-red-600' : 'text-yellow-600'}`}>
                              {item.stock}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${isVeryLow ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-600">{item.lowStockThreshold}</td>
                        <td className="py-4">
                          <Badge variant={isVeryLow ? "destructive" : "secondary"}>
                            {isVeryLow ? "Critical" : "Low Stock"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
