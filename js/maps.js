var locations = [
    {title: 'Run Amuk', location: {lat: -32.0722797, lng: 115.7531305}, show: true},
    {title: 'Common Ground', location: {lat: -32.0546596, lng: 115.7454984}, show: true},
    {title: 'Bread in Common', location: {lat: -32.0562259, lng: 115.745232}, show: true, show: true, show: true},
    {title: 'Creatures Nextdoor', location: {lat: -32.0588735, lng: 115.743792}, show: true, show: true},
    {title: 'Young George', location: {lat: -32.043963, lng: 115.76014}, show: true},
    //{title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

//global map variable
var map;

// self global polygon variable is to ensure only ONE polygon is rendered.
//var polygon = null;

// Create placemarkers array to use in multiple functions to have control
//over the number of places that show.
//var placeMarkers = [];

var viewModel = function() {
  var self = this;

  // Create a new blank array for all the listing markers.
  self.errorDisplay = ko.observable('');
  self.placeMarkers = [];

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    //var title = locations[i].title;
    var position = locations[i].location;

    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: locations[i].title,
      id: i,
      show: ko.observable(locations[i].show),
      animation: google.maps.Animation.DROP
    });
    //console.log(marker);

    self.placeMarkers.push(marker);
  };

  // create a searchText for the input search field
  self.searchText = ko.observable('');

  self.filterList = function() {
      //variable for search text
      var currentText = self.searchText();
      //infowindow.close();

      //list for user search
      if (currentText.length === 0) {
          self.setAllShow(true);
      } else {
          for (var i = 0; i < self.placeMarkers.length; i++) {
              // to check whether the searchText is there in the placeMarkers
              if (self.placeMarkers[i].title.toLowerCase().indexOf(currentText.toLowerCase()) > -1) {
                  self.placeMarkers[i].show(true);
                  self.placeMarkers[i].setVisible(true);

              } else {
                  self.placeMarkers[i].show(false);
                  self.placeMarkers[i].setVisible(false);
              }
          }
      }
      //infowindow.close();
      self.placeMarkers[i].setVisible(true);
  };


   // to show all the markers
   self.setAllShow = function(marker) {
      for (var i = 0; i < self.placeMarkers.length; i++) {
          self.placeMarkers[i].show(marker);
          self.placeMarkers[i].setVisible(marker);
      }
    };

   // Style the markers a bit. self will be our listing marker icon.
   var defaultIcon = makeMarkerIcon('0091ff');
   // Create a "highlighted location" marker color for when the user
   // mouses over the marker.
   var highlightedIcon = makeMarkerIcon('FFFF24');

     // Two event listeners - one for mouseover, one for mouseout,
     // to change the colors back and forth.
     marker.addListener('mouseover', function() {
       self.setIcon(highlightedIcon);
     });
     marker.addListener('mouseout', function() {
       self.setIcon(defaultIcon);
     });


   function makeMarkerIcon(markerColor) {
     var markerImage = new google.maps.MarkerImage(
       'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
       '|40|_|%E2%80%A2',
       new google.maps.Size(21, 34),
       new google.maps.Point(0, 0),
       new google.maps.Point(10, 34),
       new google.maps.Size(21,34));
     return markerImage;
   }
};

     function initMap() {

             // Constructor creates a new map - only center and zoom are required.
             map = new google.maps.Map(document.getElementById('map'), {
               center: {lat: -32.0501672, lng: 115.7587907},
               zoom: 13,
               styles: styles,
               mapTypeControl: false
             });
           ko.applyBindings(new viewModel());
     }
