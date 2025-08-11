from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('products/', views.product_list, name='product_list'),
    path('products/<uuid:product_id>/', views.product_detail, name='product_detail'),
    path('sales/', views.sales_list, name='sales_list'),
    path('sales/record/', views.record_sale, name='record_sale'),
    path('reports/', views.reports, name='reports'),
    path('export/', views.export_data, name='export_data'),
]