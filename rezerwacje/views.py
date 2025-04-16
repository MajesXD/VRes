from django.shortcuts import render, redirect
from .models import rezerwacje
from datetime import datetime, time

def home(request):
    return render(request, 'rezerwacje/home.html')

def dodaj_rezerwacje(request):
    if request.method == 'POST':
        rodzaj_rezerwacji = request.POST.get('rodzaj_rezerwacji')
        osoba = request.POST.get('osoba')
        data = request.POST.get('data')
        godzina_h = request.POST.get('godzina_h')
        godzina_min = request.POST.get('godzina_min')
        czas_h = request.POST.get('czas_h')
        czas_min = request.POST.get('czas_min')

        godzina = time(int(godzina_h), int(godzina_min))
        czas = time(int(czas_h), int(czas_min))

        rezerwacja = rezerwacje(
            rodzaj_rezerwacji = rodzaj_rezerwacji,
            osoba=osoba,
            data=data,
            godzina=godzina,
            czas=czas,
        )
        rezerwacja.save()
        print(rodzaj_rezerwacji)
        print(osoba)
        print(data)
        print(godzina)
        print(czas)
        return redirect('home')

    return render(request, 'dodaj_rezerwacje.html')