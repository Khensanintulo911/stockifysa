import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LowStockItem } from "@shared/schema";

interface LowStockAlertProps {
  lowStockItems: LowStockItem[];
}

export default function LowStockAlert({ lowStockItems }: LowStockAlertProps) {
  const handleRestockItems = () => {
    // Navigate to inventory management
    window.location.href = "/inventory";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <span>Low Stock Alert</span>
          <AlertTriangle className="w-5 h-5 text-warning" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lowStockItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No low stock items</p>
            </div>
          ) : (
            <>
              {lowStockItems.map((item) => {
                const isVeryLow = item.stock <= item.lowStockThreshold * 0.5;
                
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isVeryLow 
                        ? "bg-red-50 border-red-200" 
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex-shrink-0 ${
                        isVeryLow ? "bg-red-200" : "bg-yellow-200"
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        isVeryLow ? "text-red-600" : "text-yellow-600"
                      }`}>
                        {item.stock}
                      </p>
                      <p className="text-xs text-gray-500">remaining</p>
                    </div>
                  </div>
                );
              })}
              
              <Button 
                onClick={handleRestockItems}
                className="w-full mt-4 bg-warning hover:bg-yellow-600 text-white"
              >
                Restock Items
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
