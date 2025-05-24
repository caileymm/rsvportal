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

// ------------------------------------------------------------------------------------------------------------------------------------------------------
var eventIds = [];

// TO DO: complete implementation of setEventCard() (!!)
function setEventCard() {
  db.collection("eventCards").add({
    //eventDescription: eventDescription,
    //eventOrg: eventOrg,
    //eventDate: eventDate,
    //eventTime: eventTime,
    //eventLocation: eventLocation,
    //eventImage: eventImage,
    //rsvpCount: rsvpCount
  })
  // TO DO: catch errors
}

function getEventCards() {
  // db.collection("eventCards").get(): gets a reference to the 'eventCards' collection and fetches all the documents in it
  // .then()((querySnapshot) => {...)): executed when the asynchronous operation (getting the document) is successful; 'querySnapshot' is an object that contains the results of the query
  // querySnapshot.docs.forEach((doc) => { ... }): querySnapshot.docs is an arry of document snapshots; forEach() method is used to loop through each doc in this array
  db.collection('eventCards').get().then((querySnapshot) => {
    const eventsContainer = document.getElementById('events-container');
    querySnapshot.docs.forEach((doc) => {
      const eventData = doc.data();
      
      eventIds.forEach((id) => {
        if (id === doc.id) {
          let counter = eventsContainer.getAttribute('event-card-id', doc.id).querySelector('.rsvp-count');
          let currentCount = parseInt(counter.textContent);
          counter.textContent = eventData.eventRSVPCount;
          return;
        }
      });

      // create a new div element for the event card
      const eventCard = document.createElement('div');
      eventCard.classList.add('event-card');
      eventCard.setAttribute('event-card-id', doc.id);

      eventCard.innerHTML = `
        <div style="float: left;">
          <img class = "event-img" src=${eventData.eventImg} style="width: 200px; height: 250px">
        </div>
        <div style="margin-left: 225px">
          <h2 class = "event-name"> ${eventData.eventName} </h2>
          <div class = "event-desc"> ${eventData.eventDesc} </div>
          <div class = "event-org">  ${eventData.eventOrg} </div>
          <div class = "event-date"> ${eventData.eventDate}  </div>
          <div class = "event-time"> ${eventData.eventTime} </div>
          <div class = "event-loc"> ${eventData.eventLoc} </div>
          <div style="position: absolute; top: 0; right: 0; padding: 15px 15px">
            <div style="float: left; margin-top: 3px; font-size: 20px"> <span class="rsvp-count">${eventData.eventRSVPCount} </span> </div>
            <img style="width: 20px; margin-left: 5px" src="assets/sungod.jpg">
          </div>
          <button class = "button" type="button" onclick="incRSVPCount(this)" style="margin-top: 20px"> RSVP! </button>
        </div>
      `;

      eventsContainer.appendChild(eventCard);
      eventIds.push(doc.id);
    });
  });
}

getEventCards();

/*
// TEST (DELETE LATER !!)
db.collection("eventCards").add({
  eventName: "Sun God Festival 2025",
  eventDesc: "UCSD's biggest annual music festival featuring live performances, food trucks, and more!",
  eventOrg: "AS UCSD",
  eventDate: "May 3rd, 2025",
  eventTime: "12:00 PM to 6:00 PM",
  eventLoc: "RIMAC Field",
  eventImg: "assets/sungod-festival.jpg",
  eventRSVPCount: "0"
})
.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
    console.error("Error adding document: ", error);
});
*/

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
  const eventCardId = button.closest('.event-card').getAttribute('event-card-id');

  // update the document in Firestore with the new RSVP count
  db.collection("eventCards").doc(eventCardId).update({
    eventRSVPCount: currentCount + 1
  })
  .then(() => {
    console.log("Document successfully updated!");
  })
  .catch((error) => {
    console.error("Error updating document: ", error);
  });

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