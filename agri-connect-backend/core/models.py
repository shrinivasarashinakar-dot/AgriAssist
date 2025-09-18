from django.db import models

class Farmer(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, unique=True)
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.phone})"
class MarketPrice(models.Model):
    crop = models.CharField(max_length=100)
    market = models.CharField(max_length=100)
    state = models.CharField(max_length=100, default='Maharashtra')  # optional but useful for filtering
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, default='quintal')  # e.g., per quintal
    date = models.DateField()

    def __str__(self):
        return f"{self.crop} - {self.market} @ {self.price}"

from django.db import models

class MarketplaceItem(models.Model):
    CATEGORY_CHOICES = [
        ('Tools', 'Tools'),
        ('Seeds', 'Seeds'),
        ('Fertilizers', 'Fertilizers'),
        ('Irrigation', 'Irrigation'),
        ('Machinery', 'Machinery'),
        ('Others', 'Others'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    location = models.CharField(max_length=100)
    contact = models.CharField(max_length=15)
    date_posted = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='marketplace_images/', blank=True, null=True)  # ✅ New field

    def __str__(self):
        return self.title

# class MarketplaceItem(models.Model):
#     CATEGORY_CHOICES = [
#         ('Tools', 'Tools'),
#         ('Seeds', 'Seeds'),
#         ('Fertilizers', 'Fertilizers'),
#         ('Others', 'Others'),
#     ]

#     title = models.CharField(max_length=100)
#     description = models.TextField()
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
#     location = models.CharField(max_length=100)
#     contact = models.CharField(max_length=15)
#     date_posted = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.title

# core/models.py

class QuickTip(models.Model):
    CATEGORY_CHOICES = [
        ('Soil', 'Soil'),
        ('Water', 'Water'),
        ('Pest', 'Pest'),
        ('Climate', 'Climate'),
        ('General', 'General'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='General')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
