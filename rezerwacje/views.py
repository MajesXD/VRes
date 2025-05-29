from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import rezerwacje
from datetime import datetime, time
import json
from datetime import datetime, timedelta
from django.contrib import messages

def home(request):
    return render(request, 'rezerwacje/home.html')

#Dodawanie rezerwacji
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
        notatka = request.POST.get('notatka')
        woda = int(request.POST.get('woda') or 0)
        cola = int(request.POST.get('cola') or 0)
        tarczyn = int(request.POST.get('tarczyn') or 0)
        fuzetea = int(request.POST.get('fuzetea') or 0)
        tiger = int(request.POST.get('tiger') or 0)
        zubr = int(request.POST.get('zubr') or 0)
        jack = int(request.POST.get('jack') or 0)
        jager = int(request.POST.get('jager') or 0)
        piwo = int(request.POST.get('piwo') or 0)
        produkty_platnosc = request.POST.get('produkty_platnosc') or 0

        godzina = time(int(godzina_h), int(godzina_min))
        czas = time(int(czas_h), int(czas_min))
        data = datetime.strptime(data, "%Y-%m-%d").date()

        #Zapobieganie dodaniu rezerwacji w tym samym czasie
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

        if sum_osob + ilosc_osob > 8 and sum_osob > 0:
            messages.error(request, "Za dużo osób na jedną godzinę.")
            return redirect('home') 
        #Obsługa błędów
        elif timedelta(hours=int(godzina_h), minutes=int(godzina_min)) + timedelta(hours=int(czas_h), minutes=int(czas_min)) > timedelta(hours=22):
            messages.error(request, "Zbyt długa rezerwacja.")
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
                osoba = osoba,
                ilosc_osob = ilosc_osob,
                data = data,
                godzina = godzina,
                czas = czas,
                kwota = kwota,
                rodzaj_platnosci = rodzaj_platnosci,
                notatka = notatka,
                woda = woda,
                cola = cola,
                tarczyn = tarczyn,
                fuzetea = fuzetea,
                tiger = tiger,
                zubr = zubr,
                jack = jack,
                jager = jager,
                piwo = piwo,
                produkty_platnosc = produkty_platnosc,
            )

            rezerwacja.save()
            print('Dodano rezerwacje')
            return redirect('home')
    else:
        print("Błąd dodawania rezerwacji")
    return render(request, 'dodaj_rezerwacje.html')

#Pobieranie rezerwacji z bazy
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
        #Wyliczenia godziny, czasu trwania i sumy produktów
        for r in reservations:
            start_time = datetime.combine(datetime.today(), r.godzina)
            end_time = start_time + timedelta(hours=r.czas.hour, minutes=r.czas.minute)
            godzina_end = end_time.strftime('%H:%M')
            suma_prod = (
                int(r.woda or 0) * 7 +
                int(r.cola or 0) * 10 +
                int(r.tarczyn or 0) * 8 +
                int(r.fuzetea or 0) * 10 +
                int(r.tiger or 0) * 8 +
                int(r.zubr or 0) * 10 +
                int(r.jack or 0) * 13 +
                int(r.jager or 0) * 10 +
                int(r.piwo or 0) * 18
                )
            
            result.append({
                'id': r.id,
                'osoba': r.osoba,
                'ilosc_osob': r.ilosc_osob,
                'data': r.data,
                'godzina': r.godzina.strftime('%H:%M'),
                'godzina_end': godzina_end,
                'czas': r.czas.strftime('%H:%M'),
                'kwota': r.kwota,
                'rodzaj_platnosci': r.rodzaj_platnosci,
                'rodzaj': r.rodzaj_rezerwacji,
                'notatka': r.notatka,
                'zatwierdzony': r.zatwierdzony,

                'woda': r.woda,
                'cola': r.cola,
                'tarczyn': r.tarczyn,
                'fuzetea': r.fuzetea,
                'tiger': r.tiger,
                'zubr': r.zubr,
                'jack': r.jack,
                'jager': r.jager,
                'piwo': r.piwo,
                'produkty_platnosc': r.produkty_platnosc,
                'suma_prod': suma_prod,
            })

#Sumowanie dla podsumowania dnia. Dla vouchera katalog marzeń kwota x 1.23, dla katalogu prezentów i superprezentów jako przelew
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
                voucher_kmmb_sum = round(voucher_kmmb_sum + r.kwota * 1.23, 2)
            elif r.rodzaj_platnosci == 7:
                transfer_sum = transfer_sum + r.kwota                
            elif r.rodzaj_platnosci == 8:
                transfer_sum = transfer_sum + r.kwota 

            #Dodawnie sumy produktów do podsumowania dnia
            if r.produkty_platnosc == 2:
                card_sum = card_sum + suma_prod
            elif r.produkty_platnosc == 3:
                cash_sum = cash_sum + suma_prod 

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

#Zapisywanie zmian rezerwacji w otwartej rezerwacji
def saveReservationChanges(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        reservation = rezerwacje.objects.get(id=data['id'])
        reservation.notatka = data['notatka']
        reservation.data = datetime.strptime(data['data'], "%Y-%m-%d").date()
        reservation.godzina = datetime.strptime(data['godzina'], "%H:%M").time()
        reservation.czas = datetime.strptime(data['czas'], "%H:%M").time()
        reservation.ilosc_osob = int(data['ilosc_osob'])
        reservation.osoba = str(data['osoba'])
        reservation.kwota = float(data['kwota_new'])
        reservation.rodzaj_platnosci = data['rodzaj_platnosci_new']
        reservation.woda = int(data['woda_new'])
        reservation.cola = int(data['cola_new'])
        reservation.tarczyn = int(data['tarczyn_new'])
        reservation.fuzetea = int(data['fuzetea_new'])
        reservation.tiger = int(data['tiger_new'])
        reservation.zubr = int(data['zubr_new'])
        reservation.jack = int(data['jack_new'])
        reservation.jager = int(data['jager_new'])
        reservation.piwo = int(data['piwo_new'])
        reservation.produkty_platnosc = data['produkty_platnosc_new']

        reservation.save()
        return JsonResponse({'status': 'ok'})

#Usuwanie rezerwacji w otwartej rezerwacji
def deleteReservation(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        reservation = rezerwacje.objects.get(id=data['id'])
        reservation.delete()
        return JsonResponse({'status': 'ok'})