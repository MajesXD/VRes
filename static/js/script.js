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
        // Tutaj później dodamy generowanie HTML
    })
    .catch(err => console.error('Błąd pobierania rezerwacji:', err));
}