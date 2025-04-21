
// Onclicki active
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

// Wyśiwetlanie obecnej daty w inputach z datą
const today = new Date().toISOString().split('T')[0];

document.addEventListener('DOMContentLoaded', function () {
    const selectedDay = document.getElementById('selected_day');
    const prevDay = document.getElementById('previous_day');
    const nextDay = document.getElementById('next_day');
    selectedDay.value = today;
    // data w dodawnaniu rezerwacji
    const reservation_add_date = document.getElementById('reservation_add_date');
    reservation_add_date.value = today;

    function changeDateBy(days) {
        const currentDate = new Date(selectedDay.value);
        currentDate.setDate(currentDate.getDate() + days);
        const newDate = currentDate.toISOString().split('T')[0];
        selectedDay.value = newDate;
        fetchReservations(newDate);
    }

    prevDay.addEventListener('click', () => changeDateBy(-1));
    nextDay.addEventListener('click', () => changeDateBy(1));

    selectedDay.addEventListener('change', function () {
        fetchReservations(this.value);
    });
});


// Pobieranie rezerwacji
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
        showReservations(data.reservations);
    })
    .catch(err => console.error('Błąd pobierania rezerwacji:', err));
}

function showReservations(reservations) {
    const container = document.getElementById('reservation_field');
    container.innerHTML = '';

    reservations.forEach(r => {
        const div = document.createElement('div');
        div.classList.add('reservation');
        div.classList.add(`reservation-${r.rodzaj}`);
        div.classList.add(`reservation-${r.ilosc_osob}x`);
        const godzina_h = r.godzina.split(':')[0];
        const godzina_min = r.godzina.split(':')[1];
        div.classList.add(`reservation-${godzina_h}clock`);
        div.classList.add(`reservation-${godzina_min}part`);

        div.setAttribute('onclick', 'reservation_active(this)');
        div.dataset.id = r.id;
        div.dataset.osoba = r.osoba;
        div.dataset.ilosc = r.ilosc_osob
        div.dataset.godzina = r.godzina;
        div.dataset.czas = r.czas;
        div.dataset.kwota = r.kwota;
        div.dataset.rodzaj_platnosci = r.rodzaj_platnosci;
        div.dataset.notatka = r.notatka;
        div.dataset.zatwierdzony = r.zatwierdzony;

        if (r.ilosc_osob > 8) {
            r.ilosc_osob = ">8";
        }
        
        let rodzaj_platnosci ='';
        if (r.rodzaj_platnosci === 1) {
            rodzaj_platnosci = '/static/img/transfer-white.svg';
        }
        else if (r.rodzaj_platnosci === 2) {
            rodzaj_platnosci = '/static/img/card-white.svg';
        }

        else if (r.rodzaj_platnosci === 3) {
            rodzaj_platnosci = '/static/img/coin-white.svg';
        }
        else if (r.rodzaj_platnosci === 4) {
            rodzaj_platnosci = '/static/img/voucher_vr-white.svg';
        }
        else if (r.rodzaj_platnosci === 5) {
            rodzaj_platnosci = '/static/img/voucher_mb-white.svg';
        }
        else if (r.rodzaj_platnosci === 6) {
            rodzaj_platnosci = '/static/img/voucher_km-white.svg';
        }
        else if (r.rodzaj_platnosci === 7) {
            rodzaj_platnosci = '/static/img/voucher_kp-white.svg';
        }
        else if (r.rodzaj_platnosci === 8) {
            rodzaj_platnosci = '/static/img/voucher_sp-white.svg';
        }

        let symbol_platnosci = '';

        if (r.rodzaj_platnosci === 4) {
            symbol_platnosci = 'x';
        }
        else {
            symbol_platnosci = 'zł';
        }

        div.innerHTML = `
            <div class="reservation">
                <div class="reservation_info">
                    <img src="static/img/person-white.svg"}">
                    <p>${r.ilosc_osob}</p>
                    <img src="static/img/clock-white.svg" class="reservation_info-gap">
                    <p>${r.czas}</p>
                </div>

                <div class="reservation_info">
                    <p>${r.osoba}</p>
                </div>
                <div class="reservation_info">
                    <img src="${rodzaj_platnosci}">
                    <p class="reservation_info-gap">${r.kwota}</p>
                    <p>${symbol_platnosci}</p>
                </div>
            </div>
    `;

    container.appendChild(div);
    })
}

// Podsumowanie
const transfer_sum = ''; 
const card_sum = '';
const cash_sum = '';
const voucher_kmmb_sum = '';
const voucher_vr_sum = '';
const summary_sum = '';