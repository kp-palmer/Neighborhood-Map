const gen_map = function() {

  bounds = new google.maps.LatLngBounds();

  var self = this;  

  // creates a new map with center, zoom, and styles
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7238, lng: -73.9950},
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

  // empty array, will later be filled with the data we need 
  bubbles = [];

  var request = 'https://api.foursquare.com/v2/venues/search?categoryId=52e81612bcbc57f1066b7a0c&near=%22new%20york,%20ny%22&limit=10&oauth_token=WYTHP3W2NNIVZQMKXB3UHEQV2K0BDMREDSL2JFZXQL1FLY0A&v=20180204';

  $.getJSON(request).done(function(data) {
    var results = data.response.venues;

    //sorts bubble tea shops alphabetically 
    results.sort(function(a,b){
      if(a.name == b.name) return 0;
      return (a.name < b.name) ? -1 : 1;
    });

    // pushed each of the results into bubbles array
    $.each(results, function(i, field){
      bubbles.push(new LocationMarker(field));
    });

    //tucked within getjson to address async load
    function ViewModel(bubblez){
      self = this;
      self.query = ko.observable('');
      self.bubbles = ko.dependentObservable(function() {

        //close any open infowindows
        infoWindow.close();

        var search = this.query().toLowerCase();
        
        return ko.utils.arrayFilter(bubblez, function(bubble) {
          zz = bubble.marker.title.toLowerCase().indexOf(search) >= 0;
          bubble.marker.setMap(zz === true ? map : null);
          return zz; 
        });
      }, self);
    
      self.ta_da = function() {
        for (var i = bubbles.length - 1; i >= 0; i--) {
         bubbles[i] = setIcon('../images/BubbleTea.svg');
         bubbles[i].setAnimation(null);
       }

       google.maps.event.trigger(this.marker, 'click');
       
       map.panTo(this.marker.position);
       map.setZoom(14);

       if ( $(window).width() < 768 ) {
          $('#sidebar').toggleClass('active') ;
       }
      };
    }

    ko.applyBindings(ViewModel(bubbles));

  }).fail(function() {
    alert('Something went wrong with foursquare');
  });  
};