import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import MetricsCards from "@/components/dashboard/metrics-cards";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentProducts from "@/components/dashboard/recent-products";
import LowStockAlert from "@/components/dashboard/low-stock-alert";
import SalesChart from "@/components/dashboard/sales-chart";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    queryFn: () => api.getDashboardMetrics(),
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => api.getProducts(),
  });

  const { data: lowStockProducts, isLoading: lowStockLoading } = useQuery({
    queryKey: ['/api/products/low-stock'],
    queryFn: () => api.getLowStockProducts(),
  });

  if (metricsLoading || productsLoading || lowStockLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <MetricsCards metrics={metrics} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />
          <RecentProducts products={products?.slice(0, 5) || []} />
        </div>

        {/* Low Stock Alert & Sales Chart */}
        <div className="space-y-6">
          <LowStockAlert lowStockItems={lowStockProducts || []} />
          <SalesChart metrics={metrics} />
        </div>
      </div>
    </div>
  );
}
