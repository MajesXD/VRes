const reservation_colors = {
    vr: '#4F3EE3',
    calendar: '#D72B2B',
    street: '#0E733A',
    block: 'white',
};


// Onclicki active
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
        const godzina_h = r.godzina.split(':')[0];
        const godzina_min = r.godzina.split(':')[1];
        const czas_h = r.czas.split(':')[0];
        const czas_min = r.czas.split(':')[1];
        div.addEventListener('click', reservationFull);
        div.classList.add('reservation');
        div.style.backgroundColor = reservation_colors[r.rodzaj];
        div.dataset.id = r.id;
        div.dataset.rodzaj = r.rodzaj;
        div.dataset.osoba = r.osoba;
        div.dataset.ilosc = r.ilosc_osob
        div.dataset.godzina = r.godzina;
        div.dataset.czas = r.czas;
        div.dataset.kwota = r.kwota;
        div.dataset.rodzaj_platnosci = r.rodzaj_platnosci;
        div.dataset.notatka = r.notatka;
        div.dataset.zatwierdzony = r.zatwierdzony;
        
        // Ikona płatności
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
    
        // Blok z rezerwacją
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

    // Dodawanie bloku i warunki jak ma wyglądać i gdzie ma być
    container.appendChild(div);

    const reservation_styles = getComputedStyle(div);
    let grid_start = parseInt(reservation_styles.getPropertyValue('--grid_start'));
    let grid_end = parseInt(reservation_styles.getPropertyValue('--grid_end'));
    let grid_height = parseInt(reservation_styles.getPropertyValue('--grid_height'));

    //Umiejscowienie rezerwacji w zależności od godziny 
    place_start = (godzina_h - 12) * 4 + 1;
    place_end = (godzina_h - 12) * 4 + 5;
    grid_start += place_start; 
    grid_end += place_end;

    // Przesunięcie rezerwacji w dół w zależności od minuty zaczęcia
    if (godzina_min == '00'){
        grid_start += 0;
        grid_end += 0;
    }
    else if (godzina_min == '15'){
        grid_start += 1;
        grid_end += 1;
    }
    else if (godzina_min == '30'){
        grid_start += 2;
        grid_end += 2;
    }
    else if (godzina_min == '45'){
        grid_start += 3;
        grid_end += 3;
    }

    // Wyciągnięcie rezerwacji w dół w zależności od czasu trwania
    if (czas_h == '01') {
        grid_height += 91;
        grid_end += 0;
    }
    else if (czas_h == '02') {
        grid_height += 192;
        grid_end += 4;
    }
    else if (czas_h == '03') {
        grid_height += 293;
        grid_end += 8;
    }
    else if (czas_h == '04') {
        grid_height += 394;
        grid_end += 12;
    }
    else if (czas_h == '05') {
        grid_height += 495;
        grid_end += 16;
    }
    else if (czas_h == '06') {
        grid_height += 596;
        grid_end += 20;
    }
    else if (czas_h == '07') {
        grid_height += 697;
        grid_end += 24;
    }
    else if (czas_h == '08') {
        grid_height += 798;
        grid_end += 28;
    }
    else if (czas_h == '09') {
        grid_height += 899;
        grid_end += 32;
    }
    else if (czas_h == '10') {
        grid_height += 1000;
        grid_end += 36;
    }
    
    // Wyciągnięcie rezerwacji w dół w zależności od minut trwania
    if (czas_min == '00') {
        grid_height += 0;
        grid_end += 0;
    }
    else if (czas_min == '15') {
        grid_height += 26;
        grid_end += 1;
    }
    else if (czas_min == '30') {
        grid_height += 51;
        grid_end += 2;
    }
    else if (czas_min == '45') {
        grid_height += 76;
        grid_end += 3;
    }

    // Szerokość rezerwacji w zależności od liczby osób
    let dlugosc = r.ilosc_osob;
    if (dlugosc > 8) {
        dlugosc = 8;
    }
    else {
        dlugosc = dlugosc;
    }

    div.style.gridColumn = 'span ' + dlugosc;
    div.style.height = grid_height + 'px';
    div.style.gridRowStart = grid_start;
    div.style.gridRowEnd = grid_end;
    })
}

function reservationFull(event) {
    const div = event.currentTarget;
    const container_full = document.getElementById('reservation-full');

    // Pełna rezerwacja (kliknięta)
     container_full.innerHTML = `
        <div class="reservation_window">

            <p>Rodzaj rezerwacji: ${div.dataset.rodzaj}</p>
            <p>Osoba: ${div.dataset.osoba}</p>
            <p>Ilość osób: ${div.dataset.ilosc_osob}</p>
            <p>Data: ${div.dataset.data}</p>
            <p>Godzina: ${div.dataset.godzina}</p>
            <p>Czas: ${div.dataset.czas}</p>
            <p>Kwota: ${div.dataset.kwota}</p>
            <p>rodzaj: ${div.dataset.rodzaj_platnosci}</p>
            <p>notka: ${div.dataset.notatka}</p>
            <p>zatw: ${div.dataset.zatwierdzony}</p>
            
        </div>
`;
    div.style.borderColor = reservation_colors[div.dataset.rodzaj];
    document.getElementById('add_reservation_window').classList.remove('active');
    document.getElementById('add_note_window').classList.remove('active');
    container_full.classList.add('active');
    event.stopPropagation();
    document.addEventListener(cancelIdleCallback, function(event) {
        if (!container_full.contains(event.target)) {
            container_full.classList.remove('active');
        }
    })
    // document.removeEventListener('click', clickOutside);
    // setTimeout(() => {
    //     document.addEventListener('click', clickOutside);
    // }, 0);

    // function clickOutside(event) {
    //     const container_full = document.getElementById('reservation-full');
    
    //     if (!container_full.contains(event.target)) {
    //         container_full.classList.remove('active');
    //         document.removeEventListener('click', clickOutside);
    //     }
    // }
}   
// Podsumowanie
