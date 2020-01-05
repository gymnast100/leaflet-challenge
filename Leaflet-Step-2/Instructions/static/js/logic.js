const API_KEY = "pk.eyJ1IjoidmlkaHlhbWF0aGVycyIsImEiOiJjazN3N2IxM24wZjBhM2pwNmRqdWZsejY3In0._LzLMDIvp5b0zEb5c6tZuA"

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {  console.log(data);

  // Once we get a response, send the data.features object to the createFeatures function
   createFeatures(data.features);
});

function getColor(d){

  // var color = "";
  if (d < 1) {
      color = "yellow";
  }
  else if (d < 2) {
      color = "green";
  }
  else if (d < 3 ) {
      color = "cyan";
  }
  else if (d < 4 ) {
      color = "purple";
  }
  else if (d < 5 ) {
      color = "brown";
  }
  else {
      color = "red";
  }
return color};


function createFeatures(earthquakeData) {

//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the place and time of the earthquake
//   function onEachFeature(feature, layer) {
//    layer.bindPopup("<h3>" + feature.properties.place +
//       "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//   }

//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   var earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature, 
//  });

    var earthquakes = []
     earthquakeData.forEach(feature => { 
          var lon = feature.geometry.coordinates[0]
          var lat  = feature.geometry.coordinates[1]

         earthquakes.push( L.circle([lat,lon], {
              fillOpacity: 0.75,
              color : getColor(feature.properties.mag ),
              fillColor: getColor(feature.properties.mag ),
              radius: feature.properties.mag * 50000
          }).bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
         )    
        });

        console.log(earthquakes)



  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}



function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      51.50, -0.11
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend');
  labels = ['<strong>Magnitudes</strong>'],
  categories = [0,1,2,3,4,5];

  
  for (var i = 0; i < categories.length; i++) {

          div.innerHTML += 
          labels.push(
              '<i style="background:' + getColor(categories[i]) + '"></i> ' +
          categories[i]+ (categories[i+1] ? "&ndash;" + categories[i+1]+"<br>" : '+'));

      }
      div.innerHTML = labels.join('<br>');
  return div;
  };
  legend.addTo(myMap);


}
