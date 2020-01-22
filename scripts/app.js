// define globals
let weekly_quakes_endpoint = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';

let monthly_quakes_endpoint = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';

let quakes_endpoint = [weekly_quakes_endpoint, monthly_quakes_endpoint];

let sfLatLng = (37.7749, 122.4194);

let image = {
  url: 'images/earthquakeIcon-red.svg', // url
  scaledSize: new google.maps.Size(36, 36), // scaled size
  origin: new google.maps.Point(0, 0), // origin
  anchor: new google.maps.Point(0, 18) // anchor
};
// TODO - refactor all code to use the quakes object
const quakes = {
  magMin: 6,
  magMax: 0,
  weeklyQuakesEndpoint: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson",
  monthlyQuakesEndpoint: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson',
  sfLatLng: (37.7749, 122.4194),
  image: {
    url: 'images/earthquakeIcon-red.svg', // url
    scaledSize: new google.maps.Size(36, 36), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 18) // anchor
  },
  sortDate: [],
  sortMag: [],
  markers: [],
};
/* TODO - Animate the pins dropping in slowly */
/* TODO - write a function that adds a unique ID to the response array */
/* TODO - get the pins to be styled by CSS */

$(document).ready(function () {
  // console.log("Let's get coding!");
  // CODE IN HERE!
});

const onSuccess = response => {
  initMap();
  quakes.sortDate = response;
  // quakes.sortMag = response;
  magMaxMin();
  // sortMag();
  createMarkers(quakes.sortDate);
};

// TODO - write function that sorts the data by date and makes the markers

// TODO - write function that sorts the data by magnitude and makes the markers

const sortMag = () => {
  /* TODO BUG - this sort function is sorting both sortMag & sortDate. I think it might have something to do with the onSuccess function */
  quakes.sortMag = quakes.sortDate;
  quakes.sortMag.features.sort((a, b) => (a.properties.mag < b.properties.mag) ? 1 : (a.properties.mag === b.properties.mag) ? ((a.size < b.size) ? 1 : -1) : -1)
}

// TODO - write sortDate function to sort the response by date
// TODO / TEST - wrote this on phone 
const sortDate = () => {
  /* TODO BUG - this sort function is sorting both sortMag & sortDate. I think it might have something to do with the onSuccess function */
  quakes.sortDate.features.sort((a, b) => (a.properties.date < b.properties.date) ? 1 : (a.properties.date === b.properties.date) ? ((a.size < b.size) ? 1 : -1) : -1)
}


const createMarkers = (array) => {
  // {features} targets just the features in the object
  let { features } = array;
  features.forEach(earthquake => {
    const hoursAgo = timeDiff(earthquake.properties.time);
    let mag = earthquake.properties.mag;
    let magDot = '';

    /* TODO - get the pins to use mag as the z-index CSS property */

    let calc = ((quakes.magMax - quakes.magMin) / 6);
    if (mag >= quakes.magMin && mag < quakes.magMin + (calc * 1)) {
      magDot = '<span class=purple>O</span>';
      // console.log(mag);
      image.url = 'images/earthquakeIcon-purple.svg'
    } else if (mag >= quakes.magMin + (calc * 1) && mag < quakes.magMin + (calc * 2)) {
      magDot = '<span class=blue>O</span>';
      // console.log(mag);
      console.log(calc * 3);
      image.url = 'images/earthquakeIcon-blue.svg'
    } else if (mag >= quakes.magMin + (calc * 2) && mag < quakes.magMin + (calc * 3)) {
      magDot = '<span class=green>O</span>';
      console.log(mag);
      image.url = 'images/earthquakeIcon-green.svg'
    } else if (mag >= quakes.magMin + (calc * 3) && mag < quakes.magMin + (calc * 4)) {
      magDot = '<span class=yellow>O</span>';
      image.url = 'images/earthquakeIcon-yellow.svg'
    } else if (mag >= quakes.magMin + (calc * 4) && mag < quakes.magMin + (calc * 5)) {
      magDot = '<span class=orange>O</span>';
      image.url = 'images/earthquakeIcon-orange.svg'
    } else if (mag >= quakes.magMin + (calc * 5) && mag <= quakes.magMax) {
      magDot = '<span class=red>O</span>';
      image.url = 'images/earthquakeIcon-red.svg'
    }

    const place = earthquake.properties.place;

    const template = `<p>${mag} ${magDot} ${place}</span>, ${hoursAgo} hours ago</p>`;
    $('#info').append(template);

    const coords = earthquake.geometry.coordinates;
    // console.log(coords);
    const latLng = new google.maps.LatLng(coords[1], coords[0]);

    /* I need to read the documentation on this. I think it's possible to get the markers to drop slowly, but I think I need to add the markers to an array, separate from the rest of this function */
    /* This turned all the markers purple */
    // window.setTimeout(function() {
    //   quakes.markers.push(new google.maps.Marker({
    //     position: latlng,
    //     map: map,
    //     icon: image,
    //     animation: google.maps.Animation.DROP
    //   }));
    // }, 400);

    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: image,
    });
  });
}


const onError = (error, errorText, errorCode) => {
  console.log({ error })
};

$.ajax({
  method: 'GET',
  url: quakes_endpoint[0],
  success: onSuccess,
  error: onError
})

const magMaxMin = () => {
  for (let i = 0; i < quakes.sortDate.features.length; i++) {
    let currentQuake = quakes.sortDate.features[i];
    let currentQuakeMag = currentQuake.properties.mag;

    if (currentQuakeMag < quakes.magMin) {
      quakes.magMin = currentQuakeMag;
    }
    if (currentQuakeMag > quakes.magMax) {
      quakes.magMax = currentQuakeMag;
    }
  }
  quakes.magDifference = quakes.magMax - quakes.magMin;
}

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
  marker = new google.maps.Marker({
    position: sanFrancisco,
    map: map,
  });

}

/* makeButtons works, but the buttons aren't centered in the row, and the buttons aren't hooked up to an event listener */
/* TODO - Add buttons to the DOM */
/* TODO - Add event listener to the buttons to change between the date and mag sort functions */
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