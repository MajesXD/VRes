function summary_active() {
    document.getElementById('summary').classList.toggle('summary-active');
    document.getElementById('reservation_window').classList.remove('reservation-active')
}

function reservation_clicked() {
    document.getElementById('summary').classList.remove('summary-active');
    document.getElementById('reservation_window').classList.toggle('reservation-active')
}
