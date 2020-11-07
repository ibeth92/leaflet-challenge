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

