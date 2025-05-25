// initialize firebase
const firebaseConfig = {
  apiKey: "AIzaSyA5EAy2efIFrhPxIMKhVrshqEpEJIxyknY",
  authDomain: "rsvp-portal.firebaseapp.com",
  projectId: "rsvp-portal",
  storageBucket: "rsvp-portal.firebasestorage.app",
  messagingSenderId: "992133393969",
  appId: "1:992133393969:web:14611e57a5b6389a5c2f10",
  measurementId: "G-TKH7Y7G4G2"
};
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// TO DO: complete implementation of addEvent() (!!)
function addEvent() {
  db.collection("eventCards").add({
      eventTitle: eventTitle,
      eventDescription: eventDescription,
      eventOrg: eventOrg,
      eventDate: eventDate,
      eventTime: eventTime,
      eventLocation: eventLocation,
      eventImage: eventImage,
      rsvpCount: rsvpCount
  })
  .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });
}

// TEST (DELETE LATER !!)
db.collection("testCollection").add({
    testField: "testValue",
    anotherField: "anotherValue"
})
.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
    console.error("Error adding document: ", error);
});


// function to open a specific tab and hide others
function openTab(tabName) {
  // get all elements with the class 'tab'
  var tabs = document.getElementsByClassName('tab');
  // iterate over each tab and hide it by setting its display style to 'none'
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = 'none';
  }
  // get the element with the specified tabName and display it by setting its display style to 'block'
  document.getElementById(tabName).style.display = 'block';
}


// function to increment the RSVP count when a button is clicked
// also changes the button text to "RSVPed!" to indicate the user has RSVPed
function incRSVPCount(button) {
  // if button text is already "RSVPed!", then return
  if (button.textContent === "RSVPed!") {
      return;
  }

  // if not, then increment the count and update the button
  // find the closest parent element with the class 'event-card', then find the element within that parent that has 
  // the class 'rsvp-count'; this is the element displaying the RSVP count
  const counter = button.closest('.event-card').querySelector('.rsvp-count');
  // get the current count from the counter element and convert it to an integer to perform arithmetic
  let currentCount = parseInt(counter.textContent);
  counter.textContent = currentCount + 1;

  button.textContent = "RSVPed!";
}

// image upload feature
function fileInput() {
  document.getElementById('file-input').click();
}
function replaceImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function() {
      const output = document.getElementById('image');
      output.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

function openTab(tabId, button) {
  document.querySelectorAll('.tab').forEach(tab => tab.hidden = true);
  document.getElementById(tabId).hidden = false;

  // Remove active class from all buttons
  document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));
  // Add active class to clicked button
  button.classList.add('active');
}

function addEvent() {
  // Get input values
  const title = document.getElementById('title').value;
  const dateTime = document.getElementById('date-time').value;
  const description = document.getElementById('description').value;

  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];

  if (!title || !dateTime || !description || !file) {
    alert("Please fill out all fields and select an image.");
    return;
  }

  // Create a FileReader to read the image
  const reader = new FileReader();
  reader.onload = function (e) {
    const imageUrl = e.target.result;

    // Create event card HTML
    const newCard = document.createElement('div');
    newCard.classList.add('event-card');
    newCard.innerHTML = `
      <h2 class="event-title">${title}</h2>
      <p class="event-description">${description}</p>
      <div class="event-date-time">${formatDateTime(dateTime)}</div>
      <img class="event-img" src="${imageUrl}" style="width: 100px; height: auto">
      <button class="rsvp-button" onclick="incRSVPCount(this)">RSVP!</button>
    `;

    // Add to the events container
    document.querySelector('.events-container').appendChild(newCard);

    // Optionally clear the form
    document.getElementById('title').value = '';
    document.getElementById('date-time').value = '';
    document.getElementById('description').value = '';
    fileInput.value = '';
  };

  reader.readAsDataURL(file);
}

// Helper to format date/time
function formatDateTime(dt) {
  const date = new Date(dt);
  return date.toLocaleString();
}

// Optional RSVP count handler
function incRSVPCount(button) {
  if (!button._count) button._count = 0;
  button._count++;
  button.textContent = `RSVP (${button._count})`;
}
