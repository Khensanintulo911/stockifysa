import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import InventoryTable from "@/components/inventory/inventory-table";

export default function Inventory() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => api.getProducts(),
  });

  const { data: stockMovements, isLoading: movementsLoading } = useQuery({
    queryKey: ['/api/stock-movements'],
    queryFn: () => api.getStockMovements(),
  });

  if (isLoading || movementsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <p className="text-sm text-gray-500">Track and manage your inventory levels</p>
      </div>

      <InventoryTable products={products || []} stockMovements={stockMovements || []} />
    </div>
  );
}
