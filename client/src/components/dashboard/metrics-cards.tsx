import { Package, AlertTriangle, DollarSign, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardMetrics } from "@shared/schema";

interface MetricsCardsProps {
  metrics?: DashboardMetrics;
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Products",
      value: metrics.totalProducts.toLocaleString(),
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: Package,
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
    },
    {
      title: "Low Stock Items",
      value: metrics.lowStockItems.toString(),
      change: "Requires attention",
      changeType: "warning" as const,
      icon: AlertTriangle,
      iconBg: "bg-orange-100",
      iconColor: "text-warning",
    },
    {
      title: "Total Sales",
      value: `R${metrics.totalSales.toLocaleString()}`,
      change: "+8% from last month",
      changeType: "positive" as const,
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-secondary",
    },
    {
      title: "Inventory Value",
      value: `R${metrics.inventoryValue.toLocaleString()}`,
      change: "+3% from last month",
      changeType: "positive" as const,
      icon: BarChart3,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  <p className={`text-xs mt-1 inline-flex items-center ${
                    card.changeType === 'positive' 
                      ? 'text-secondary' 
                      : card.changeType === 'warning' 
                      ? 'text-danger' 
                      : 'text-secondary'
                  }`}>
                    {card.changeType === 'positive' && (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    )}
                    {card.changeType === 'warning' && (
                      <AlertTriangle className="w-3 h-3 mr-1" />
                    )}
                    {card.change}
                  </p>
                </div>
                <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
