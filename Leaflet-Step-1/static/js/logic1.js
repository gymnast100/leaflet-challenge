// storing API key for mapbox.com 
const API_KEY = "pk.eyJ1IjoidmlkaHlhbWF0aGVycyIsImEiOiJjazN3N2IxM24wZjBhM2pwNmRqdWZsejY3In0._LzLMDIvp5b0zEb5c6tZuA"

// creating the map object
var myMap = L.map("map", {
    center: [
      21.94, -79.23
    ],
    zoom: 2.5 ,
  });
//   creating the baselayer for the map 
var greyscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }).addTo(myMap);


 // function to add different colors to the circle marker corresponding to magnitude of earthquake
function getColor(d){

    // var color = "";
    if (d < 1) {
        color = "DARKKHAKI";
    }
    else if (d < 2) {
        color = "YELLOW";
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


// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  // Perform a GET request to the query URL
 d3.json(queryUrl, function(data) {console.log(data);
    // iterating through each item in the geojson object to get latitude and longitude
    data.features.forEach(feature => { 
        var lon = feature.geometry.coordinates[0]
        var lat  = feature.geometry.coordinates[1]
        //  adding circle marker whose radius corresponds to the earthquake magnitude and adding a popup with earthquake information
        L.circle([lat,lon], {
            fillOpacity: 0.9,
            color : "grey",
            weight : 0.5,
            fillColor: getColor(feature.properties.mag ),
            radius: (feature.properties.mag)* 50000
        }).bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "<br> Earthquake Magnitude : "+ feature.properties.mag + "</p>").addTo(myMap);
        
        
    });

});

//  adding legend to the map object
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
    
    