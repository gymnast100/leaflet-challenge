// API key  for mapbox.com stored in a variable
const API_KEY = "pk.eyJ1IjoidmlkaHlhbWF0aGVycyIsImEiOiJjazN3N2IxM24wZjBhM2pwNmRqdWZsejY3In0._LzLMDIvp5b0zEb5c6tZuA"

// adding satellite tile layer for the map 
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
// adding  greyscale  tile layer for the map 
  var greyscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
// adding outdoors tile layer for the map
  var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

// function to add different colors to the circle marker corresponding to magnitude of earthquake
function getColor(d){

    // var color = "";
    if (d < 1) {
        color = "YELLOW";
    }
    else if (d < 2) {
        color = "BISQUE";
    }
    else if (d < 3 ) {
        color = "GOLD";
    }
    else if (d < 4 ) {
        color = "SANDYBROWN";
    }
    else if (d < 5 ) {
        color = "GOLDENROD";
    }
    else {
        color = "CHOCOLATE";
    }
return color};

// EARTHQUAKE MAGNITUDE LAYER ----------------------------------------
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// creating an array to hold all the circle markers that make up this overlay layer
var earthquakes = []
var latlng = []
  // Perform a GET request to the query URL
 d3.json(queryUrl, function(data) {console.log(data);
    
    data.features.forEach(feature => { 
        var lon = feature.geometry.coordinates[0]
        var lat  = feature.geometry.coordinates[1]
       
       earthquakes.push( L.circle([lat,lon], {
            fillOpacity: 0.75,
            color : getColor(feature.properties.mag ),
            fillColor: getColor(feature.properties.mag ),
            radius: feature.properties.mag  * 50000
        }).bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "<br> Earthquake Magnitude : "+ feature.properties.mag + "</p>").addTo(myMap),
       
       );
        
    });

});

//  FAULTLINES LAYER -------------------------------------------------------
//  creating an array to hold the faultlines information for this overlay layer 
var faultlines = []

var link = "static/data/PB2002_plates.json"
d3.json( link, function(data){
    data.features.forEach( feature => {

        var line = feature.geometry.coordinates;
        console.log(line)
        faultlines.push ( L.polyline (line, {
            color: "white",
            weight: 1,
            stroke: true
            
            }).addTo(myMap),
            // myMap.fitbound(line.getBounds())
        );
        // myMap.fitbound(polyline.getBounds())
    });

});

// console.log(faultlines)

//  creating the 2 overlay layers
var faultlinesLayer = L.layerGroup(faultlines);
var earthquakesLayer = L.layerGroup(earthquakes);

// Defining a baseMaps object to hold our base layers
var baseMaps = {
    "Satellite": satellite,
    "Greysacle": greyscale,
    "Outdoors": outdoors
  };
// Defining a overlayMaps object to hold our overlay layers
  var overlayMaps = {
    Earthquakes : earthquakesLayer,
    Faultlines: faultlinesLayer,
  };
//  creating map object
var myMap = L.map("map", {
    center: [
      21.94, -79.23
    ],
    zoom: 2.5 ,
    layers: [satellite,earthquakesLayer,faultlinesLayer]
  });
//  creating control for the layers
L.control.layers(baseMaps, overlayMaps,{
    collapsed : false 
}).addTo(myMap);
 
//  adding a legend to the map object
var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = [],
    categories = [0,1,2,3,4,5];

    
    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push(
                '<i style=background:' + getColor(categories[i]) + '></i> ' +
            categories[i]+ (categories[i+1] ? "&ndash;" + categories[i+1]+"<br>":"+"));

        }
        div.innerHTML = labels.join("");
    return div;
    };
    legend.addTo(myMap);
    
  
    