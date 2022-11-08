let map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Get events
let loaderContainer = document.getElementById('loader-flex-container');
loaderContainer.classList.add('visible');

fetch('https://eonet.gsfc.nasa.gov/api/v3/events')
.then(response => {
  if (response.ok) {
    return response.json();
  } else {
    console.log("An error occurred: ", response.statusText);
  }
})
.then(data => {
  let events = data.events;
  for (let i = 0; i < events.length; i++) {
    for (let j = 0; j < events[i].geometry.length; j++) {
      // The coordinates provided by EONet are in the format longitude, latitude, while Leaflet requires the format latitude, longitude -> I reversed the coordinates
      let coordinates = events[i].geometry[j].coordinates.reverse();
      let date = events[i].geometry[j].date;
      let eventMarker = L.marker(coordinates).addTo(map);

      eventMarker.bindPopup(
        `${events[i].title}, 
          ${new Date(date).toUTCString()}`
      );
    }
  }
  loaderContainer.classList.remove('visible');
})
.catch(error => {
  console.log(error);
});


