from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
]

urlpatterns = [
    path('dodaj/', views.dodaj_rezerwacje, name='dodaj_rezerwacje'),
    path('', views.home, name='home'),  
]