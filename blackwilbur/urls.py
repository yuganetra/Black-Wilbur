
from django.contrib import admin
from django.urls import path

from blackwilbur import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('categories', views.CategoryAPIView.as_view()),
    path('bestseller', views.BestsellerAPIView.as_view()),
]
