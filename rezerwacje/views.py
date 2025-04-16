from django.shortcuts import render, redirect
from .forms import rezerwacjeForm

def home(request):
    return render(request, 'rezerwacje/home.html')

def dodaj_rezerwacje(request):
    if request.method == 'POST':
        form = rezerwacjeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('rezerwacje/home.html')
    else:
        form = rezerwacjeForm()
    return render(request, 'dodaj_rezerwacje.html', {'form': form})
