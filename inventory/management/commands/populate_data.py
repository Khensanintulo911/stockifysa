from django.core.management.base import BaseCommand
from inventory.models import Product, Sale, StockMovement
from decimal import Decimal
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Populate the database with South African sample inventory data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Populating database with South African inventory data...'))
        
        # Clear existing data
        Product.objects.all().delete()
        Sale.objects.all().delete()
        StockMovement.objects.all().delete()
        
        # South African Products
        products_data = [
            # Food & Beverages
            {
                'name': 'Premium Beef Biltong',
                'sku': 'BLT001',
                'description': 'Traditional South African beef biltong, air-dried and seasoned with coriander',
                'category': 'food_beverages',
                'price': Decimal('89.99'),
                'stock': 45,
                'low_stock_threshold': 10
            },
            {
                'name': 'Rooibos Tea Premium Blend',
                'sku': 'TEA001',
                'description': 'Premium red bush tea from the Western Cape mountains',
                'category': 'food_beverages',
                'price': Decimal('34.50'),
                'stock': 120,
                'low_stock_threshold': 20
            },
            {
                'name': 'Amarula Cream Liqueur',
                'sku': 'AMA001',
                'description': 'South African cream liqueur made from marula fruit',
                'category': 'food_beverages',
                'price': Decimal('189.99'),
                'stock': 25,
                'low_stock_threshold': 8
            },
            {
                'name': 'Rusks Traditional',
                'sku': 'RSK001',
                'description': 'Traditional South African beskuit perfect for dunking',
                'category': 'food_beverages',
                'price': Decimal('28.99'),
                'stock': 85,
                'low_stock_threshold': 15
            },
            {
                'name': 'Boerewors Spice Mix',
                'sku': 'SPM001',
                'description': 'Authentic spice blend for making traditional boerewors',
                'category': 'food_beverages',
                'price': Decimal('22.50'),
                'stock': 65,
                'low_stock_threshold': 12
            },
            
            # Clothing & Sports
            {
                'name': 'Springbok Rugby Jersey 2024',
                'sku': 'SPR001',
                'description': 'Official Springbok rugby jersey, green and gold',
                'category': 'clothing_sports',
                'price': Decimal('899.99'),
                'stock': 18,
                'low_stock_threshold': 5
            },
            {
                'name': 'Proteas Cricket Cap',
                'sku': 'CRC001',
                'description': 'Official South African Proteas cricket cap',
                'category': 'clothing_sports',
                'price': Decimal('149.99'),
                'stock': 32,
                'low_stock_threshold': 8
            },
            {
                'name': 'Khoi San Hiking Boots',
                'sku': 'BOT001',
                'description': 'Premium hiking boots inspired by the Kalahari',
                'category': 'clothing_sports',
                'price': Decimal('1299.99'),
                'stock': 12,
                'low_stock_threshold': 3
            },
            
            # Arts & Crafts
            {
                'name': 'Ndebele Art Wall Hanging',
                'sku': 'ART001',
                'description': 'Traditional Ndebele geometric patterns handcrafted art piece',
                'category': 'arts_crafts',
                'price': Decimal('299.99'),
                'stock': 8,
                'low_stock_threshold': 2
            },
            {
                'name': 'Zulu Pottery Vase',
                'sku': 'POT001',
                'description': 'Handcrafted ceramic vase with traditional Zulu patterns',
                'category': 'arts_crafts',
                'price': Decimal('189.50'),
                'stock': 15,
                'low_stock_threshold': 5
            },
            {
                'name': 'Wire Craft Bicycle',
                'sku': 'WIR001',
                'description': 'Handmade wire and bead bicycle ornament',
                'category': 'arts_crafts',
                'price': Decimal('45.99'),
                'stock': 28,
                'low_stock_threshold': 8
            },
            
            # Garden & Plants
            {
                'name': 'King Protea Seeds',
                'sku': 'PRO001',
                'description': 'Seeds for South Africa\'s national flower',
                'category': 'garden_plants',
                'price': Decimal('24.99'),
                'stock': 95,
                'low_stock_threshold': 20
            },
            {
                'name': 'Baobab Tree Seedling',
                'sku': 'BAO001',
                'description': 'Young baobab tree, the tree of life',
                'category': 'garden_plants',
                'price': Decimal('450.00'),
                'stock': 6,
                'low_stock_threshold': 2
            },
            {
                'name': 'Fynbos Seed Mix',
                'sku': 'FYN001',
                'description': 'Mixed indigenous fynbos seeds from the Cape Floral Kingdom',
                'category': 'garden_plants',
                'price': Decimal('35.50'),
                'stock': 42,
                'low_stock_threshold': 10
            },
            
            # Home & Living
            {
                'name': 'Ubuntu Wooden Platter',
                'sku': 'UBU001',
                'description': 'Large serving platter carved from indigenous wood',
                'category': 'home_living',
                'price': Decimal('129.99'),
                'stock': 22,
                'low_stock_threshold': 6
            },
            {
                'name': 'Shweshwe Fabric Cushions',
                'sku': 'SHW001',
                'description': 'Cushion covers made from traditional Shweshwe fabric',
                'category': 'home_living',
                'price': Decimal('89.99'),
                'stock': 35,
                'low_stock_threshold': 10
            },
            
            # Electronics
            {
                'name': 'Solar Power Bank Kruger',
                'sku': 'SOL001',
                'description': 'Portable solar power bank perfect for safari adventures',
                'category': 'electronics',
                'price': Decimal('249.99'),
                'stock': 18,
                'low_stock_threshold': 5
            },
            {
                'name': 'Braai Bluetooth Speaker',
                'sku': 'SPK001',
                'description': 'Waterproof speaker designed for South African braais',
                'category': 'electronics',
                'price': Decimal('399.99'),
                'stock': 14,
                'low_stock_threshold': 4
            }
        ]
        
        # Create products
        created_products = []
        for product_data in products_data:
            product = Product.objects.create(**product_data)
            created_products.append(product)
            self.stdout.write(f'Created product: {product.name}')
        
        # Create some sample sales
        self.stdout.write('\nCreating sample sales...')
        for _ in range(25):
            product = random.choice(created_products)
            if product.stock > 0:
                quantity = random.randint(1, min(5, product.stock))
                sale = Sale.objects.create(
                    product=product,
                    quantity=quantity,
                    unit_price=product.price,
                    sale_date=timezone.now() - timezone.timedelta(
                        days=random.randint(0, 30),
                        hours=random.randint(0, 23),
                        minutes=random.randint(0, 59)
                    )
                )
                
                # Create corresponding stock movement
                StockMovement.objects.create(
                    product=product,
                    movement_type='sale',
                    quantity=-quantity,
                    reason=f'Sale #{sale.id}'
                )
                
                self.stdout.write(f'Created sale: {sale}')
        
        # Create some stock movements (restocking)
        self.stdout.write('\nCreating stock movements...')
        for product in random.sample(created_products, 8):
            restock_qty = random.randint(10, 50)
            product.stock += restock_qty
            product.save()
            
            StockMovement.objects.create(
                product=product,
                movement_type='in',
                quantity=restock_qty,
                reason='Initial stock replenishment'
            )
            self.stdout.write(f'Restocked {product.name}: +{restock_qty} units')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully populated database!\n'
                f'Created {len(created_products)} products\n'
                f'Created {Sale.objects.count()} sales\n'
                f'Created {StockMovement.objects.count()} stock movements'
            )
        )