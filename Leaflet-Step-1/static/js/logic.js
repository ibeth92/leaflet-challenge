// Our JSON link to the info of the previous week's Earthquakes 
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geoson";

// Create markers and adjust size and color using the magnitude of earthquake data 
function markerSize(mag) {
    return mag * 25000;
}
// Get marker colors
function markerColor(mag) {
    if (mag <= 1) {
        return "ADFF2F";
    }
    else if (mag <= 2) {
        return "#9ACD32";
    }
    else if (mag <= 3) {
        return "#FFF00";
    }
    else if (mag <= 4) {
        return "#ffd700"
    }
    else if (mag <= 5){
        return "#FFA500";
    }
    else {
        return "#FF0000";
    };
}
// Read in JSON data to create the basemap
d3.json(link, function(data) {
    createFeatures(data.features);
});

function createFeatures(ourData) {
// Read in earthquake data from our json
    let earthquakes = L.geoJSON(ourData, {
    onEachFeature : function (feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + newDate(feature.properties.time) + "</p>" + "<p> Mag.: " + feature.properties.mag + "</p>")  )
        },
            pointToLayer: function (feature, latlng){
            return new L.circle(latlng,
            {radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.properties.mag),
            fillOpacity: 1,
            stroke: false,
        })
}
});

    createMap(earthquakes);
}

// Create additional map layers and add backgrounds to maps
// Maps pulled form Leaflet plugin site

function createMap(earthquakes) {
    let satmap = L.titleLayer("https://api.mapbox.com/styles/v1{id}/titles/{z}/{x}/{y}?access_token={accessToken}",{
        tileSize: 512
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });
    let darkmap = L.titleLayer("https://titles.stadiamaps.com/tiles/aliade_smooth_dark/{z}/{x}/{y}{r}.png",{
        maxZoom: 18,
        id: "dark-v10",
        acessToken: API_KEY
});

let baseMaps = {
    "Sattelite Map": satmap,
    "Dark Map": darkmap
};
let overlayMaps = {
    Earthquakes: earthquakes
};
// Connecting our basemap to the HTML page
// Generate both layers
let myMap= L.map("mapid", {
    center: [30,-100],
    zoom: 3,
    layers: [stamp, earthquakes]
});
// Add control panel 
L.control.layers(baseMaps, overlayMaps,{
    collapsed: false
})addTo(myMap);
// Add legend
let legend = L.control({position: 'topright'});
// Make sure you can switch between Dom and MAps
// Generate backgrounds when clicked
// Make sure legend works when clicked
// Make sure earthquake layer can be turned on/off

legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [];
    for (let i = 0; i< magnitudes.length; i++) {
        div.innerHTML += '<i style="background:' + markerColor(magnitudes[i] + 1) + "<>/i" +
        + magnitudes[i] + (magnitudes[i + 1] ? '-' + magnitudes[i + 1] + '<br>' : '+');
    }
    return div;
};
    legend.addTo(myMap);
// Creating colorful legend layer
let colorfulLegend = L.control({position: 'bottomright'});
// Generate colors and set magnitude grades
colorfulLegend.onAdd = function(){
    let div = L.DomUtil.create("div", "info legend");
    let colors = [
        '#b7f34d',
        '#e1f34d',
        '#f3db4d',
        '#f3ba4d',
        '#f0a76b',
        '#f06b6b'
    ];
// Loop through "i" in grades to set grades 
    for (let i = 0; i < grades.length; i++){
        div.innerHTML += "<li style='background:" + colors[i] + "'></li>" + //<li></li> for list items
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] : "+");
    }
    return div;
};
colorfulLegend.addTo(myMap);
}

