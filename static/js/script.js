function summary_active() {
    document.getElementById('summary').classList.toggle('summary-active');
}

function reservation_clicked(clicked) {
    document.getElementById('summary').classList.remove('summary-active');
    clicked.classList.add('reservation-active')
    clicked.classList.remove('reservation')
}
