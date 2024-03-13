// Function to create the map
function createMap(earthquakeHeat) {
    // Create the map object with options.
    let map = L.map("map", {
        center: [38.84, -122.84], // Adjusted latitude value
        zoom: 5, // Adjusted initial zoom level
        layers: [earthquakeHeat]
    });

    // Create a tile layer for the base map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Add the street map to the map.
    streetmap.addTo(map);

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(null, { "Earthquakes": earthquakeHeat }, {
        collapsed: false
    }).addTo(map);
}

// Function to create the heatmap layer
function createHeatMap(data) {
    // Initialize an array to hold earthquake coordinates with magnitudes and depths.
    let earthquakeCoordinates = [];

    // Loop through the earthquakes array.
    data.features.forEach(earthquake => {
        let geometry = earthquake.geometry;
        let properties = earthquake.properties;

        // Get the coordinates, magnitude, and depth of each earthquake.
        let lat = geometry.coordinates[1];
        let lng = geometry.coordinates[0];
        let mag = properties.mag;
        let depth = geometry.coordinates[2];

        // Create a color based on the depth of the earthquake.
        let color = "";
        if (depth < 10) {
            color = "#00FF00"; // Green
        } else if (depth < 30) {
            color = "#FFFF00"; // Yellow
        } else if (depth < 50) {
            color = "#FFA500"; // Orange
        } else {
            color = "#FF0000"; // Red
        }

        // Add the coordinates to the array with magnitude as weight.
        earthquakeCoordinates.push([lat, lng, mag, color]);
    });

    // Create custom markers based on earthquake data.
    let earthquakeHeat = L.layerGroup();
    earthquakeCoordinates.forEach(earthquake => {
        let circle = L.circleMarker([earthquake[0], earthquake[1]], {
            radius: earthquake[2] * 5, // Adjust the multiplier for size
            color: earthquake[3],
            fillOpacity: 0.7
        }).bindPopup("<h3>Magnitude: " + earthquake[2] + "</h3><h3>Depth: " + earthquake[1] + " km</h3>");

        // Add the marker to the map.
        circle.addTo(earthquakeHeat);
    });

    // Create the map with the custom markers.
    createMap(earthquakeHeat);
}

// Perform an API call to the USGS Earthquake API to get the earthquake information using d3.json.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url)
    .then(createHeatMap)
    .catch(error => console.error("Error fetching earthquake data:", error));


