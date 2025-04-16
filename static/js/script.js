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


