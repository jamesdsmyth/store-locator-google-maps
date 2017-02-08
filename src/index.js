var locations = [
  {lat: 25.02837276, lng: 55.10192871, mall: 'Mall of the Emirates', region: 'Dubai'},
  {lat: 25.03708281, lng: 55.11978149, mall: 'Oasis Mall', region: 'Dubai'},
  {lat: 25.03708281, lng: 55.1651001, mall: 'Dubai Mall', region: 'Dubai'},
  {lat: 25.00721721, lng: 55.29693604, mall: 'BurJuman', region: 'Dubai'},
  {lat: 25.01219532, lng: 54.98519897, mall: 'City Centre Deira', region: 'Dubai'},
  {lat: 25.15522939, lng: 55.21728516, mall: 'Festival City Mall', region: 'Dubai'},
  {lat: 25.16144447, lng: 55.24475098, mall: 'Ibn Battuta Mall', region: 'Dubai'},
  {lat: 25.21363863, lng: 55.33126831, mall: 'Mercato Shopping Mall', region: 'Dubai'},
  {lat: 25.15647244, lng: 55.45074463, mall: 'Wafi Mall', region: 'Dubai'},
  {lat: 25.27698715, lng: 55.32852173, mall: 'Dragon Mart', region: 'Dubai'},
  {lat: 25.29312953, lng: 55.37384033, mall: 'Dubai Outlet Mall', region: 'Abu Dhabi'},
  {lat: 25.34030262, lng: 55.43426514, mall: 'Grand Shopping Mall', region: 'Abu Dhabi'}
]

var map;
var markers = [];
var markerCluster;
var listCreated = false;
var selectedLocations = locations;


function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {
      lat: 25.21363863,
      lng: 55.27496338
    }
  });

  createMarkers();
  createList();
  attachListClickEvent();
  hideMapInfoClick();
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
      selectListItem(this.id);

      panTo(this.id - 1);
      showMapInfo((this.id - 1));
    });

    google.maps.event.addListener(marker, 'mouseover', function() {
        highlightListItem(this.label);
    });

    google.maps.event.addListener(marker, 'mouseout', function() {
      removeHightlight();
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
}

removeHightlight = function() {
  $('#store-list li').removeClass('highlight');
}

selectListItem = function(index) {
  removeSelect();
  $('#store-list li').eq((index - 1)).addClass('selected');
}

removeSelect = function() {
  $('#store-list li').removeClass('selected');
}

initSearch = function() {
  window.addEventListener('input', function (e) {
    search(e.target.value);
  }, false);
}

search = function(value) {
  document.getElementById('store-list').innerHTML = '';
  removeHightlight();
  hideMapInfo();

  // clearing the marker list serch
  selectedLocations = [];

  var b = 1;
  var loweredValue = value.toLowerCase();

  // looping through each
  for(var i = 0; i < locations.length; i++) {

    var location = locations[i];
    var loweredMall = location.mall.toLowerCase();
    var loweredRegion = location.region.toLowerCase();

    if((loweredMall.indexOf(loweredValue) > -1) || (loweredRegion.indexOf(loweredValue) > -1)) {
      createListItem(location, b);
      selectedLocations.push(location);

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
  $('#store-list').append("<li data-index='" + value + "'><p>" + value + ' - ' + location.mall + "</p><span>" + location.region +"</span></li>");
}

attachListClickEvent = function() {
  $('#store-list').on('mouseover', 'li', function(event) {
    var index = $(this).attr('data-index');
    var newIndex = parseInt(index) - 1;

    if($('.selected').length === 0) {
      panTo(newIndex);
      map.setZoom(map.getZoom());
    }

    highlightListItem(index);
  });

  $('#store-list').on('mouseout', 'li', function(event) {
    removeHightlight();
  });

  $('#store-list').on('click', 'li', function(event) {
    var index = $(this).attr('data-index');
    var newIndex = parseInt(index) - 1;

    panTo(newIndex);
    // map.setZoom(map.getZoom());
    map.setZoom(14);

    selectListItem(index);
    showMapInfo(newIndex);
  });
}

panTo = function(index) {
  map.panTo(markers[index].getPosition());
}

hideMapInfoClick = function() {
  $('.close-map-info').click(function() {
    hideMapInfo();
  })
}

showMapInfo = function(index) {
  var location = locations[index];
  $('.mall').html(location.mall);
  $('.region').html(location.region);
  $('#map-info').removeClass('hidden');
}

hideMapInfo = function() {
  $('#map-info').addClass('hidden');
  removeSelect();
}
