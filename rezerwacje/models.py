from django.db import models

# Create your models here.
class rezerwacje(models.Model):
    rodzaj_rezerwacji = models.CharField(max_length=100, null=True, blank=True)
    osoba = models.CharField(max_length=100)
    ilosc_osob = models.IntegerField(null=True, blank=True)
    data = models.DateField(auto_now=False, auto_now_add=False, null=True, blank=True)
    godzina = models.TimeField(auto_now=False, auto_now_add=False)
    czas = models.TimeField(auto_now=False, auto_now_add=False)
    kwota = models.FloatField(null=True, blank=True)
    rodzaj_platnosci = models.IntegerField(null=True, blank=True)
    notatka = models.CharField(max_length=200, null=True, blank=True)
    zatwierdzony = models.BooleanField(null=True, blank=True)


class produkty(models.Model):
    rezerwacja = models.ForeignKey(rezerwacje, on_delete=models.CASCADE, related_name="produkty")
    woda = models.IntegerField(null=True, blank=True)
    cola = models.IntegerField(null=True, blank=True)
    sok = models.IntegerField(null=True, blank=True)
    tiger = models.IntegerField(null=True, blank=True)
    fuzetea = models.IntegerField(null=True, blank=True)
    zubr = models.IntegerField(null=True, blank=True)
    jack = models.IntegerField(null=True, blank=True)
    jager = models.IntegerField(null=True, blank=True)
    piwo = models.IntegerField(null=True, blank=True)
    rodzaj_platnosci = models.IntegerField(null=True, blank=True)

    @property
    def suma_prod(self):
        return (
            self.woda * 7 +
            self.cola * 10 +
            self.sok * 8 +
            self.tiger * 8 +
            self.fuzetea * 10 +
            self.zubr * 10 +
            self.jack * 13 +
            self.jager * 10 +
            self.piwo * 18
        )