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
function setEventCard(button) {
  // get input values
  const eventName = document.getElementById('post-name').value;
  const eventDesc = document.getElementById('post-desc').value;
  const eventOrg = document.getElementById('post-org').value;
  const eventDate = document.getElementById('post-date').value;
  const eventStartTime = document.getElementById('post-start-time').value;
  const eventEndTime = document.getElementById('post-end-time').value;
  const eventLoc = document.getElementById('post-loc').value;
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];

  if (!eventName || !eventDesc || !eventOrg || !eventDate || !eventStartTime || !eventEndTime || !eventLoc || !file) {
    alert("Please fill out all fields and select an image.");
    return;
  }

  // Define character limits
  const nameLimit = 100;
  const descLimit = 500;
  const orgLimit = 100;

  // Check text field lengths
  if (eventName.length > nameLimit) {
    alert(`Event Name exceeds the character limit (${nameLimit}).`);
    return;
  }
  if (eventDesc.length > descLimit) {
    alert(`Event Description exceeds the character limit (${descLimit}).`);
    return;
  }

  // Check file size (500KB limit)
  const fileSizeLimit = 500 * 1024; // 500 KB in bytes
  if (file.size > fileSizeLimit) {
    alert("Image file size exceeds the limit (500KB). Please choose a smaller image.");
    return;
  }
  // create a FileReader to read the image
  const reader = new FileReader(); // Keep FileReader for preview, but use imageUrl directly
  reader.onload = function () {
    const imageUrl = reader.result;

    // Add a new document to the 'eventCards' collection
    db.collection("eventCards").add({
      eventName: eventName,
 eventDesc: "Cupcake Color Spash: Celebrate Pride with WIC!\n\nJoin us this Pride Month for a fun and vibrant cupcake decorating event! Celebrate love, identity, and community while creating colorful treats, sharing stories, and learning about the history of Pride. Everyone's welcome!",
      eventOrg: eventOrg,
      eventDate: eventDate,
      eventStartTime: eventStartTime,
      eventEndTime: eventEndTime,
      eventLoc: eventLoc,
      eventImg: imageUrl, // Use the base64 image data
      eventRSVPCount: 0
    })

    // optionally clear the form
    document.getElementById('title').value = '';
    document.getElementById('date-time').value = '';
    document.getElementById('description').value = '';
    fileInput.value = '';
  };
  reader.readAsDataURL(file);

  button.textContent = "Posted!";
  clearPostCard();
  openTab('events-page');
}

var eventIds = [];

function getEventCards() {
  const eventsContainer = document.getElementById('events-container');

  db.collection('eventCards').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const eventData = change.doc.data();
      const eventId = change.doc.id;

      if (change.type === 'added') {
        // Create a new event card element
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        eventCard.setAttribute('event-card-id', eventId);

        eventCard.innerHTML = `
          <div style="float: left;">
            <img class="event-img" src=${eventData.eventImg} style="width: 200px; height: 250px; cursor: pointer;">
          </div>
          <div style="margin-left: 225px">
            <h2 id="event-name"> ${eventData.eventName} </h2>
            <div id="event-desc"> ${eventData.eventDesc} </div>
            <div id="event-org">  ${eventData.eventOrg} </div>
            <div id="event-date"> ${eventData.eventDate}  </div>
            <div id="event-time"> ${formatTime(eventData.eventStartTime)} to ${formatTime(eventData.eventEndTime)} </div>
            <div id="event-loc"> ${eventData.eventLoc} </div>
            <div style="position: absolute; top: 0; right: 0; padding: 15px 15px">
              <div style="float: left; margin-top: 3px; font-size: 20px"> <span class="rsvp-count">${eventData.eventRSVPCount} </span> </div>
              <img style="width: 20px; margin-left: 5px" src="assets/sungod.jpg">
            </div>
            <button class="button" type="button" onclick="incRSVPCount(this)" style="margin-top: 20px"> RSVP! </button>
          </div>
        `;

        eventsContainer.appendChild(eventCard);
        eventCard.querySelector('.event-img').addEventListener('click', () => displayLargerImage(eventData.eventImg));
      } else if (change.type === 'modified') {
        // Update the existing event card
        const eventCard = eventsContainer.querySelector(`[event-card-id='${eventId}']`);
        if (eventCard) {
          const rsvpCountElement = eventCard.querySelector('.rsvp-count');
          if (rsvpCountElement) {
            rsvpCountElement.textContent = eventData.eventRSVPCount;
          }
        }

      } else if (change.type === 'removed') {
        // Remove the event card from the UI
        const eventCard = eventsContainer.querySelector(`[event-card-id='${eventId}']`);
        if (eventCard) {
          eventsContainer.removeChild(eventCard);
        }
      }
    });
  });
}

getEventCards();

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
  const eventCardId = button.closest('.event-card').getAttribute('event-card-id');

  // update the document in Firestore with the new RSVP count
  db.collection("eventCards").doc(eventCardId).update({
    eventRSVPCount: currentCount + 1
  })

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

// Helper to format date/time
function formatDateTime(dt) {
  const date = new Date(dt);
  return date.toLocaleString();
}

// Helper to format time in 12-hour format with AM/PM
function formatTime(timeString) {
  if (!timeString) return '';

  const [hours, minutes] = timeString.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM/PM
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

function clearPostCard() {
  document.getElementById('post-name').value = '';
  document.getElementById('post-desc').value = '';
  document.getElementById('post-org').value = '';
  document.getElementById('post-date').value = '';
  document.getElementById('post-start-time').value = '';
  document.getElementById('post-end-time').value = '';
  document.getElementById('post-loc').value = '';
  document.getElementById('file-input').value = ''; // clear the file input
  document.getElementById('image').src = 'assets/img_upload.png'; // reset image preview
}

window.onload = clearPostCard();

// function to display a larger version of the imag
function displayLargerImage(imageUrl) {
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '1000'; // Ensure it's on top
 modal.innerHTML = `<img src="${imageUrl}" style="max-width: 90%; max-height: 90%;">`;
 document.body.appendChild(modal);
 modal.onclick = () => modal.remove(); // close when clicked
}