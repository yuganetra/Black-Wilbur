from django.contrib import admin
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path,re_path,include
from blackwilbur import services
from blackwilbur import views


api_url_patterns =[
    path('payment-verify/', views.index, name='something'),  # This serves the index.html for /api/something/
    path('categories', views.CategoryAPIView.as_view()),
    path('bestseller', views.BestsellerAPIView.as_view()),
    path('explore', views.ExploreAPIView.as_view()),
    path('collections', views.CollectionAPIView.as_view()),
    path('search', views.SearchAPIView.as_view()),
    path('orders', views.OrdersAPIView.as_view()),
    path('cart', views.CartAPIView.as_view()),
    path('products/<product_id>', views.ProductDetailAPIView.as_view()),
    path('login', views.LoginAPIView.as_view()),
    path('register', views.RegisterAPIView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('send-sms/', views.SendSmsView.as_view(), name='send_sms'),
    path('ratings/', views.RatingAPIView.as_view(), name='rating-list'),
    path('products-manage', views.ProductManageAPIView.as_view()),
    path('product-variation/', views.ProductVariationAPIView.as_view(), name='product-variations'),
    path('product-variation/<str:pk>/', views.ProductVariationAPIView.as_view(), name='product-variation-detail'),
    path('product-variation/product/<str:product_id>/', views.ProductVariationAPIView.as_view(), name='product-variations-by-product'),    path('images/', views.ImageManageAPIView.as_view(), name='image-list'),
    path('images/<str:pk>/', views.ImageManageAPIView.as_view(), name='image-detail'),
    path('images/product/<str:product_id>/', views.ImageManageAPIView.as_view(), name='image-by-product'),  # Fetch images by product ID
    path('discounts/', views.DiscountAPIView.as_view(), name='discount-list'),  # To get all discounts or create new
    path('discounts/<uuid:pk>/', views.DiscountAPIView.as_view(), name='discount-detail'),
    path('phonepe-callback/', views.phonepe_callback, name='phonepe-callback'),
    path('users/', views.UserListAPIView.as_view(), name='user-list'),
    path('shipping-addresses/', views.ShippingAddressAPIView.as_view(), name='shipping-address-list'),  # GET and POST
    path('shipping-addresses/<uuid:pk>/', views.ShippingAddressAPIView.as_view(), name='shipping-address-detail'),  # GET by ID, DELETE
    path('shipping-addresses/user/<uuid:pk>/', views.ShippingAddressAPIView.as_view(), name='user-shipping-addresses'),  # GET by user ID
    path('invoice/<str:order_id>/', views.generate_invoice, name='generate_invoice'),
    path('verify-payment/', views.VerifyPaymentView.as_view(), name='verify-payment'),
    path('create-razorpay-order/', views.CreateRazorpayOrderView.as_view(), name='create-razorpay-order'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path("api/", include(api_url_patterns)),
    
]
