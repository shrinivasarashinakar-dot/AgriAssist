from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Farmer
from .serializers import FarmerSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import google.generativeai as genai
from django.contrib.auth.hashers import check_password
from django.db import IntegrityError

@method_decorator(csrf_exempt, name='dispatch')
class FarmerLoginOrRegister(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        try:
            farmer = Farmer.objects.get(phone=phone)
            serializer = FarmerSerializer(farmer)
            return Response({'msg': 'Welcome back!', 'farmer': serializer.data})
        except Farmer.DoesNotExist:
            serializer = FarmerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({'msg': 'Farmer registered!', 'farmer': serializer.data}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# New explicit register and login views with password support
@method_decorator(csrf_exempt, name='dispatch')
class FarmerRegisterView(APIView):
    def post(self, request):
        data = request.data.copy()
        # Normalize
        if 'phone' in data and isinstance(data['phone'], str):
            data['phone'] = data['phone'].strip()
        if 'name' in data and isinstance(data['name'], str):
            data['name'] = data['name'].strip()
        if 'location' in data and isinstance(data['location'], str):
            data['location'] = data['location'].strip()
        required_fields = ['name', 'phone', 'password', 'location']
        missing = [f for f in required_fields if not data.get(f)]
        if missing:
            return Response({'detail': f"Missing fields: {', '.join(missing)}"}, status=status.HTTP_400_BAD_REQUEST)
        # Prevent duplicate phone explicitly
        if Farmer.objects.filter(phone=data['phone']).exists():
            return Response({'detail': 'A farmer with this phone already exists.'}, status=status.HTTP_409_CONFLICT)
        serializer = FarmerSerializer(data=data)
        if serializer.is_valid():
            try:
                farmer = serializer.save()
                return Response({'msg': 'Farmer registered!', 'farmer': FarmerSerializer(farmer).data}, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response({'detail': 'A farmer with this phone already exists.'}, status=status.HTTP_409_CONFLICT)
        return Response({'detail': 'Invalid data', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class FarmerLoginView(APIView):
    def post(self, request):
        phone = (request.data.get('phone') or '').strip()
        password = request.data.get('password') or ''
        if not phone or not password:
            return Response({'detail': 'phone and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            farmer = Farmer.objects.get(phone=phone)
            # Handle the case where existing farmer has no password set yet
            if not farmer.password:
                return Response({'detail': 'Password not set for this account. Please register again or reset password.'}, status=status.HTTP_400_BAD_REQUEST)
            if not check_password(password, farmer.password):
                return Response({'detail': 'Invalid phone or password'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'msg': 'Login successful', 'farmer': FarmerSerializer(farmer).data})
        except Farmer.DoesNotExist:
            return Response({'detail': 'Invalid phone or password'}, status=status.HTTP_401_UNAUTHORIZED)

# from rest_framework.decorators import api_view
# from rest_framework.response import Response

# @api_view(['GET'])
# def crop_prices(request):
#     data = [
#         {"crop": "Wheat", "market": "Pune Mandi", "price": 2300, "date": "2025-07-18"},
#         {"crop": "Rice", "market": "Kolhapur", "price": 2900, "date": "2025-07-18"},
#         {"crop": "Onion", "market": "Nashik", "price": 1400, "date": "2025-07-18"},
#         {"crop": "Sugarcane", "market": "Ahmednagar", "price": 2800, "date": "2025-07-18"},
#     ]
#     return Response(data)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import MarketPrice
from .serializers import MarketPriceSerializer

@api_view(['GET'])
def get_market_prices(request):
    crop = request.GET.get('crop')
    market = request.GET.get('market')

    prices = MarketPrice.objects.all()
    if crop:
        prices = prices.filter(crop__icontains=crop)
    if market:
        prices = prices.filter(market__icontains=market)

    serializer = MarketPriceSerializer(prices, many=True)
    return Response(serializer.data)

from rest_framework import generics
from .models import MarketplaceItem
from .serializers import MarketplaceItemSerializer

class MarketplaceListCreateView(generics.ListCreateAPIView):
    queryset = MarketplaceItem.objects.all().order_by('-date_posted')
    serializer_class = MarketplaceItemSerializer

class MarketplaceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MarketplaceItem.objects.all()
    serializer_class = MarketplaceItemSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import joblib
import os

@api_view(['POST'])
def predict_crop(request):
    """
    Predict recommended crop using Kaggle "Crop Recommendation" feature schema:
    Inputs: nitrogen (N), phosphorus (P), potassium (K), temperature (C), humidity (%), ph, rainfall (mm)
    Body example: {
      "N": 90, "P": 42, "K": 43,
      "temperature": 23.5, "humidity": 82.1, "ph": 6.5, "rainfall": 210.0
    }
    """
    try:
        data = request.data
        # Parse and validate inputs
        N = float(data.get('N'))
        P = float(data.get('P'))
        K = float(data.get('K'))
        temperature = float(data.get('temperature'))
        humidity = float(data.get('humidity'))
        ph = float(data.get('ph'))
        rainfall = float(data.get('rainfall'))

        # Load model trained on Kaggle dataset
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, 'crop_kaggle_model.pkl')
        if not os.path.exists(model_path):
            return Response({
                "error": "Model not found. Please train the model using the Kaggle dataset and save it as 'crop_kaggle_model.pkl' in the backend root."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        model = joblib.load(model_path)

        # Feature order must match training
        features = [[N, P, K, temperature, humidity, ph, rainfall]]
        pred = model.predict(features)[0]
        return Response({"recommended_crop": str(pred)})

    except TypeError:
        return Response({"error": "All inputs (N, P, K, temperature, humidity, ph, rainfall) are required"}, status=status.HTTP_400_BAD_REQUEST)
    except ValueError:
        return Response({"error": "Inputs must be numeric"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# core/views.py

from rest_framework import generics
from .models import QuickTip
from .serializers import QuickTipSerializer

class QuickTipListCreateView(generics.ListCreateAPIView):
    queryset = QuickTip.objects.all().order_by('-created_at')
    serializer_class = QuickTipSerializer

class QuickTipDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = QuickTip.objects.all()
    serializer_class = QuickTipSerializer

def _is_agriculture_question(text: str) -> bool:
    """Very lightweight domain check to avoid completely off-topic questions."""
    t = text.lower()
    keywords = [
        'agri', 'agriculture', 'farming', 'farmer', 'crop', 'crops', 'soil', 'irrigation',
        'fertilizer', 'manure', 'pesticide', 'insecticide', 'herbicide', 'fungicide',
        'seed', 'sowing', 'harvest', 'yield', 'horticulture', 'vegetable', 'fruit',
        'livestock', 'dairy', 'poultry', 'goat', 'sheep', 'cattle', 'mandi', 'market price',
        'weather', 'rainfall', 'monsoon', 'kharif', 'rabi', 'zaid', 'tractor', 'plough',
        'mulch', 'drip', 'sprinkler', 'compost', 'nursery', 'soil health', 'phosphorus',
        'nitrogen', 'potassium', 'NPK', 'pest', 'disease', 'blight', 'wilt', 'rust',
        'aphid', 'bollworm', 'weeds', 'weeding'
    ]
    return any(k in t for k in keywords)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from google import generativeai as genai

def _is_agriculture_question(q):
    agri_keywords = [
        "crop", "soil", "fertilizer", "seed", "irrigation", "farm", "pest",
        "disease", "weather", "harvest", "agriculture", "agri", "livestock",
        "market price", "ph", "compost", "organic", "yield", "drought", "rainfall"
    ]
    q = q.lower()
    return any(word in q for word in agri_keywords)

@api_view(['POST'])
def ask_ai(request):
    question = (request.data.get('question') or '').strip()
    if not question:
        return Response({"error": "'question' is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Agriculture-only filter
    if not _is_agriculture_question(question):
        return Response({
            "answer": (
                "I can answer only agriculture-related questions — crops, fertilizers, irrigation, "
                "pests, soil, livestock, and market prices. Please ask a farming-related question."
            )
        })

    api_key = getattr(settings, 'GOOGLE_API_KEY', '')
    if not api_key:
        return Response({"error": "GOOGLE_API_KEY is not configured"}, status=500)

    try:
        genai.configure(api_key=api_key)

        system_instruction = """
        You are AgriAssist, an agriculture expert. Provide farming guidance only.
        Focus on crops, soil, fertilizers, irrigation, pests, diseases, livestock and climate advice.
        If question is not related to agriculture, politely refuse.
        Keep answers practical for farmers.
        """

        model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction=system_instruction,
    generation_config={
        "temperature": 0.4,
        "top_p": 0.9,
        "max_output_tokens": 800,
    }
)


        response = model.generate_content(question)

        # Extract answer text safely
        answer = ""
        if hasattr(response, "text"):
            answer = response.text
        elif hasattr(response, "candidates") and response.candidates:
            answer = response.candidates[0].content.parts[0].text

        if not answer:
            answer = "Sorry, I couldn't generate a helpful agriculture answer. Try rephrasing."

        return Response({"answer": answer})

    except Exception as e:
        return Response({"error": str(e)}, status=500)
