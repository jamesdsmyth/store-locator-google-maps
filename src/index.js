var locations = [
  {lat: -31.563910, lng: 147.154312, region: 'dubai'},
  {lat: -33.718234, lng: 150.363181, region: 'dubai'},
  {lat: -33.727111, lng: 150.371124, region: 'dubai'},
  {lat: -33.848588, lng: 151.209834, region: 'dubai'},
  {lat: -39.927193, lng: 175.053218, region: 'dubai'},
  {lat: -41.330162, lng: 174.865694, region: 'dubai'},
  {lat: -42.734358, lng: 147.439506, region: 'dubai'},
  {lat: -42.734358, lng: 147.501315, region: 'dubai'},
  {lat: -42.735258, lng: 147.438000, region: 'dubai'},
  {lat: -43.999792, lng: 170.463352, region: 'dubai'},
  {lat: -33.851702, lng: 151.216968, region: 'abu dhabi'},
  {lat: -34.671264, lng: 150.863657, region: 'abu dhabi'},
  {lat: -35.304724, lng: 148.662905, region: 'abu dhabi'},
  {lat: -36.817685, lng: 175.699196, region: 'abu dhabi'},
  {lat: -36.828611, lng: 175.790222, region: 'abu dhabi'},
  {lat: -37.750000, lng: 145.116667, region: 'al ain'},
  {lat: -37.759859, lng: 145.128708, region: 'al ain'},
  {lat: -37.765015, lng: 145.133858, region: 'al ain'},
  {lat: -37.770104, lng: 145.143299, region: 'al ain'},
  {lat: -37.773700, lng: 145.145187, region: 'al ain'},
  {lat: -37.774785, lng: 145.137978, region: 'al ain'},
  {lat: -37.819616, lng: 144.968119, region: 'al ain'},
  {lat: -38.330766, lng: 144.695692, region: 'al ain'}
]

var map;
var markers = [];
var markerCluster;
var listCreated = false;
var selectedLocations = locations;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: -28.024, lng: 140.887}
  });

  // Create an array of alphabetical characters used to label the markers.
  // var labels = 't';

  // Add some markers to the map.
  // Note: The code uses the JavaScript Array.prototype.map() method to
  // create an array of markers based on a given "locations" array.
  // The map() method here has nothing to do with the Google Maps API.

  createMarkers();
  createList();
  attachListClickEvent();
}

createMarkers = function() {

  markers = selectedLocations.map(function(location, i) {
    var label = i + 1;
    var marker = new google.maps.Marker({
      position: location,
      label: ""+ label +"",
      id: label
    });

    google.maps.event.addListener(marker, 'click', function() {
      console.log(this)
      highlightListItem(this.label);
    });

    return marker;
  });

  createClusters();
}

createClusters = function() {
  markerCluster = new MarkerClusterer(map, markers,
    {
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    }
  );
}

createList = function() {
  if(!listCreated) {

    var b = 1;

    for(var i = 0; i < locations.length; i++) {
      createListItem(locations[i], b);
      b = b + 1;
    }

    listCreated = true;
    initSearch();
  }
}

highlightListItem = function(index) {
  removeHightlight();
  $('#store-list li').eq((index - 1)).addClass('highlight');
  // google.maps.event.trigger(markers[index], 'click');
}

removeHightlight = function() {
  $('#store-list li').removeClass('highlight');
}

initSearch = function() {
  window.addEventListener('input', function (e) {
    search(e.target.value);
  }, false);
}

search = function(value) {
  document.getElementById('store-list').innerHTML = '';
  removeHightlight();

  // clearing the marker list serch
  selectedLocations = [];

  var b = 1;

  // looping through each
  for(var i = 0; i < locations.length; i++) {
    if(locations[i].region.indexOf(value) > -1) {
      createListItem(locations[i], b);
      selectedLocations.push(locations[i]);

      b = b + 1;
    }
  }

  replotMarkers();
}

replotMarkers = function() {
  markerCluster.clearMarkers();
  createMarkers();
}

createListItem = function(location, value) {
  $('#store-list').append("<li data-index='" + value + "'><span>" + value + ' ' + location.region +"</span></li>");
}

attachListClickEvent = function() {
  $('#store-list').on('mouseover', 'li', function(event) {
    var index = $(this).attr('data-index');
    map.panTo(markers[index].getPosition());
    map.setZoom(12);
    highlightListItem(index);
    // need to get the long and lat and then focus on the map from here.
  });

  $('#store-list').on('mouseout', 'li', function(event) {
    removeHightlight();
    // need to get the long and lat and then focus on the map from here.
  });
}
