var locations = [
  {lat: -31.563910, lng: 147.154312, store: 'Store 1', region: 'dubai'},
  {lat: -33.718234, lng: 150.363181, store: 'Store 2', region: 'dubai'},
  {lat: -33.727111, lng: 150.371124, store: 'Store 3', region: 'dubai'},
  {lat: -33.848588, lng: 151.209834, store: 'Store 4', region: 'dubai'},
  {lat: -39.927193, lng: 175.053218, store: 'Store 5', region: 'dubai'},
  {lat: -41.330162, lng: 174.865694, store: 'Store 6', region: 'dubai'},
  {lat: -42.734358, lng: 147.439506, store: 'Store 7', region: 'dubai'},
  {lat: -42.734358, lng: 147.501315, store: 'Store 8', region: 'dubai'},
  {lat: -42.735258, lng: 147.438000, store: 'Store 9', region: 'dubai'},
  {lat: -43.999792, lng: 170.463352, store: 'Store 10', region: 'dubai'},
  {lat: -33.851702, lng: 151.216968, store: 'Store 11', region: 'abu dhabi'},
  {lat: -34.671264, lng: 150.863657, store: 'Store 12', region: 'abu dhabi'},
  {lat: -35.304724, lng: 148.662905, store: 'Store 13', region: 'abu dhabi'},
  {lat: -36.817685, lng: 175.699196, store: 'Store 14', region: 'abu dhabi'},
  {lat: -36.828611, lng: 175.790222, store: 'Store 15', region: 'abu dhabi'},
  {lat: -37.750000, lng: 145.116667, store: 'Store 16', region: 'al ain'},
  {lat: -37.759859, lng: 145.128708, store: 'Store 17', region: 'al ain'},
  {lat: -37.765015, lng: 145.133858, store: 'Store 18', region: 'al ain'},
  {lat: -37.770104, lng: 145.143299, store: 'Store 19', region: 'al ain'},
  {lat: -37.773700, lng: 145.145187, store: 'Store 20', region: 'al ain'},
  {lat: -37.774785, lng: 145.137978, store: 'Store 21', region: 'al ain'},
  {lat: -37.819616, lng: 144.968119, store: 'Store 22', region: 'al ain'},
  {lat: -38.330766, lng: 144.695692, store: 'Store 23', region: 'al ain'}
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
  $('#store-list').append("<li data-index='" + value + "'><p>" + value + ' - ' + location.store + "</p><span>" + location.region +"</span></li>");
}

attachListClickEvent = function() {
  $('#store-list').on('mouseover', 'li', function(event) {
    var index = $(this).attr('data-index');
    map.panTo(markers[index].getPosition());
    map.setZoom(14);
    highlightListItem(index);
    // need to get the long and lat and then focus on the map from here.
  });

  $('#store-list').on('mouseout', 'li', function(event) {
    removeHightlight();
    // need to get the long and lat and then focus on the map from here.
  });
}
