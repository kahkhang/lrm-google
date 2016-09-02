var GoogleMapsAPI = require('googlemaps');

var publicConfig = {
  key: 'AIzaSyBzZr6EP9bOB9YuBRS8sFDzFJiHCyOaCME',
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true, // use https
};
var gmAPI = new GoogleMapsAPI(publicConfig);

// geocode API
var geocodeParams = {
  "address":    "121, Curtain Road, EC2A 3AD, London UK",
  "components": "components=country:GB",
  "bounds":     "55,-1|54,1",
  "language":   "en",
  "region":     "uk"
};

gmAPI.geocode(geocodeParams, function(err, result){
  console.log(result);
});

// reverse geocode API
var reverseGeocodeParams = {
  "latlng":        "51.1245,-0.0523",
  "result_type":   "postal_code",
  "language":      "en",
  "location_type": "APPROXIMATE"
};

gmAPI.reverseGeocode(reverseGeocodeParams, function(err, result){
  console.log(result);
});

var params = {
    origin: 'New York, NY, US',
    destination: 'Los Angeles, CA, US'
  };

gmAPI.directions(params, function(err, result){
    console.log(result);
});

/*
      gm.directions({
        origin: 'Boston, MA, USA',
        destination: 'Concord, MA, USA',
        mode: 'driving',
        waypoints: 'optimize:true|via:Charlestown,MA|Lexington,MA'
      }, this.callback);
*/