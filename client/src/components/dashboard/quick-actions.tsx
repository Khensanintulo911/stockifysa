import { useState } from "react";
import { Plus, DollarSign, RefreshCw, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddProductModal from "@/components/modals/add-product-modal";
import RecordSaleModal from "@/components/modals/record-sale-modal";
import UpdateStockModal from "@/components/modals/update-stock-modal";

export default function QuickActions() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showRecordSale, setShowRecordSale] = useState(false);
  const [showUpdateStock, setShowUpdateStock] = useState(false);

  const actions = [
    {
      title: "Add Product",
      icon: Plus,
      iconColor: "text-primary",
      onClick: () => setShowAddProduct(true),
    },
    {
      title: "Record Sale",
      icon: DollarSign,
      iconColor: "text-secondary",
      onClick: () => setShowRecordSale(true),
    },
    {
      title: "Update Stock",
      icon: RefreshCw,
      iconColor: "text-warning",
      onClick: () => setShowUpdateStock(true),
    },
    {
      title: "Generate Report",
      icon: FileText,
      iconColor: "text-purple-600",
      onClick: () => {
        // Navigate to reports
        window.location.href = "/reports";
      },
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((action) => {
              const Icon = action.icon;
              
              return (
                <Button
                  key={action.title}
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto space-y-2 border border-gray-200 hover:bg-gray-50 hover:border-primary transition-all duration-200"
                  onClick={action.onClick}
                >
                  <Icon className={`w-8 h-8 ${action.iconColor}`} />
                  <span className="text-sm font-medium text-gray-700">{action.title}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AddProductModal open={showAddProduct} onClose={() => setShowAddProduct(false)} />
      <RecordSaleModal open={showRecordSale} onClose={() => setShowRecordSale(false)} />
      <UpdateStockModal open={showUpdateStock} onClose={() => setShowUpdateStock(false)} />
    </>
  );
}
