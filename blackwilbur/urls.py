
from django.contrib import admin
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path

from blackwilbur import views

urlpatterns = [
    path('admin/', admin.site.urls),
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
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('send-sms/', views.SendSmsView.as_view(), name='send_sms'),
    path('ratings/', views.RatingAPIView.as_view(), name='rating-list'),
    path('products-manage', views.ProductManageAPIView.as_view()),

]
