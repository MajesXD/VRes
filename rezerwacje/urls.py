from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('dodaj/', views.dodaj_rezerwacje, name='dodaj_rezerwacje'),
    path('get-reservations/', views.get_reservations, name='get_reservations'),
    path('zapisz-notatke/', views.zapisz_notatke, name='zapisz_notatke'),
]

