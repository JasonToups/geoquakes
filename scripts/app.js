// define globals
var weekly_quakes_endpoint = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

var image = {
  url: '/images/earthquake.png', // url
  scaledSize: new google.maps.Size(25, 25), // scaled size
  origin: new google.maps.Point(0, 0), // origin
  anchor: new google.maps.Point(0, 0) // anchor
};

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
    if (mag >= 4 && mag < 5) {
      magDot = '<span class=yellow>O</span>';
    } else if (mag >= 5 && mag < 6) {
      magDot = '<span class=orange>O</span>';
    } else if (mag >= 6) {
      magDot = '<span class=red>O</span>';
    }


    const quakeName = earthquake.properties.title;
    const template = `<p>${magDot} ${quakeName}</span>, ${hoursAgo} hours ago</p>`;
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
  url: weekly_quakes_endpoint,
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
