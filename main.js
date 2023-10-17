// Create a Leaflet map with a specified center and zoom level
const mymap = L.map('map').setView([36.7783, -119.4179], 6);

// Add a tile layer from OpenStreetMap to the map
L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// Load GeoJSON data from the file and add it to the map with specified style and interactions

d3.json('new_counties.geojson').then(data => {
    L.geoJson(data, {
        style:style,
        onEachFeature: onEachFeature
    }).addTo(mymap);
});



// Define the style function for GeoJSON features
function style(feature) {
    var housingPrice = feature.properties.MedianhomePrice2023; 
    return {
        fillColor: getColor(housingPrice),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}


// Define interactions for each GeoJSON feature
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: function (e) {        // When mouseover, highlight the feature
            const layer = e.target;
            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });
            // Bring the layer to the front for better visibility

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }

            // Display county name and housing price in a popup
            const countyName = feature.properties.name; 
            const housingPrice = feature.properties.MedianhomePrice2023; 
            const monthlyMortgage = feature.properties.Monthlypayment2023;

            // Create the popup content
            const popupContent = `<b>County: ${countyName}</b><br>Housing Price: $${housingPrice}</b><br>Monthly Payment: $${monthlyMortgage}`;

            // Bind the popup to the layer
            layer.bindPopup(popupContent).openPopup();
        },
        mouseout: function (e) {
            const layer = e.target;
            layer.setStyle({
                weight: 2,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            });

            // Close the popup
            layer.closePopup();
        }
    });
}
function getColor(value) {
    return value > 1000000 ? '#756bb1' :
           value > 800000 ? '#bcbddc' :
           value > 600000 ? '#fa9fb5' :
           value > 400000 ? '#c51b8a' :
           value > 200000 ? '#fdbb84' :
                            '#1c9099';
}
var legend = L.control({ position: 'bottomright' });
// Add legend to the map
legend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 200000, 400000, 600000, 800000, 1000000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(mymap);
// Add a title to the map
const mapTitle = L.control();
// Add title to the map
mapTitle.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'map-title');
    div.innerHTML = '<h2>Choropleth Map of Housing price in California by county</h2>';
    return div;
};

mapTitle.addTo(mymap);