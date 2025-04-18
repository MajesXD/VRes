function summary_active() {
    document.getElementById('summary').classList.toggle('active');
    document.getElementById('reservation_window').classList.remove('active')
}

function reservation_active() {
    document.getElementById('summary').classList.remove('active');
    document.getElementById('reservation_window').classList.toggle('active')
}

function add_reservation(event) {
    document.getElementById('add_reservation_window').classList.add('active');
    event.stopPropagation();
    document.addEventListener('click', function(event) {
        if (!document.getElementById('add_reservation_window').contains(event.target)) {
            document.getElementById('add_reservation_window').classList.remove('active');
        }
    });
}

function add_reservation_exit() {
    document.getElementById('add_reservation_window').classList.remove('active');
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function fetchReservations(date) {
    fetch('/get-reservations/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ date: date })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Rezerwacje z bazy:", data.reservations);
        renderReservations(data.reservations);
    })
    .catch(err => console.error('Błąd pobierania rezerwacji:', err));
}

function showReservations(reservations) {
    const container = document.getElementById('reservation_field');
    container.innerHTML = '';

    reservations.forEach(r => {
        const div = document.createElement('div');
        div.className = 'reservation';
        div.setAttribute('onclick', 'reservation_active(this)');
        div.dataset.id = r.id;
        div.dataset.osoba = r.osoba;
        div.dataset.iosc = r.ilosc_osob
        div.dataset.godzina = r.godzina;
        div.dataset.czas = r.czas;
        div.dataset.kwota = r.kwota;
        div.dataset.rodzaj = r.rodzaj;
        div.dataset.notatka = r.notatka;
        div.dataset.zatwierdzony = r.zatwierdzony;

        div.innerHTML = `
            <div class="reservation">
                <div class="reservation_info">
                    <img src="{% static 'img/person-white.svg' %}">
                    <p>{r.ilosc_osob}</p>
                    <img src="{% static 'img/clock-white.svg' %}" class="reservation_info-gap">
                    <p>{r.czas}</p>
                </div>

                <div class="reservation_info">
                    <p>{r.osoba}</p>
                </div>
                <div class="reservation_info">
                    <img src="{% static 'img/card-white.svg' %}">
                    <p class="reservation_info-gap">{r.kwota}</p>
                    <p>zł</p>
                </div>
            </div>
    `;

    container.appendChild(div);
    })
}