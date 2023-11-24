'use strict';

(() => {
  window.addEventListener('load', (event) => {
    // Making a map and tiles
    // Setting a higher initial zoom to make effect more obvious
    const mymap = L.map('eventMap').setView([0, 0], 6);
    const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, {attribution});
    tiles.addTo(mymap);
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position) {
        const marker = L.marker([0,0]).addTo(mymap);
        mymap.setView([position.coords.latitude, position.coords.longitude], mymap.getZoom());
        marker.setLatLng([position.coords.latitude, position.coords.longitude]);
        //document.getElementById('data').innerHTML="latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude;
        var popupContent="My Location";
        marker.bindPopup(popupContent).openPopup();
      });
    }

    var startdate = document.getElementById('startDate');
    var enddate = document.getElementById('endDate');
    var searchbtn = document.getElementById('searchBtn');
    var clearbtn = document.getElementById('clearBtn');
    var searchbtn2 = document.getElementById('searchBtn2');
    var clearbtn2 = document.getElementById('clearBtn2');
    var searchbtn3 = document.getElementById('searchBtn3');
    var clearbtn3 = document.getElementById('clearBtn3');

    searchbtn.addEventListener('click',searchEvents);
    clearbtn.addEventListener('click',clearEvents);
    searchbtn2.addEventListener('click',searchVenue);
    clearbtn2.addEventListener('click',clearEvents2);
    searchbtn3.addEventListener('click',searchPerformer);
    clearbtn3.addEventListener('click',clearEvents3);
//Display events within 200 mile radius of the user
    async function searchEvents(){
      const apiKey = 'MzgwODEwMTZ8MTY5OTI2MTI1Mi4zNDQ4Mzc3';
      const apiSecret = '8a8006baa6a60f4b8d09d4d365ec48ddb194cd4e2931747156ec9aca37705cab';
      var date1 = startdate.value;
      var date2 = enddate.value;
      const response = await fetch(`https://api.seatgeek.com/2/events?geoip=true&per_page=100&page=1&datetime_utc.gte=${date1}&datetime_utc.lte=${date2}&client_id=${apiKey}&client_secret=${apiSecret}`);
      const data = await response.json();
    displayEvents(data.events);
    console.log(data.events);
    for (let i = 0; i < data.events.length; i++) {
      const marker = L.marker([data.events[i].venue.location.lat, data.events[i].venue.location.lon]).addTo(mymap);
      // Use the event's latitude and longitude to create markers
      marker.bindPopup(popupContent).openPopup();
  var popupContent=`${data.events[i].title}`+'<p>'+`${data.events[i].datetime_local}`+'</p>';
  }
    }

    function displayEvents(events) {
      const eventList = document.getElementById('event-list');
      eventList.innerHTML = '';
      events.forEach((event) => {
          const eventItem = document.createElement('div');
          eventItem.classList.add('event-item','mx-5','justify-content-center');
          eventItem.innerHTML = `
              <img src=${event.performers[0].image} class="rounded mx-auto d-block">
              <h2 class="text-center">${event.title}</h2>
              <p class="text-center">Date: ${event.datetime_local}</p>
              <p class="text-center">Venue: ${event.venue.name}</p>
              <p class="text-center">City: ${event.venue.city}</p>
              <p class="text-center">Event Type: ${event.taxonomies[0].name}</p>
              <hr>
          `;
          eventList.appendChild(eventItem);     
      });
  }
  function clearEvents(){
    document.getElementById("event-list").remove();
    document.getElementById("eventMap").remove();
    location.reload();
  }
  async function searchVenue(){
    const apiKey = 'MzgwODEwMTZ8MTY5OTI2MTI1Mi4zNDQ4Mzc3';
      const apiSecret = '8a8006baa6a60f4b8d09d4d365ec48ddb194cd4e2931747156ec9aca37705cab';
      const response = await fetch(`https://api.seatgeek.com/2/venues?geoip=true&per_page=100&page=1&client_id=${apiKey}&client_secret=${apiSecret}`);
      const data = await response.json();
      displayVenue(data.venues);
      console.log(data.venues)
      for (let i = 0; i < data.venues.length; i++) {
        const marker = L.marker([data.venues[i].location.lat, data.venues[i].location.lon],{icon: stadiumIcon}).addTo(mymap);
        // Use the event's latitude and longitude to create markers
        marker.bindPopup(popupContent).openPopup();
    var popupContent=`${data.venues[i].name}`+'<p>'+`${data.venues[i].address}`+'</p>'+`${data.venues[i].display_location}`;
    }
    }
    function displayVenue(venues) {
      const venueList = document.getElementById('venue-list');
      venueList.innerHTML = '';
      venues.forEach((venue) => {
          const venueItem = document.createElement('div');
          venueItem.classList.add('venue-item','mx-5','justify-content-center');
          venueItem.innerHTML = `
              <h2 class="text-center">${venue.name}</h2>
              <p class="text-center">Address: ${venue.address}</p>
              <p class="text-center">Location: ${venue.display_location}</p>
              <p class="text-center">Capacity: ${venue.capacity}</p>
              <hr>
          `;
          venueList.appendChild(venueItem);     
      });
  }
  function clearEvents2(){

    location.reload();;

    document.getElementById("venue-list").remove();
    document.getElementById("eventMap").remove();
    location.reload();
  }
  // Making a marker with a custom icon
  const stadiumIcon = L.icon({
    iconUrl: 'stadium.png',
    iconSize: [25, 16],
    iconAnchor: [25, 16],
  });
//Search all performers
async function searchPerformer(){
  const apiKey = 'MzgwODEwMTZ8MTY5OTI2MTI1Mi4zNDQ4Mzc3';
  const apiSecret = '8a8006baa6a60f4b8d09d4d365ec48ddb194cd4e2931747156ec9aca37705cab';
  const response = await fetch(`https://api.seatgeek.com/2/performers?&per_page=100&page=1&client_id=${apiKey}&client_secret=${apiSecret}`);
  const data = await response.json();
  displayPerformers(data.performers);
  console.log(data.performers)
}
function displayPerformers(performer){
  const performerList = document.getElementById('performer-list');
  performerList.innerHTML = '';
  performer.forEach((performers) => {
  const performerItem = document.createElement('div');
  performerItem.classList.add('performer-item','mx-5','justify-content-center');
  performerItem.innerHTML = `
      <img src=${performers.image} class="rounded mx-auto d-block">
      <h2 class="text-center">${performers.name}</h2>
      <p class="text-center">Type: ${performers.type}</p>
      <a class="text-center" href=${performers.url}>${performers.url}</a>
      <hr>
      `;
  performerList.appendChild(performerItem);     
      });
  }
  function clearEvents3(){
    document.getElementById("performer-list").remove();
  }
  });
})();
    
   
   
 
