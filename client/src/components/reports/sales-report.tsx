import { useState, useMemo } from "react";
import { TrendingUp, DollarSign, ShoppingCart, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { SaleWithProduct } from "@shared/schema";

interface SalesReportProps {
  sales: SaleWithProduct[];
}

export default function SalesReport({ sales }: SalesReportProps) {
  const [dateFilter, setDateFilter] = useState("month");

  const getFilteredSales = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (dateFilter) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "quarter":
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStart, 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return sales;
    }

    return sales.filter(sale => new Date(sale.saleDate!) >= startDate);
  }, [sales, dateFilter]);

  const salesMetrics = useMemo(() => {
    const totalRevenue = getFilteredSales.reduce((sum, sale) => sum + parseFloat(sale.totalPrice), 0);
    const totalQuantity = getFilteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
    const averageOrderValue = getFilteredSales.length > 0 ? totalRevenue / getFilteredSales.length : 0;

    // Group by product for top sellers
    const productSales = getFilteredSales.reduce((acc, sale) => {
      const productId = sale.product.id;
      if (!acc[productId]) {
        acc[productId] = {
          product: sale.product,
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }
      acc[productId].totalQuantity += sale.quantity;
      acc[productId].totalRevenue += parseFloat(sale.totalPrice);
      return acc;
    }, {} as Record<string, { product: any; totalQuantity: number; totalRevenue: number }>);

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    // Group by date for daily sales
    const dailySales = getFilteredSales.reduce((acc, sale) => {
      const date = new Date(sale.saleDate!).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { revenue: 0, transactions: 0 };
      }
      acc[date].revenue += parseFloat(sale.totalPrice);
      acc[date].transactions += 1;
      return acc;
    }, {} as Record<string, { revenue: number; transactions: number }>);

    return {
      totalRevenue,
      totalTransactions: getFilteredSales.length,
      totalQuantity,
      averageOrderValue,
      topProducts,
      dailySales,
    };
  }, [getFilteredSales]);

  const getPeriodLabel = () => {
    switch (dateFilter) {
      case "today": return "Today";
      case "week": return "This Week";
      case "month": return "This Month";
      case "quarter": return "This Quarter";
      case "year": return "This Year";
      default: return "All Time";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Sales Performance</h2>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">R{salesMetrics.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{getPeriodLabel()}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{salesMetrics.totalTransactions}</p>
                <p className="text-xs text-gray-500">{getPeriodLabel()}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items Sold</p>
                <p className="text-2xl font-bold text-gray-900">{salesMetrics.totalQuantity}</p>
                <p className="text-xs text-gray-500">{getPeriodLabel()}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-2xl font-bold text-gray-900">R{salesMetrics.averageOrderValue.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{getPeriodLabel()}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesMetrics.topProducts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No sales data available</p>
              ) : (
                salesMetrics.topProducts.map((item, index) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-500">{item.totalQuantity} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">R{item.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sales Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Sales Chart</p>
                <p className="text-xs text-gray-400">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Product</th>
                  <th className="text-left py-3">Quantity</th>
                  <th className="text-left py-3">Unit Price</th>
                  <th className="text-left py-3">Total</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getFilteredSales.slice(0, 10).map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="py-4 text-sm text-gray-600">
                      {new Date(sale.saleDate!).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-gray-900">{sale.product.name}</p>
                        <p className="text-sm text-gray-500">{sale.product.sku}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{sale.quantity}</td>
                    <td className="py-4 text-sm text-gray-600">${sale.unitPrice}</td>
                    <td className="py-4 text-sm font-medium text-gray-900">${sale.totalPrice}</td>
                    <td className="py-4">
                      <Badge variant="default">Completed</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {getFilteredSales.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No sales data available for the selected period</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
