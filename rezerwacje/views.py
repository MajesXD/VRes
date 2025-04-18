from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import rezerwacje
from datetime import datetime, time
import json

def home(request):
    return render(request, 'rezerwacje/home.html')

def dodaj_rezerwacje(request):
    print("Widok dodaj_rezerwacje został wywołany.")
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
    else:
        print("POST failed")
    return render(request, 'dodaj_rezerwacje.html')

def get_reservations(request):
    if request.method == "POST":
        body = json.loads(request.body)
        date_str = body.get("date")

        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return JsonResponse({'error': 'Nieprawidłowa data'}, status=400)

        reservations = rezerwacje.objects.filter(data=date)

        result = []
        for r in reservations:
            result.append({
                'id': r.id,
                'osoba': r.osoba,
                'godzina': r.godzina.strftime('%H:%M'),
                'czas': r.czas.strftime('%H:%M'),
                'kwota': r.kwota,
                'rodzaj': r.rodzaj_rezerwacji,
                'notatka': r.notatka,
                'zatwierdzony': r.zatwierdzony,
            })

        return JsonResponse({'reservations': result})