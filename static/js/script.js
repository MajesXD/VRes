
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
    document.getElementById('add_note_window').classList.remove('active');
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

function add_note_exit() {
    document.getElementById('add_note_window').classList.remove('active');
}

function add_note(event) {
    document.getElementById('add_note_window').classList.add('active');
    document.getElementById('add_reservation_window').classList.remove('active');
    event.stopPropagation();
    document.addEventListener('click', function(event) {
        if (!document.getElementById('add_note_window').contains(event.target)) {
            document.getElementById('add_note_window').classList.remove('active');
        }
    });
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
        document.getElementById('transfer_sum').textContent = data.transfer_sum + 'zł';
        document.getElementById('card_sum').textContent = data.card_sum + 'zł';
        document.getElementById('cash_sum').textContent = data.cash_sum + 'zł';
        document.getElementById('voucher_kmmb_sum').textContent = data.voucher_kmmb_sum + 'zł';
        document.getElementById('voucher_vr_sum').textContent = data.voucher_vr_sum + 'x';
        document.getElementById('summary_sum').textContent = data.summary_sum + 'zł';
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
        const czas_h = r.czas.split(':')[0];
        const czas_min = r.czas.split(':')[1];
        div.classList.add(`reservation-${godzina_h}clock`);
        div.classList.add(`reservation-${czas_h}h`)

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

    // Przesunięcie rezerwacji w dół w zależności od minuty zaczęcia
    const part_move = getComputedStyle(div);
    let start = parseInt(part_move.getPropertyValue('--start'));
    let end = parseInt(part_move.getPropertyValue('--end'));

    if (godzina_min == '00'){
        div.style.gridRowStart = start + 0;
        div.style.gridRowEnd = end + 0;
    }
    else if (godzina_min == '15'){
        div.style.gridRowStart = start + 1;
        div.style.gridRowEnd = end + 1;
    }
    else if (godzina_min == '30'){
        div.style.gridRowStart = start + 2;
        div.style.gridRowEnd = end + 2;
    }
    else if (godzina_min == '45'){
        div.style.gridRowStart = start + 3;
        div.style.gridRowEnd = end + 3;
    }

    // Wyciągnięcie rezerwacji w dół w zależności od czasu trwania
    const hour_height = getComputedStyle(div)
    let height = parseInt(hour_height.getPropertyValue('--res_height'));
    let duration_end = parseInt(hour_height.getPropertyValue('--end'));

    if (czas_h == '01') {
        div.style.height = height + 91;
        div.style.gridRowEnd = duration_end + 0;
    }
    else if (czas_h == '02') {
        div.style.height = height + 192;
        div.style.gridRowEnd = duration_end + 4;
    }
    else if (czas_h == '03') {
        div.style.height = height + 293;
        div.style.gridRowEnd = duration_end + 8;
    }
    else if (czas_h == '04') {
        div.style.height = height + 394;
        div.style.gridRowEnd = duration_end + 12;
    }
    else if (czas_h == '05') {
        div.style.height = height + 495;
        div.style.gridRowEnd = duration_end + 16;
    }
    else if (czas_h == '06') {
        div.style.height = height + 596;
        div.style.gridRowEnd = duration_end + 20;
    }
    else if (czas_h == '07') {
        div.style.height = height + 697;
        div.style.gridRowEnd = duration_end + 24;
    }
    else if (czas_h == '08') {
        div.style.height = height + 798;
        div.style.gridRowEnd = duration_end + 28;
    }
    else if (czas_h == '09') {
        div.style.height = height + 899;
        div.style.gridRowEnd = duration_end + 32;
    }
    else if (czas_h == '10') {
        div.style.height = height + 1000;
        div.style.gridRowEnd = duration_end + 36;
    }
    })

    const part_height = getComputedStyle(div)
    let heightpart = parseInt(part_height.getPropertyValue('--res_height'));
    let part_duration_end = parseInt(part_height.getPropertyValue('--end'));

    if (czas_min == '00') {
        div.style.height = heightpart + 0 + 'px';
        div.style.gridRowEnd = part_duration_end;
    }
    else if (czas_min == '15') {
        div.style.height = heightpart + 15 + 'px';
        div.style.gridRowEnd = part_duration_end + 1;
    }
    else if (czas_min == '30') {
        div.style.height = heightpart + 30 + 'px';
        div.style.gridRowEnd = part_duration_end + 2;
    }
    else if (czas_min == '45') {
        div.style.height = heightpart + 45 + 'px';
        div.style.gridRowEnd = part_duration_end + 3;
    }
}

// Podsumowanie
