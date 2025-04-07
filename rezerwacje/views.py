from django.shortcuts import render

def home(request):
    return render(request, 'rezerwacje/home.html')
# Create your views here.
