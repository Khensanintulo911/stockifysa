import { useState } from "react";
import { ArrowUpDown, Package, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpdateStockModal from "@/components/modals/update-stock-modal";
import { Button } from "@/components/ui/button";
import type { Product, StockMovement } from "@shared/schema";

interface InventoryTableProps {
  products: Product[];
  stockMovements: StockMovement[];
}

export default function InventoryTable({ products, stockMovements }: InventoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showUpdateStock, setShowUpdateStock] = useState(false);

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const, level: "critical" };
    if (stock <= threshold) return { label: "Low Stock", variant: "secondary" as const, level: "warning" };
    return { label: "In Stock", variant: "default" as const, level: "normal" };
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const status = getStockStatus(product.stock, product.lowStockThreshold);
    const matchesStatus = statusFilter === "all" || status.level === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const recentMovements = stockMovements.slice(0, 10);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Inventory Overview</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Inventory Levels</CardTitle>
              <Button onClick={() => setShowUpdateStock(true)} className="bg-warning hover:bg-yellow-600 text-white">
                Update Stock
              </Button>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="critical">Out of Stock</SelectItem>
                    <SelectItem value="warning">Low Stock</SelectItem>
                    <SelectItem value="normal">In Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3">Product</th>
                      <th className="text-left py-3">SKU</th>
                      <th className="text-left py-3">Current Stock</th>
                      <th className="text-left py-3">Low Stock Alert</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => {
                      const status = getStockStatus(product.stock, product.lowStockThreshold);
                      const stockValue = product.stock * parseFloat(product.price);
                      
                      return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0">
                                <Package className="w-6 h-6 text-gray-400 m-2" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-gray-600">{product.sku}</td>
                          <td className="py-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{product.stock}</span>
                              <div className={`w-2 h-2 rounded-full ${
                                status.level === 'critical' ? 'bg-red-500' :
                                status.level === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-gray-600">{product.lowStockThreshold}</td>
                          <td className="py-4">
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </td>
                          <td className="py-4 text-sm font-medium text-gray-900">
                            ${stockValue.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3">Date</th>
                      <th className="text-left py-3">Product</th>
                      <th className="text-left py-3">Type</th>
                      <th className="text-left py-3">Quantity</th>
                      <th className="text-left py-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentMovements.map((movement) => {
                      const product = products.find(p => p.id === movement.productId);
                      
                      return (
                        <tr key={movement.id} className="hover:bg-gray-50">
                          <td className="py-4 text-sm text-gray-600">
                            {new Date(movement.createdAt!).toLocaleDateString()}
                          </td>
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-gray-900">{product?.name || 'Unknown Product'}</p>
                              <p className="text-sm text-gray-500">{product?.sku}</p>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-2">
                              {movement.type === 'in' ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              )}
                              <span className={`text-sm font-medium ${
                                movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {movement.type === 'in' ? 'Stock In' : 'Stock Out'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-gray-600">{movement.quantity}</td>
                          <td className="py-4 text-sm text-gray-600 capitalize">{movement.reason}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {recentMovements.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No stock movements found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UpdateStockModal open={showUpdateStock} onClose={() => setShowUpdateStock(false)} />
    </div>
  );
}
