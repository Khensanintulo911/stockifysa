from django.contrib import admin
from .models import Product, Sale, StockMovement

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'sku', 'category', 'price', 'stock', 'stock_status', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'sku', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    def stock_status(self, obj):
        if obj.is_out_of_stock:
            return '❌ Out of Stock'
        elif obj.is_low_stock:
            return '⚠️ Low Stock'
        return '✅ In Stock'
    stock_status.short_description = 'Stock Status'

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ['product', 'quantity', 'unit_price', 'total_price', 'sale_date']
    list_filter = ['sale_date', 'product__category']
    search_fields = ['product__name', 'product__sku']
    readonly_fields = ['id', 'total_price']
    date_hierarchy = 'sale_date'

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ['product', 'movement_type', 'quantity', 'reason', 'created_at']
    list_filter = ['movement_type', 'created_at']
    search_fields = ['product__name', 'reason']
    readonly_fields = ['id', 'created_at']
