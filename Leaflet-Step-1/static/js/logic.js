// Our JSON link to the info of the previous week's Earthquakes 
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geoson";

// Create markers and adjust size and color using the magnitude of earthquake data 
// Get marker colors 
function getColor(depth) {
    if (depth <= 10) {
        return 'green'
    }
    if (depth <= 30) {
        return 'yelllow'
    }
    if (depth <= 50) {
        return 'blue'
    }
    if (depth <= 70) {
        return 'orange'
    }
    if (depth <= 90) {
        return 'red'
    }
    if (depth > 90) {
        return 'pink'
    }
}

// Read in JSON data to create the basemap
d3.json(queryUrl, function (data) {
    createFeatures(data.features);
});

//Create function to run on certain features
// Read in earthquake data from our json
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) +
            "</h3><hr><p>" + "Magnitude: " + feature.properties.mag +
            "</h3><hr><p>" + "Depth: " + feature.geometry.coordinates[2] + "</p>");
    }
    console.log(earthquakeData);

    function pointToLayer(feature, latlng) {
        let circle = L.circleMarker(latlng, {
            fillOpacity: 1,
            radius: feature.properties.mag * 3,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: 'darkgreen'
        });
        return circle
    }
// Create a GeoJSON layer 
// Run the onEachFeature function 
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });
    // Send the earthquakes layer to the createMap function
    createMap(earthquakes);
}
// Create additional map layers and add backgrounds to maps
// Maps pulled form Leaflet plugin site
function createMap(earthquakes) {
    let stmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    let ltmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    let darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        zoomOffset: -1,
        id: "dark-v10",
        accessToken: API_KEY
    });
// Definie baseMaps to hold our base layers
    let baseMaps = {
        "Street Map": stmap,
        "Light Map": ltmap,
        "Dark Map": darkmap
    };

// Create overlay object to hold our overlay layer
    let overlayMaps = {
        Earthquakes: earthquakes

    };
// Connecting our basemap to the HTML page
// Generate all three layers
let myMap = L.map("mapid", {
    center: [ 37.09, -95.71],
    zoom: 3,
    layers: [stmap, earthquakes]
});

// Add control panel layer to map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Add the legend to map
let legend = L.control({ position: 'topright' });
legend.onAdd = function (map) {
// Make sure you can switch between Dom and Maps
// Generate background and legend work when clicked
// Make sure earthquake layer can be turned on and off
let div = L.DomUtil.create('div', 'info legend'),
    magnitudes = [];
for (let i = 0; i< magnitudes.length; i++) {
    div.innerHTML += '<i style="background:' + markerColor(magnitudes[i] + 1) + "<>/i" +
    + magnitudes[i] + (magnitudes[i + 1] ? '-' + magnitudes[i + 1] + '<br>' : '+');
}
return div;
};
legend.addTo(myMap);
// Creating legend layer to match with color keys
let customLegend = L.control({position: 'bottomright'});

// Generate colors and set magnitude grades
customLegend.onAdd = function(){
    let div = L.DomUtil.create("div", "info legend");
    let colors = [
        'green',
        'yellow',
        'blue',
        'orange',
        'red',
        'pink'
    ];
// Loop through "i" in grades to set grades 
    for (let i = 0; i < grades.length; i++){
        div.innerHTML += "<li style='background:" + colors[i] + "'></li>" + //<li></li> for list items
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] : "+");
    }
    return div;
    };
    
    customLegend.addTo(myMap);
    }