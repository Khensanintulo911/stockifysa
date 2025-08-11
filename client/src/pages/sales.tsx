import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import SalesTable from "@/components/sales/sales-table";
import RecordSaleModal from "@/components/modals/record-sale-modal";

export default function Sales() {
  const [showRecordSale, setShowRecordSale] = useState(false);

  const { data: sales, isLoading } = useQuery({
    queryKey: ['/api/sales'],
    queryFn: () => api.getSales(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading sales...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sales</h1>
          <p className="text-sm text-gray-500">Track and manage your sales transactions</p>
        </div>
        <Button onClick={() => setShowRecordSale(true)} className="bg-secondary hover:bg-secondary-dark">
          <Plus className="w-4 h-4 mr-2" />
          Record Sale
        </Button>
      </div>

      <SalesTable sales={sales || []} />

      <RecordSaleModal open={showRecordSale} onClose={() => setShowRecordSale(false)} />
    </div>
  );
}
