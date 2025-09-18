from django.urls import path
from .views import FarmerLoginOrRegister 
from .views import get_market_prices
from .views import MarketplaceListCreateView, MarketplaceDetailView
from .views import predict_crop
from .views import QuickTipListCreateView, QuickTipDetailView
from .views import ask_ai

urlpatterns = [
    path('farmer-login/', FarmerLoginOrRegister.as_view()),
    # path('prices/', crop_prices),
    path('market-prices/', get_market_prices),
    path('marketplace/', MarketplaceListCreateView.as_view(), name='marketplace-list'),
    path('marketplace/<int:pk>/', MarketplaceDetailView.as_view(), name='marketplace-detail'),
    path('predict-crop/', predict_crop),
    path('quicktips/', QuickTipListCreateView.as_view()),
    path('quicktips/<int:pk>/', QuickTipDetailView.as_view()),
    path('ask-ai/', ask_ai),
]
