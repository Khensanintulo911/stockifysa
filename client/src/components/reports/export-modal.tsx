import { useState } from "react";
import { Download, FileText, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { SaleWithProduct, Product } from "@shared/schema";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  sales: SaleWithProduct[];
  products: Product[];
}

export default function ExportModal({ open, onClose, sales, products }: ExportModalProps) {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("month");
  const [format, setFormat] = useState("csv");
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);

  const { toast } = useToast();

  const handleExport = () => {
    // Get filtered data based on date range
    const getFilteredData = () => {
      const now = new Date();
      let startDate: Date;

      switch (dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "quarter":
          const quarterStart = Math.floor(now.getMonth() / 3) * 3;
          startDate = new Date(now.getFullYear(), quarterStart, 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          return reportType === "sales" ? sales : products;
      }

      if (reportType === "sales") {
        return sales.filter(sale => new Date(sale.saleDate!) >= startDate);
      } else {
        return products; // Products don't need date filtering
      }
    };

    const filteredData = getFilteredData();
    
    if (format === "csv") {
      exportToCSV(filteredData);
    } else {
      exportToJSON(filteredData);
    }

    toast({
      title: "Export Successful",
      description: `${reportType} report exported successfully`,
    });

    onClose();
  };

  const exportToCSV = (data: any[]) => {
    let csvContent = "";
    let headers: string[] = [];
    let rows: string[][] = [];

    if (reportType === "sales") {
      headers = ["Date", "Product Name", "SKU", "Category", "Quantity", "Unit Price", "Total Price"];
      rows = (data as SaleWithProduct[]).map(sale => [
        new Date(sale.saleDate!).toLocaleDateString(),
        sale.product.name,
        sale.product.sku,
        sale.product.category,
        sale.quantity.toString(),
        sale.unitPrice,
        sale.totalPrice
      ]);
    } else {
      headers = ["Product Name", "SKU", "Category", "Current Stock", "Low Stock Threshold", "Price", "Stock Value"];
      rows = (data as Product[]).map(product => [
        product.name,
        product.sku,
        product.category,
        product.stock.toString(),
        product.lowStockThreshold.toString(),
        product.price,
        (product.stock * parseFloat(product.price)).toFixed(2)
      ]);
    }

    // Add summary if requested
    if (includeSummary && reportType === "sales") {
      const salesData = data as SaleWithProduct[];
      const totalRevenue = salesData.reduce((sum, sale) => sum + parseFloat(sale.totalPrice), 0);
      const totalTransactions = salesData.length;
      const totalItems = salesData.reduce((sum, sale) => sum + sale.quantity, 0);

      csvContent += "SUMMARY\n";
      csvContent += `Total Revenue,${totalRevenue.toFixed(2)}\n`;
      csvContent += `Total Transactions,${totalTransactions}\n`;
      csvContent += `Total Items Sold,${totalItems}\n`;
      csvContent += "\nDETAILS\n";
    }

    // Add headers and rows
    csvContent += headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(",") + "\n";
    });

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportType}_report_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (data: any[]) => {
    let exportData: any = {};

    if (includeSummary && reportType === "sales") {
      const salesData = data as SaleWithProduct[];
      exportData.summary = {
        totalRevenue: salesData.reduce((sum, sale) => sum + parseFloat(sale.totalPrice), 0),
        totalTransactions: salesData.length,
        totalItems: salesData.reduce((sum, sale) => sum + sale.quantity, 0),
        dateRange: dateRange,
        exportDate: new Date().toISOString()
      };
    }

    if (includeDetails) {
      exportData.data = data;
    }

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportType}_report_${Date.now()}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Report Type */}
          <div>
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Report</SelectItem>
                <SelectItem value="inventory">Inventory Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          {reportType === "sales" && (
            <div>
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Format */}
          <div>
            <Label>Export Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Excel Compatible)</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label>Include Options</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="details" 
                checked={includeDetails}
                onCheckedChange={(checked) => setIncludeDetails(checked === true)}
              />
              <Label htmlFor="details">Detailed Data</Label>
            </div>
            {reportType === "sales" && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="summary" 
                  checked={includeSummary}
                  onCheckedChange={(checked) => setIncludeSummary(checked === true)}
                />
                <Label htmlFor="summary">Summary Statistics</Label>
              </div>
            )}
          </div>

          {/* Preview Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Export Preview</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Report: {reportType === "sales" ? "Sales" : "Inventory"}</p>
              {reportType === "sales" && <p>Period: {dateRange}</p>}
              <p>Format: {format.toUpperCase()}</p>
              <p>Records: {reportType === "sales" ? sales.length : products.length}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport}
              className="flex-1 bg-primary hover:bg-primary-dark"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
