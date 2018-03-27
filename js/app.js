// declaring global variables
var map;
var infoWindow;
var bounds;

/* Location Model */ 
var LocationMarker = function(data) {

  var self = this;

  infoWindow = new google.maps.InfoWindow();

  var milktea = "images/BubbleTea.svg";
  var tarotea = "images/TaroBubbleTea.svg";

  self.marker = new google.maps.Marker({
    position: new google.maps.LatLng(data.location.lat, data.location.lng),
    map: map,
    title: data.name.replace(/[^&a-z0-9 \-]/gi,''), //regex to replace characters
    animation: google.maps.Animation.DROP,
    icon: milktea,
    url: data.url,
    custom1: data.location.address,
    custom2: data.location.formattedAddress[1],
    phone: data.contact.formattedPhone 
  });

  //show item info when selected from list
  LocationMarker.prototype.show = function() {
    google.maps.event.trigger(self.marker, 'click');
  };

  // bounces when selected
  this.bounce = function() {
    google.maps.event.trigger(self.marker, 'click');
  };

  // infowindow for marker is opened up when clicked
  self.marker.addListener('click', function(){

    // close other infowindows
    infoWindow.close();

    // content of infowindow
    var contentString = '<div class="info-window-content"><div class="title"><b>' + data.name.replace(/[^&a-z0-9 \-]/gi,'') + "</b></div>" + 
    (self.marker.url === undefined ? "" : '<div class="content"><a target="_blank" href="' + self.marker.url +'">' + self.marker.url + "</a></div>") +
    '<div class="content">' + self.marker.custom1 + "</div>" +
    '<div class="content">' + self.marker.custom2 + "</div>" +
    (data.contact.formattedPhone === undefined ? "" : '<div class="content"><a href="tel:' + self.marker.phone +'">' + self.marker.phone + "</a></div>") + "</div>";
    
    infoWindow.setContent(contentString);
    infoWindow.open(map, this);

    map.panTo(self.marker.position);
    map.setZoom(14);
    
    self.marker.setIcon(tarotea);

    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      self.marker.setAnimation(null);
    }, 2000);
  });
};

// Error handling if map doesn't load.
function errorHandlingMap() {
  $('#map').html('There was a problem loading Google Maps. Please reload the webpage.');
}

function startApp() {
  gen_map();
}

//toggle side
$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
    if ($(window).width() < 769) {
      $('#page-title').toggleClass('invisible');
    }
  });
});

