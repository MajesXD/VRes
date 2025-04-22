from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import rezerwacje
from datetime import datetime, time
import json
from datetime import datetime, timedelta
from django.contrib import messages

def home(request):
    return render(request, 'rezerwacje/home.html')

def dodaj_rezerwacje(request):
    print("Widok dodaj_rezerwacje został wywołany.")
    if request.method == 'POST':
        rodzaj_rezerwacji = request.POST.get('rodzaj_rezerwacji')
        osoba = request.POST.get('osoba')
        ilosc_osob = int(request.POST.get('ilosc_osob'))
        data = request.POST.get('data')
        godzina_h = request.POST.get('godzina_h')
        godzina_min = request.POST.get('godzina_min')
        czas_h = request.POST.get('czas_h')
        czas_min = request.POST.get('czas_min')
        kwota = request.POST.get('kwota')
        rodzaj_platnosci = request.POST.get('rodzaj_platnosci')

        godzina = time(int(godzina_h), int(godzina_min))
        czas = time(int(czas_h), int(czas_min))
        data = datetime.strptime(data, "%Y-%m-%d").date()

        res_start = datetime.combine(data, godzina)
        res_duration = timedelta(hours=czas.hour, minutes=czas.minute)
        res_end = res_start + res_duration

        overlapping_reservations = rezerwacje.objects.filter(data=data)
        sum_osob = 0

        for r in overlapping_reservations:
            r_start = datetime.combine(r.data, r.godzina)
            r_duration = timedelta(hours=r.czas.hour, minutes=r.czas.minute)
            r_end = r_start + r_duration

            if (res_start < r_end) and (res_end > r_start):
                sum_osob += r.ilosc_osob

        if sum_osob + ilosc_osob > 8 and (sum_osob + ilosc_osob < 100 or sum_osob + ilosc_osob > 100):
            messages.error(request, "Za dużo osób na jedną godzinę.")
            return redirect('home') 
        
        elif timedelta(hours=int(godzina_h), minutes=int(godzina_min)) + timedelta(hours=int(czas_h), minutes=int(czas_min)) > timedelta(hours=22):
            messages.error(request, "Zbyt długa rezerwacja.")
            print(godzina_h)
            print(godzina_min)
            print(czas_h)
            print(czas_min)
            print(timedelta(hours=int(godzina_h), minutes=int(godzina_min)) + timedelta(hours=int(czas_h), minutes=int(czas_min)))
            return redirect('home')
        elif timedelta(hours=int(czas_h)) == timedelta(hours=0) and timedelta(minutes=int(czas_min)) == timedelta(minutes=0) :
            messages.error(request, "Nie wybrano czasu rezerwacji.")
            return redirect('home')
        elif timedelta(hours=int(czas_h)) == timedelta(hours=0) and timedelta(minutes=int(czas_min)) == timedelta(minutes=15) :
            messages.error(request, "Za krótki czas rezerwacji.")
            return redirect('home')
        else:
            rezerwacja = rezerwacje(
                rodzaj_rezerwacji = rodzaj_rezerwacji,
                osoba=osoba,
                ilosc_osob=ilosc_osob,
                data=data,
                godzina=godzina,
                czas=czas,
                kwota = kwota,
                rodzaj_platnosci = rodzaj_platnosci,
            )
            rezerwacja.save()
            print(rodzaj_rezerwacji)
            print(osoba)
            print(ilosc_osob)
            print(data)
            print(godzina)
            print(czas)
            print(kwota)
            print(rodzaj_platnosci)
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
        transfer_sum = 0
        card_sum = 0
        cash_sum = 0
        voucher_kmmb_sum = 0
        voucher_vr_sum = 0
        for r in reservations:
            result.append({
                'id': r.id,
                'osoba': r.osoba,
                'ilosc_osob': r.ilosc_osob,
                'godzina': r.godzina.strftime('%H:%M'),
                'czas': r.czas.strftime('%H:%M'),
                'kwota': r.kwota,
                'rodzaj_platnosci': r.rodzaj_platnosci,
                'rodzaj': r.rodzaj_rezerwacji,
                'notatka': r.notatka,
                'zatwierdzony': r.zatwierdzony,
            })

            if r.rodzaj_platnosci == 1:
                transfer_sum = transfer_sum + r.kwota
            elif r.rodzaj_platnosci == 2:
                card_sum = card_sum + r.kwota
            elif r.rodzaj_platnosci == 3:
                cash_sum = cash_sum + r.kwota
            elif r.rodzaj_platnosci == 4:
                voucher_vr_sum = voucher_vr_sum + r.kwota
            elif r.rodzaj_platnosci == 5:
                voucher_kmmb_sum = voucher_kmmb_sum + r.kwota
            elif r.rodzaj_platnosci == 6:
                voucher_kmmb_sum = voucher_kmmb_sum + r.kwota * 1.23
            elif r.rodzaj_platnosci == 7:
                transfer_sum = transfer_sum + r.kwota                
            elif r.rodzaj_platnosci == 8:
                transfer_sum = transfer_sum + r.kwota  
        summary_sum = transfer_sum + card_sum + cash_sum + voucher_kmmb_sum                               
        return JsonResponse({
            'reservations': result,
            'transfer_sum': transfer_sum,
            'card_sum': card_sum,
            'cash_sum': cash_sum,
            'voucher_vr_sum': voucher_vr_sum,
            'voucher_kmmb_sum': voucher_kmmb_sum,
            'summary_sum': summary_sum,
            })