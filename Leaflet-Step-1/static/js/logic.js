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

