from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.db.models import Sum, Count, Q, F
from django.http import JsonResponse, HttpResponse
from django.core.paginator import Paginator
from django.views.decorators.http import require_http_methods
from decimal import Decimal
import csv
from datetime import datetime, timedelta
from .models import Product, Sale, StockMovement

def dashboard(request):
    """Main dashboard view with metrics and overview"""
    # Calculate metrics
    total_products = Product.objects.count()
    low_stock_items = Product.objects.filter(stock__lte=F('low_stock_threshold')).count()
    out_of_stock_items = Product.objects.filter(stock=0).count()
    
    # Sales metrics
    sales_today = Sale.objects.filter(sale_date__date=datetime.now().date())
    total_sales_today = sales_today.aggregate(total=Sum('total_price'))['total'] or Decimal('0')
    
    # Recent sales
    recent_sales = Sale.objects.select_related('product').order_by('-sale_date')[:5]
    
    # Low stock products
    low_stock_products = Product.objects.filter(
        stock__lte=F('low_stock_threshold')
    ).order_by('stock')[:10]
    
    # Total inventory value
    inventory_value = sum(product.total_value for product in Product.objects.all())
    
    context = {
        'total_products': total_products,
        'low_stock_items': low_stock_items,
        'out_of_stock_items': out_of_stock_items,
        'total_sales_today': total_sales_today,
        'recent_sales': recent_sales,
        'low_stock_products': low_stock_products,
        'inventory_value': inventory_value,
    }
    return render(request, 'inventory/dashboard.html', context)

def product_list(request):
    """List all products with search and filtering"""
    search_query = request.GET.get('search', '')
    category_filter = request.GET.get('category', '')
    
    products = Product.objects.all()
    
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | 
            Q(sku__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    if category_filter:
        products = products.filter(category=category_filter)
    
    # Pagination
    paginator = Paginator(products, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    categories = Product.CATEGORY_CHOICES
    
    context = {
        'page_obj': page_obj,
        'categories': categories,
        'search_query': search_query,
        'category_filter': category_filter,
    }
    return render(request, 'inventory/product_list.html', context)

def product_detail(request, product_id):
    """Product detail view"""
    product = get_object_or_404(Product, id=product_id)
    recent_sales = product.sales.order_by('-sale_date')[:10]
    stock_movements = product.stock_movements.order_by('-created_at')[:10]
    
    context = {
        'product': product,
        'recent_sales': recent_sales,
        'stock_movements': stock_movements,
    }
    return render(request, 'inventory/product_detail.html', context)

def sales_list(request):
    """List all sales transactions"""
    sales = Sale.objects.select_related('product').order_by('-sale_date')
    
    # Date filtering
    date_filter = request.GET.get('date_filter', '')
    if date_filter == 'today':
        sales = sales.filter(sale_date__date=datetime.now().date())
    elif date_filter == 'week':
        week_ago = datetime.now() - timedelta(days=7)
        sales = sales.filter(sale_date__gte=week_ago)
    elif date_filter == 'month':
        month_ago = datetime.now() - timedelta(days=30)
        sales = sales.filter(sale_date__gte=month_ago)
    
    # Pagination
    paginator = Paginator(sales, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Calculate totals
    total_sales = sales.aggregate(total=Sum('total_price'))['total'] or Decimal('0')
    total_quantity = sales.aggregate(total=Sum('quantity'))['total'] or 0
    
    context = {
        'page_obj': page_obj,
        'total_sales': total_sales,
        'total_quantity': total_quantity,
        'date_filter': date_filter,
    }
    return render(request, 'inventory/sales_list.html', context)

@require_http_methods(["POST"])
def record_sale(request):
    """Record a new sale"""
    try:
        product_id = request.POST.get('product_id')
        quantity = int(request.POST.get('quantity'))
        
        product = get_object_or_404(Product, id=product_id)
        
        if product.stock < quantity:
            messages.error(request, f"Insufficient stock. Only {product.stock} units available.")
            return redirect('product_detail', product_id=product_id)
        
        # Create sale
        sale = Sale.objects.create(
            product=product,
            quantity=quantity,
            unit_price=product.price,
        )
        
        # Create stock movement
        StockMovement.objects.create(
            product=product,
            movement_type='sale',
            quantity=-quantity,
            reason=f"Sale #{sale.id}"
        )
        
        messages.success(request, f"Sale recorded successfully! R{sale.total_price}")
        return redirect('sales_list')
        
    except Exception as e:
        messages.error(request, f"Error recording sale: {str(e)}")
        return redirect('product_list')

def reports(request):
    """Reports and analytics page"""
    # Sales by category
    sales_by_category = Sale.objects.select_related('product').values(
        'product__category'
    ).annotate(
        total_sales=Sum('total_price'),
        total_quantity=Sum('quantity')
    ).order_by('-total_sales')
    
    # Top selling products
    top_products = Sale.objects.select_related('product').values(
        'product__name', 'product__sku'
    ).annotate(
        total_sales=Sum('total_price'),
        total_quantity=Sum('quantity')
    ).order_by('-total_sales')[:10]
    
    # Monthly sales
    monthly_sales = Sale.objects.filter(
        sale_date__gte=datetime.now() - timedelta(days=365)
    ).extra(
        select={'month': "strftime('%%Y-%%m', sale_date)"}
    ).values('month').annotate(
        total=Sum('total_price')
    ).order_by('month')
    
    context = {
        'sales_by_category': sales_by_category,
        'top_products': top_products,
        'monthly_sales': monthly_sales,
    }
    return render(request, 'inventory/reports.html', context)

def export_data(request):
    """Export data to CSV"""
    export_type = request.GET.get('type', 'products')
    
    response = HttpResponse(content_type='text/csv')
    
    if export_type == 'products':
        response['Content-Disposition'] = 'attachment; filename="products.csv"'
        writer = csv.writer(response)
        writer.writerow(['Name', 'SKU', 'Category', 'Price (ZAR)', 'Stock', 'Low Stock Threshold', 'Stock Status'])
        
        for product in Product.objects.all():
            writer.writerow([
                product.name,
                product.sku,
                product.get_category_display(),
                f"R{product.price}",
                product.stock,
                product.low_stock_threshold,
                product.stock_status
            ])
    
    elif export_type == 'sales':
        response['Content-Disposition'] = 'attachment; filename="sales.csv"'
        writer = csv.writer(response)
        writer.writerow(['Date', 'Product', 'SKU', 'Quantity', 'Unit Price (ZAR)', 'Total (ZAR)'])
        
        for sale in Sale.objects.select_related('product').order_by('-sale_date'):
            writer.writerow([
                sale.sale_date.strftime('%Y-%m-%d %H:%M'),
                sale.product.name,
                sale.product.sku,
                sale.quantity,
                f"R{sale.unit_price}",
                f"R{sale.total_price}"
            ])
    
    return response
