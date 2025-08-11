import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { InsertSale } from "@shared/schema";

interface RecordSaleModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RecordSaleModal({ open, onClose }: RecordSaleModalProps) {
  const [formData, setFormData] = useState<InsertSale>({
    productId: "",
    quantity: 1,
    unitPrice: "0",
    totalPrice: "0",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => api.getProducts(),
  });

  const createSaleMutation = useMutation({
    mutationFn: api.createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sales'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/metrics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products/low-stock'] });
      toast({
        title: "Success",
        description: "Sale recorded successfully",
      });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record sale",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      productId: "",
      quantity: 1,
      unitPrice: "0",
      totalPrice: "0",
    });
  };

  const selectedProduct = products?.find(p => p.id === formData.productId);

  useEffect(() => {
    if (selectedProduct) {
      const unitPrice = parseFloat(selectedProduct.price);
      const totalPrice = unitPrice * formData.quantity;
      setFormData(prev => ({
        ...prev,
        unitPrice: selectedProduct.price,
        totalPrice: totalPrice.toFixed(2),
      }));
    }
  }, [selectedProduct, formData.quantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSaleMutation.mutate(formData);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Sale</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="productId">Product</Label>
            <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {products?.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {product.sku} (Stock: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedProduct && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Available Stock: {selectedProduct.stock}</p>
              <p className="text-sm text-gray-600">Unit Price: ${selectedProduct.price}</p>
            </div>
          )}
          
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={selectedProduct?.stock || 1}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="totalPrice">Total Price</Label>
            <Input
              id="totalPrice"
              value={`$${formData.totalPrice}`}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-secondary hover:bg-secondary-dark"
              disabled={createSaleMutation.isPending || !selectedProduct}
            >
              {createSaleMutation.isPending ? "Recording..." : "Record Sale"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
