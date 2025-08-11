import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import ProductTable from "@/components/products/product-table";
import AddProductModal from "@/components/modals/add-product-modal";

export default function Products() {
  const [showAddProduct, setShowAddProduct] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => api.getProducts(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your product catalog</p>
        </div>
        <Button onClick={() => setShowAddProduct(true)} className="bg-primary hover:bg-primary-dark">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <ProductTable products={products || []} />

      <AddProductModal open={showAddProduct} onClose={() => setShowAddProduct(false)} />
    </div>
  );
}
