from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from django.utils import timezone
import uuid

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('food_beverages', 'Food & Beverages'),
        ('clothing_sports', 'Clothing & Sports'),
        ('arts_crafts', 'Arts & Crafts'),
        ('garden_plants', 'Garden & Plants'),
        ('home_living', 'Home & Living'),
        ('electronics', 'Electronics'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    stock = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.sku})"
    
    @property
    def is_low_stock(self):
        return self.stock <= self.low_stock_threshold
    
    @property
    def is_out_of_stock(self):
        return self.stock == 0
    
    @property
    def stock_status(self):
        if self.is_out_of_stock:
            return 'out_of_stock'
        elif self.is_low_stock:
            return 'low_stock'
        return 'in_stock'
    
    @property
    def total_value(self):
        return float(self.price) * self.stock

class Sale(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sales')
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_date = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-sale_date']
    
    def __str__(self):
        return f"{self.product.name} - {self.quantity} units (R{self.total_price})"
    
    def save(self, *args, **kwargs):
        # Auto-calculate total price
        self.total_price = float(self.unit_price) * self.quantity
        super().save(*args, **kwargs)
        
        # Update product stock
        if self.product_id:
            product = Product.objects.get(id=self.product_id)
            product.stock = max(0, product.stock - self.quantity)
            product.save()

class StockMovement(models.Model):
    MOVEMENT_TYPES = [
        ('in', 'Stock In'),
        ('out', 'Stock Out'),
        ('adjustment', 'Adjustment'),
        ('sale', 'Sale'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_movements')
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPES)
    quantity = models.IntegerField()  # Can be negative for outgoing stock
    reason = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.product.name} - {self.movement_type} ({self.quantity})"
