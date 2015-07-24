 var geocoder;
 
    $(document).ready(function() {
        // alert("geolocation.js");
      geocoder = new google.maps.Geocoder();                   
    });
    function getLocation(){
        navigator.geolocation.getCurrentPosition(onGetCurrentPositionSuccess, onGetCurrentPositionError);
       // alert("geolocation");
      }               
    var onGetCurrentPositionSuccess = function(position) {
        var cityFound=false;
        var countryFound=false;
      var lat = parseFloat(position.coords.latitude);
      var lng = parseFloat(position.coords.longitude);                        
      var latlng = new google.maps.LatLng(lat, lng);
                        
      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            //alert(JSON.stringify(results));
          if (results[0]) {
            var arrAddress = results[0].address_components;
            // iterate through address_component array
            $.each(arrAddress, function (i, address_component) {
              if (address_component.types[0] == "locality") {
              //  alert("city "+address_component.long_name); // city
                city = address_component.long_name;
                console.log("city:   "+city);
              }
                if (address_component.types[0] == "country") {
                //alert("country "+address_component.long_name); // country
                country = address_component.long_name;
                  console.log("country:   "+country);
              }
                if(cityFound && countryFound){
                    return false //break
                }
            });
          } else {
            alert("No results found");
          }
        } else {
          alert("Geocoder failed due to: " + status);
        }
      });
    }
  
    var onGetCurrentPositionError = function(error) { 
      alert("Couldn't get geo coords from device");
    } 