from django import forms
from .models import rezerwacje

class rezerwacjeForm(forms.ModelForm):
    class Meta:
        model = rezerwacje
        fields = '__all__' 