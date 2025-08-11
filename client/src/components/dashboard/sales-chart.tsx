import { BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { DashboardMetrics } from "@shared/schema";

interface SalesChartProps {
  metrics?: DashboardMetrics;
}

export default function SalesChart({ metrics }: SalesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chart Placeholder */}
        <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Sales Chart</p>
            <p className="text-xs text-gray-400">Chart.js integration required</p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">This Week</p>
            <p className="text-xl font-bold text-gray-900">
              ${metrics?.weekSales.toLocaleString() || '0'}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-xl font-bold text-gray-900">
              ${metrics?.monthSales.toLocaleString() || '0'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
