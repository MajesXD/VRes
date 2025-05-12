from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('dodaj/', views.dodaj_rezerwacje, name='dodaj_rezerwacje'),
    path('get-reservations/', views.get_reservations, name='get_reservations'),
    path('save-reservation-changes/', views.saveReservationChanges, name='save_note'),
]

