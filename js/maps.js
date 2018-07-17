
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
    var marker = new google.maps.Marker({
      map: map,
      title: locations[i].title,
      position: locations[i].location,
      show: ko.observable(locations[i].show),
      animation: google.maps.Animation.DROP,
      zomatoId: locations[i].zomid,
      selected: locations[i].selected
    });

    self.placeMarkers.push(marker);


    marker.addListener('click', function() {
      for (var i = 0; i < self.placeMarkers.length; i++) {
        self.placeMarkers[i].setAnimation(null);
      }
      toggleBounce(this);
    });

    // Create an onclick event to open an infowindow at each marker
    marker.addListener('click', function(){
      self.populateInfoWindow(this, largeInfoWindow);
    });
  };

  // Animate marker when selected
  function toggleBounce(ele) {
    if (ele.getAnimation() !== null) {
      ele.setAnimation(null);
    } else {
      ele.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ marker.setAnimation(null); }, 750);
    }
  }

  //This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position
  //
  self.populateInfoWindow = function(marker, infowindow){
    // Check to make sure the infowindow is not already open on this marker
      // Ajax request from Zomato
      $.ajax({
        url: "https://developers.zomato.com/api/v2.1/reviews?res_id=" + marker.zomatoId,
        dataType: 'json',
        async: true,
        beforeSend: function(xhr){xhr.setRequestHeader('user-key', 'b89e6ac3af9aa9810070ab995f44111c');},
        success: function( response ) {
          var reviews = response.user_reviews;

          var contentString = '<div> <h3 class="venue-name">' + marker.title + ' reviews</h2>';

           for (var i = 0; i < 3; i++){
             contentString = contentString + '<div class="infowindow-data">';
              contentString = contentString + '<h6>User: ' + reviews[i].review.user.name + '</h4>';
              contentString = contentString + '<p>Rating: ' + reviews[i].review.rating + '</p>';
            contentString = contentString + '<div>';
           };
           contentString = contentString + '</div>';
          infowindow.setContent(contentString);
        },

        // warn if there is error in recievng json
        error: function(e) {
            self.errorDisplay("Hmm! Looks like Zomato isn't available right now.");
            contentString = "<div><p>Hmm! Looks like Zomato isn't available right now.</p></div>"
        }
      });
      $.ajax({
        url: "https://developers.zomato.com/api/v2.1/restaurant?res_id=" + marker.zomatoId,
        dataType: 'json',
        // async: true,
        beforeSend: function(xhr){xhr.setRequestHeader('user-key', 'b89e6ac3af9aa9810070ab995f44111c');},
        success: function( response ) {
          var average = response.user_rating.aggregate_rating;
          console.log(average);
          // $('<div><p>The average rating is ' + average + '</p></div>').insertAfter($('.venue-name'));
          $( '.venue-name' ).append('<div><p>The average rating is ' + average + '</p></div>');

        },
        // warn if there is error in recievng json
        error: function(e) {
            self.errorDisplay("Hmm! Looks like Zomato isn't available right now.");
            contentString = "<div><p>Hmm! Looks like Zomato isn't available right now.</p></div>"
        }
      });

      //infowindow.setContent('<iframe href="' + $.ajax(). + '"></iframe>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed
      infowindow.addListener('closeClick', function(){
        infowindow.setMarker(null);
      });
    // }
  }

  //function to add information about API to the markers
  var addMarkerInfo = function(marker) {
    infowindow.clear();
    //add API items to each marker
    self.populateInfoWindow(marker);

    //add the click event listener to marker
    marker.addListener('click', function() {
        //set this marker to the selected state

        self.setSelected(marker);
    });
  };

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
      // infowindow.close();

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
  };



  self.currentLocation = self.placeMarkers[0];
  // Open infowindow from clicking on list item.
  self.setSelected = function(location) {
    self.currentLocation = location;
    location = true;
    self.populateInfoWindow(this, largeInfoWindow);
  };

  self.filterList();
};

function initMap() {
       // Constructor creates a new map - only center and zoom are required.
       map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: -32.04199, lng: 115.7507386},
         zoom: 13,
         styles: styles,
         mapTypeControl: false
       });
     ko.applyBindings(new viewModel());
}
// b89e6ac3af9aa9810070ab995f44111c
