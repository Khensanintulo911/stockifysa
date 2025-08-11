import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Download, Calendar, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import SalesReport from "@/components/reports/sales-report";
import InventoryReport from "@/components/reports/inventory-report";
import ExportModal from "@/components/reports/export-modal";

export default function Reports() {
  const [showExportModal, setShowExportModal] = useState(false);

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    queryFn: () => api.getDashboardMetrics(),
  });

  const { data: sales, isLoading: salesLoading } = useQuery({
    queryKey: ['/api/sales'],
    queryFn: () => api.getSales(),
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => api.getProducts(),
  });

  const { data: lowStockProducts, isLoading: lowStockLoading } = useQuery({
    queryKey: ['/api/products/low-stock'],
    queryFn: () => api.getLowStockProducts(),
  });

  if (metricsLoading || salesLoading || productsLoading || lowStockLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading reports...</div>
      </div>
    );
  }

  const reportSummary = [
    {
      title: "Total Revenue",
      value: `$${metrics?.totalSales?.toLocaleString() || '0'}`,
      icon: BarChart3,
      iconBg: "bg-green-100",
      iconColor: "text-secondary",
    },
    {
      title: "Products Tracked",
      value: metrics?.totalProducts?.toString() || '0',
      icon: FileText,
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
    },
    {
      title: "Low Stock Alerts",
      value: metrics?.lowStockItems?.toString() || '0',
      icon: Calendar,
      iconBg: "bg-orange-100",
      iconColor: "text-warning",
    },
    {
      title: "Total Transactions",
      value: sales?.length?.toString() || '0',
      icon: Download,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Generate comprehensive business reports</p>
        </div>
        <Button onClick={() => setShowExportModal(true)} className="bg-primary hover:bg-primary-dark">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportSummary.map((item) => {
          const Icon = item.icon;
          
          return (
            <Card key={item.title} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{item.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  </div>
                  <div className={`w-10 h-10 ${item.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <SalesReport sales={sales || []} />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryReport products={products || []} lowStockProducts={lowStockProducts || []} />
        </TabsContent>
      </Tabs>

      <ExportModal 
        open={showExportModal} 
        onClose={() => setShowExportModal(false)}
        sales={sales || []}
        products={products || []}
      />
    </div>
  );
}
