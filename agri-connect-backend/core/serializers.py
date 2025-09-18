from rest_framework import serializers
from .models import Farmer
from .models import MarketPrice
from .models import MarketplaceItem
from .models import QuickTip

class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = '__all__'

class MarketPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketPrice
        fields = '__all__'


class MarketplaceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketplaceItem
        fields = '__all__'

class QuickTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuickTip
        fields = '__all__'