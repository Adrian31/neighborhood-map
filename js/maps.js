console.log("hi");
//global for map
var map;
      // Create a new blank array for all the listing markers.
      var markers = [];
      // This global polygon variable is to ensure only ONE polygon is rendered.
      var polygon = null;

      // Create placemarkers array to use in multiple functions to have control
      //over the number of places that show.
      var placeMarkers = [];
      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -32.0500833, lng: 115.7730709},
          zoom: 13,
          styles: styles,
          mapTypeControl: false
        });

      // Style the markers a bit. This will be our listing marker icon.
      var defaultIcon = makeMarkerIcon('0091ff');
      // Create a "highlighted location" marker color for when the user
      // mouses over the marker.
      var highlightedIcon = makeMarkerIcon('FFFF24');
      // The following group uses the location array to create an array of markers on initialize.
      for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
          icon: defaultIcon,
          id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);

        map.fitBounds(bounds);
      }
}
