from django.db import models

class rezerwacje(models.Model):
    rodzaj_rezerwacji = models.CharField(max_length=100, null=True, blank=True)
    osoba = models.CharField(max_length=100, null=False, blank=True)
    ilosc_osob = models.IntegerField()
    data = models.DateField(auto_now=False, auto_now_add=False)
    godzina = models.TimeField(auto_now=False, auto_now_add=False)
    czas = models.TimeField(auto_now=False, auto_now_add=False)
    kwota = models.FloatField(default=0)
    rodzaj_platnosci = models.IntegerField(default=0)
    notatka = models.CharField(max_length=200, null=True, blank=True)
    zatwierdzony = models.BooleanField(default=False)

    woda = models.IntegerField(default=0)
    cola = models.IntegerField(default=0)
    tarczyn = models.IntegerField(default=0)
    fuzetea = models.IntegerField(default=0)
    tiger = models.IntegerField(default=0)
    zubr = models.IntegerField(default=0)
    jack = models.IntegerField(default=0)
    jager = models.IntegerField(default=0)
    piwo = models.IntegerField(default=0)
    produkty_platnosc = models.IntegerField(default=0)