// define globals
let weekly_quakes_endpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

let monthly_quakes_endpoint = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'

let quakes_endpoint = [weekly_quakes_endpoint, monthly_quakes_endpoint];

let sfLatLng = (37.7749, 122.4194);

let image = {
  url: 'images/earthquakeIcon-red.svg', // url
  scaledSize: new google.maps.Size(26, 26), // scaled size
  origin: new google.maps.Point(0, 0), // origin
  anchor: new google.maps.Point(0, 13) // anchor
};

// let markers = {
//   color: 'red',
//   url = 'images/earthquakeIcon-red.svg'
// }

$(document).ready(function () {
  console.log("Let's get coding!");
  // CODE IN HERE!
});

const onSuccess = response => {
  initMap();
  const { features } = response;
  features.forEach(earthquake => {
    console.log(earthquake);
    const hoursAgo = timeDiff(earthquake.properties.time);
    const mag = earthquake.properties.mag;
    let magDot = '';

    if (mag >= 4 && mag < 4.5) {
      magDot = '<span class=yellow>O</span>';
      image.url = 'images/earthquakeIcon-purple.svg'
    } else if (mag >= 4.5 && mag < 5) {
      magDot = '<span class=yellow>O</span>';
      image.url = 'images/earthquakeIcon-blue.svg'
    } else if (mag >= 5 && mag < 5.5) {
      magDot = '<span class=orange>O</span>';
      image.url = 'images/earthquakeIcon-yellow.svg'
    } else if (mag >= 5.5 && mag < 6) {
      magDot = '<span class=orange>O</span>';
      image.url = 'images/earthquakeIcon-orange.svg'
    } else if (mag >= 6) {
      magDot = '<span class=red>O</span>';
      image.url = 'images/earthquakeIcon-red.svg'
    }


    const title = earthquake.properties.title;
    let quakeName = title.split("of ")[1];

    const template = `<p>${magDot}magnitude ${mag} ${quakeName}</span>, ${hoursAgo} hours ago</p>`;
    $('#info').append(template);

    const coords = earthquake.geometry.coordinates;
    console.log(coords);
    const latLng = new google.maps.LatLng(coords[1], coords[0]);
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: image
    });
  });
};
const onError = (error, errorText, errorCode) => {
  console.log({ error })
};

$.ajax({
  method: 'GET',
  url: quakes_endpoint[0],
  success: onSuccess,
  error: onError
})

const timeDiff = (then) => {
  let now = Date.now();
  let hrsAgo = (((now - then) / 1000) / 60) / 60;
  return Math.round(hrsAgo);
};

var map;
function initMap() {
  let sanFrancisco = { lat: 37.78, lng: -122.44 };
  map = new google.maps.Map(document.getElementById('map'), {
    center: sanFrancisco,
    zoom: 2
  });
}

/* makeButtons works, but the buttons aren't centered in the row, and the buttons aren't hooked up to an event listener */
const makeButtons = () => {
  let buttons = `
  <div class="row">
    <div class="col-xs-12 col-md-6">
      <button type="button" id="weekly">Weekly</button>
    </div>
    <div class="col-xs-12 col-md-6">
      <button type="button" id="monthly">Monthly</button>
    </div>
  </div>`;
  $('#info').prepend(buttons);
}

makeButtons();