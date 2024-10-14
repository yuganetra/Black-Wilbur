
from django.contrib import admin
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
    path('register',views.RegisterAPIView.as_view())
]
