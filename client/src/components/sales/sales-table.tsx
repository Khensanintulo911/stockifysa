import { useState } from "react";
import { DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SaleWithProduct } from "@shared/schema";

interface SalesTableProps {
  sales: SaleWithProduct[];
}

export default function SalesTable({ sales }: SalesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const getDateFilteredSales = () => {
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
      default:
        return sales;
    }

    return sales.filter(sale => new Date(sale.saleDate!) >= startDate);
  };

  const filteredSales = getDateFilteredSales().filter(sale => {
    const matchesSearch = sale.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sale.product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalSales = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.totalPrice), 0);
  const totalQuantity = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">${totalSales.toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-gray-900">{filteredSales.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items Sold</p>
                <p className="text-2xl font-bold text-gray-900">{totalQuantity}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Transactions</CardTitle>
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
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Product</th>
                  <th className="text-left py-3">SKU</th>
                  <th className="text-left py-3">Quantity</th>
                  <th className="text-left py-3">Unit Price</th>
                  <th className="text-left py-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="py-4 text-sm text-gray-600">
                      {new Date(sale.saleDate!).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-900">{sale.product.name}</p>
                          <p className="text-sm text-gray-500">{sale.product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{sale.product.sku}</td>
                    <td className="py-4 text-sm text-gray-600">{sale.quantity}</td>
                    <td className="py-4 text-sm text-gray-600">${sale.unitPrice}</td>
                    <td className="py-4 text-sm font-medium text-gray-900">${sale.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSales.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No sales found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
