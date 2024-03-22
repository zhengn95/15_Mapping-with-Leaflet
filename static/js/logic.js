// Function to create the map
async function createMap(earthquakeMap) {
    let tectonicPlates = new L.layerGroup() 
    let tectonicUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

    await d3.json(tectonicUrl).then(plates => {
        L.geoJson(plates, {
            color: 'orange',
            weight: 2
        }).addTo(tectonicPlates)
    });

    // Create a tile layer for the base map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
        "Street Map": streetmap,
        "Satellite": googleSat
    };

    // Create an overlayMaps object to hold the Earthquakes layer.
    let overlayMaps = {
        "Earthquakes": earthquakeMap,
        "Tectonic Plates": tectonicPlates
    };

    // Create the map object with options.
    let map = L.map("map-id", {
        center: [38.84, -122.84], // Adjusted latitude value
        zoom: 5, // Adjusted initial zoom level
        layers: [streetmap, earthquakeMap]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false,
        position: "topleft"
    }).addTo(map);

    let legend = L.control({ position: "bottomleft" });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create("div", "legend");
        let depthLabels = ['<10', '10-30', '30-50', '50-70', '70-90', '90+'];
        let colors = ["#44ce1b", "#bbdb44", "#f7e379", "#f2a134", "#e51f1f", "#990000"];

        div.innerHTML += '<div class="legend-title">Depth</div>';

        // Loop through depth ranges and generate a label with a colored square for each range
        for (let i = 0; i < depthLabels.length; i++) {
            div.innerHTML += '<div class="legend-item">' +
                '<div class="legend-color" style="background:' + colors[i] + '"></div>' +
                '<div class="legend-label">' + depthLabels[i] + '</div>' +
                '</div>';
        }
        return div;
    };

    legend.addTo(map);
}

function getColor(depth) {
    let color;
    if (depth < 10) {
        color = "#44ce1b"; // Green
    } else if (depth < 30) {
        color = "#bbdb44"; // Light Green
    } else if (depth < 50) {
        color = "#f7e379"; // Yellow
    } else if (depth < 70) {
        color = "#f2a134"; // Orange
    } else if (depth < 90) {
        color = "#e51f1f"; // Red
    } else {
        color = "#990000"; // Dark Red
    }
    return color;
}

// Function to create earthquake markers layer
function createMarkers(data) {
    let earthquakeLoc = data.features; // Access the features array in the GeoJSON data

    // Define a scale for the earthquake magnitude to radius
    let radiusScale = d3.scaleLinear()
        .domain([d3.min(earthquakeLoc, d => d.properties.mag), d3.max(earthquakeLoc, d => d.properties.mag)])
        .range([2, 40]); // Set the minimum and maximum radius

    // Initialize an array to hold earthquake markers.
    let earthquakeMarkers = [];

    // Loop through the data array.
    earthquakeLoc.forEach(earthquake => {
        // Calculate the radius based on the earthquake depth
        let radius = radiusScale(earthquake.properties.mag);

        // Get the color based on the earthquake magnitude using the getColor function
        let fillColor = getColor(earthquake.geometry.coordinates[2]);

        // Create custom markers based on earthquake data.
        let circle = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            radius: radius,
            color: "#000000",
            weight: 1,
            fillColor: fillColor,
            fillOpacity: 0.7
        }).bindPopup(`<h3>Location: ${earthquake.properties.title} km</h3>
            <h3>Magnitude: ${earthquake.properties.mag}</h3>
            <h3>Longitude: ${earthquake.geometry.coordinates[0]} km</h3>
            <h3>Latitude: ${earthquake.geometry.coordinates[1]} km</h3>
            <h3>Depth: ${earthquake.geometry.coordinates[2]} km</h3>`);

        // Add the marker to the array
        earthquakeMarkers.push(circle);
    });

    // Create a layer group from the array of markers
    let earthquakeLayer = L.layerGroup(earthquakeMarkers);

    // Call the createMap function with the earthquake layer
    createMap(earthquakeLayer);

    console.log(data)
}

// Perform an API call to the USGS Earthquake API to get the earthquake information using d3.json.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url)
    .then(createMarkers)
    .catch(error => console.error("Error fetching earthquake data:", error));
console.log(url);

