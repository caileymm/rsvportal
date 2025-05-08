function openTab(tabName) {
    var tabs = document.getElementsByClassName('tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].style.display = 'none';
    }
    document.getElementById(tabName).style.display = 'block';
}

let clicked = false;
document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('click', function(e) {
      if (!clicked && e.target.classList.contains('rsvp-button')) {
          const button = e.target;
          const counter = button.closest('.event-card').querySelector('.rsvp-count');
          let currentCount = parseInt(counter.textContent);
          counter.textContent = currentCount + 1;
          
          button.textContent = "RSVPed!";
          clicked = true;
      }
  });
});