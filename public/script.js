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

function newEvent(eventTitle, eventDescription, eventDate, eventTime, eventLocation, eventImage) {
  db.collection("eventCard").add({
      eventTitle: eventTitle,
      eventDescription: eventDescription,
      eventDate: eventDate,
      eventTime: eventTime,
      eventLocation: eventLocation,
      eventImage: eventImage
      // add more....
  })
  .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });
}

// TEST!!!!
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