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

const quakes = {
  magMin: 6,
  magMax: 0,
  weeklyQuakesEndpoint: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson",
  monthlyQuakesEndpoint: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson',
  sfLatLng: (37.7749, 122.4194),
  image: {
    url: 'images/earthquakeIcon-red.svg', // url
    scaledSize: new google.maps.Size(200, 200), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 100) // anchor
  },
  response: [],
};
/* TODO 2 - write a function that sorts the response array by magnitude */

$(document).ready(function () {
  // console.log("Let's get coding!");
  // CODE IN HERE!
});

/* ORIGINAL - This works, somewhat */
/* TODO 1 - Update the onSuccess function to invoke another function to drop pins according to the stored quake object response.*/
// TODO - First - change the function from using the responce object for the loop to the stored responce in the quakes object
// TODO - Second - break the dropping pins into another function, then invoke it here
const onSuccess = response => {
  initMap();
  quakes.response = response;
  magMaxMin();


  const { features } = response;
  features.forEach(earthquake => {
    // console.log(earthquake);
    const hoursAgo = timeDiff(earthquake.properties.time);
    let mag = earthquake.properties.mag;
    let magDot = '';

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
    /* This doesn't entirely work, can't figure out how to split the titles to account for all the inconsistent formatting in the feed */
    // let quakeName = title.split(" ");
    // let quakeNameSlice = quakeName.slice(3, quakeName.length).join(" ");

    // if (quakeNameSlice.length === 0) {
    //   quakeNameSlice = title;
    // }

    const template = `<p>${mag} ${magDot} ${place}</span>, ${hoursAgo} hours ago</p>`;
    $('#info').append(template);

    const coords = earthquake.geometry.coordinates;
    // console.log(coords);
    const latLng = new google.maps.LatLng(coords[1], coords[0]);
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: image,
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

const magMaxMin = () => {
  for (let i = 0; i < quakes.response.features.length; i++) {
    let currentQuake = quakes.response.features[i];
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