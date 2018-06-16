var locations = [
    {title: 'Run Amuk', location: {lat: -32.0722797, lng: 115.7531305}, show: true, zomid: '16601583'},
    {title: 'Common Ground', location: {lat: -32.0546596, lng: 115.7454984}, show: true, zomid: '16601583'},
    {title: 'Bread in Common', location: {lat: -32.0562259, lng: 115.745232}, show: true, zomid: '16601583'},
    {title: 'Creatures Nextdoor', location: {lat: -32.0588735, lng: 115.743792}, show: true, zomid: '16601583'},
    {title: 'Young George', location: {lat: -32.043963, lng: 115.76014}, show: true, zomid: '16601583'}
];
console.log(locations[2].zomid);
//global map variable
var map;

// self global polygon variable is to ensure only ONE polygon is rendered.
//var polygon = null;

var viewModel = function() {
  var self = this;


  self.errorDisplay = ko.observable('');
  // Create a new blank array for all the listing markers.
  self.placeMarkers = [];

  var largeInfoWindow = new google.maps.InfoWindow();
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var zomatoId = locations[i].zomid;
    console.log(zomatoId);
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: locations[i].title,
      zomato: locations[i].zomid,
      show: ko.observable(locations[i].show),
      animation: google.maps.Animation.DROP,
      // info: info
    });
    self.placeMarkers.push(marker);
    console.log(marker.zomato);
    // Create an onclick event to open an infowindow at each marker
    marker.addListener('click', function(){
      self.populateInfoWindow(this, largeInfoWindow);
      });

  };

  //This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position
  self.populateInfoWindow = function(marker, infowindow){
    // Check to make sure the infowindow is not already open on this marker
    if(infowindow.marker != marker) {
      infowindow.marker = marker;



      // infowindow.setContent('<div>' + marker.title + '</div>' + '<iframe href="https://developers.zomato.com/api/v2.1/reviews?res_id=16601583"></iframe>');
      // infowindow.setContent('<div>' + marker.title + '</div>' + '<iframe href="' + self.marker.info + '"></iframe>');

      $.ajax({
        url: "https://developers.zomato.com/api/v2.1/reviews?res_id=" + marker.zomato,
        dataType: 'json',
        async: true,
        beforeSend: function(xhr){xhr.setRequestHeader('user-key', 'b89e6ac3af9aa9810070ab995f44111c');},  // This inserts the api key into the HTTP header
        success: function( response ) {
          console.log(response);
          console.log(response.user_reviews);
          var reviews = response.user_reviews;

          var contentString = '<div> <h2>' + marker.title + ' reviews</h2>';

          //infowindow.setContent('<iframe href="' + $.ajax(). + '"></iframe>');
          //infowindow.append('<h4>Username: ' + reviews[i].review.user.name + '</h4>');
           for (var i = 0; i < reviews.length; i++){
             contentString = contentString + '<div>';
              contentString = contentString + '<h4>User: ' + reviews[i].review.user.name + '</h4>';
              contentString = contentString + '<p>Rating: ' + reviews[i].review.rating + '</p>';
              contentString = contentString + '<p>Review: ' + reviews[i].review.review_text + '</p>';
            contentString = contentString + '<div>';
             console.log(reviews[i].review.user);

           };
           contentString = contentString + '</div>';
          infowindow.setContent(contentString);
        }
      });

      //infowindow.setContent('<iframe href="' + $.ajax(). + '"></iframe>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed
      infowindow.addListener('closeClick', function(){
        infowindow.setMarker(null);
      });
    }
  }

  // create a searchText for the input search field
  self.searchText = ko.observable('');

  // to show all the markers
  self.setAllShow = function(marker) {
     for (var i = 0; i < self.placeMarkers.length; i++) {
         self.placeMarkers[i].show(marker);
         self.placeMarkers[i].setVisible(marker);
     }
   };

  self.filterList = function() {

      //variable for search text
      var currentText = self.searchText();
      //infowindow.close();

      //list for user search
      if (currentText.length === 0) {
          self.setAllShow(true);
      } else {
          for (var i = 0; i < self.placeMarkers.length; i++) {
            console.log(self.placeMarkers[i].show());
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
  };

  self.filterList();

   // // Style the markers a bit. self will be our listing marker icon.
   // var defaultIcon = makeMarkerIcon('0091ff');
   // // Create a "highlighted location" marker color for when the user
   // // mouses over the marker.
   // var highlightedIcon = makeMarkerIcon('FFFF24');
   //
   //   // Two event listeners - one for mouseover, one for mouseout,
   //   // to change the colors back and forth.
   //   marker.addListener('mouseover', function() {
   //     self.setIcon(highlightedIcon);
   //   });
   //   marker.addListener('mouseout', function() {
   //     self.setIcon(defaultIcon);
   //   });


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
// b89e6ac3af9aa9810070ab995f44111c
