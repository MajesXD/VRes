from django.db import models

class rezerwacje(models.Model):
    rodzaj_rezerwacji = models.CharField(max_length=100, null=True, blank=True)
    osoba = models.CharField(max_length=100, null=False, blank=True)
    ilosc_osob = models.IntegerField(null=True, blank=True)
    data = models.DateField(auto_now=False, auto_now_add=False, null=True, blank=True)
    godzina = models.TimeField(auto_now=False, auto_now_add=False)
    czas = models.TimeField(auto_now=False, auto_now_add=False)
    kwota = models.FloatField(null=True, blank=True)
    rodzaj_platnosci = models.IntegerField(null=True, blank=True)
    notatka = models.CharField(max_length=200, null=True, blank=True)
    zatwierdzony = models.BooleanField(null=True, blank=True)

    woda = models.IntegerField(null=True, blank=True)
    cola = models.IntegerField(null=True, blank=True)
    tarczyn = models.IntegerField(null=True, blank=True)
    fuzetea = models.IntegerField(null=True, blank=True)
    tiger = models.IntegerField(null=True, blank=True)
    zubr = models.IntegerField(null=True, blank=True)
    jack = models.IntegerField(null=True, blank=True)
    jager = models.IntegerField(null=True, blank=True)
    piwo = models.IntegerField(null=True, blank=True)
    produkty_platnosc = models.IntegerField(null=True, blank=True)