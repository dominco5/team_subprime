// Create a Leaflet map with a specified center and zoom level
const mymap = L.map('map').setView([37.2, -117], 6);

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

legend.onAdd = function (mymap) {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [0, 200000, 400000, 600000, 800000, 1000000];
    var labels = [];

    // Define a title for the legend
    div.innerHTML = '<h4>Median House Prices</h4>';

    // Loop through the density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        var from = grades[i];
        var to = grades[i + 1];

        div.innerHTML += '<i style="background:' + getColor(from + 1) + '"></i> ';
        div.innerHTML += '$' + from.toLocaleString() + (to ? '&ndash;$' + to.toLocaleString() + '<br>' : '+');
    }

    div.style.backgroundColor = 'white';
    div.style.padding = '10px';
    div.style.border = '1px solid #ccc';

    return div;
};

legend.addTo(mymap);

// Add a title to the map
const mapTitle = L.control();
// Add title to the map
mapTitle.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'map-title');
    return div;
};

mapTitle.addTo(mymap);

function init() {
    let dropDown1 = d3.select("#selDataset1"); 
    let dropDown2 = d3.select("#selDataset2");

    d3.json("Resources/pricing_data.json").then(function(dataset) {
        let counties = Object.keys(dataset);

        let optionCount = 3;
        counties.splice(-optionCount);

        counties.forEach((county) => {
            dropDown1.append("option").text(county).property("value", county);
            dropDown2.append("option").text(county).property("value", county);
        });

        buildSideBySideBarGraphs(counties[0], counties[0], dataset);
    });
}

function buildSideBySideBarGraphs(county1, county2, dataset) {
    let dates = Object.keys(dataset[county1]);
    let county1Data = Object.values(dataset[county1]);
    let county2Data = Object.values(dataset[county2]);
    let GDP = Object.values(dataset['GDP']);
    let interest = Object.values(dataset['FEDFUNDS']);
    let unemployment = Object.values(dataset['UNRATE']);

    // Create traces for both counties
    let county1Trace = {
        x: dates,
        y: county1Data,
        name: county1,
        type: 'bar',
        opacity: 0.70,
        marker: {
            color: '#1f77b4'
        },
        hovertemplate: '%{y:$,.2f}', // Format as dollars with two decimal places
    };

    let county2Trace = {
        x: dates,
        y: county2Data,
        name: county2,
        type: 'bar',
        opacity: 0.70,
        marker: {
            color: '#ff7f0e'
        },
        hovertemplate: '%{y:$,.2f}', // Format as dollars with two decimal places
    };

    let gdpTrace = {
        x: dates,
        y: GDP,
        name: 'GDP',
        yaxis: 'y2',
        line: {
            color: 'green'
        },
        type: 'scatter',
        hovertemplate: '%{y:$,.2f}', // Format as dollars with two decimal places
    };

    let interestTrace = {
        x: dates,
        y: interest,
        name: 'Interest Rate',
        yaxis: 'y3',
        line: {
            color: '#d62728'
        },
        type: 'scatter',
        hovertemplate: '%{y:.2f}%', // Format as percentage with two decimal places
    };

    let unemploymentTrace = {
        x: dates,
        y: unemployment,
        name: 'Unemployment Rate',
        yaxis: 'y4',
        line: {
            color: '#9467bd'
        },
        type: 'scatter',
        hovertemplate: '%{y:.2f}%', // Format as percentage with two decimal places
    };

    let data = [county1Trace, county2Trace, gdpTrace, interestTrace, unemploymentTrace];

    let layout = {
        title: 'Comparison of ' + county1 + ' and ' + county2,
        width: 1400,
        height: 600,
        xaxis: {
            title: 'Date',
            titlefont: {
                color: '#000000'
            },
            tickfont: {
                color: '#000000'
            },
            domain: [0, 0.88]
        },
        yaxis: {
            title: 'Median Housing Price ($)',
            titlefont: {
                color: '#000000'
            },
            tickfont: {
                color: '#000000'
            },
        },
        yaxis2: {
            title: 'GDP ($)',
            titlefont: {
                color: 'green'
            },
            tickfont: {
                color: 'green'
            },
            overlaying: 'y',
            anchor: 'free',
            side: 'right',
            position: 1
        },
        yaxis3: {
            title: 'Interest Rate (%)',
            titlefont: {
                color: '#d62728'
            },
            tickfont: {
                color: '#d62728'
            },
            overlaying: 'y',
            anchor: 'free',
            side: 'right',
            position: 0.95
        },
        yaxis4: {
            title: 'Unemployment Rate (%)',
            titlefont: {
                color: '#9467bd'
            },
            tickfont: {
                color: '#9467bd'
            },
            overlaying: 'y',
            anchor: 'free',
            side: 'right',
            position: .9
        },
        legend: {
            y: -0.2
        }
    };

    Plotly.newPlot('plot', data, layout);
}

function optionChanged() {
    d3.json("Resources/pricing_data.json").then(function(dataset) {
        let county1 = d3.select("#selDataset1").property("value");
        let county2 = d3.select("#selDataset2").property("value");

        buildSideBySideBarGraphs(county1, county2, dataset);
    });
}

init();

function plotHousingPricesTable(dateIndex, housingPrices, countyNames) {
    let sortedCounties = Object.keys(housingPrices).sort((a, b) => housingPrices[b] - housingPrices[a]);
  
    let topCounties = sortedCounties.slice(0, 10);
  
    let table = document.getElementById("top-counties-table");
    let tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
  
    topCounties.forEach(fipsCode => {
        let countyName = countyNames[fipsCode];
        let price = housingPrices[fipsCode].toLocaleString();
  
        let row = document.createElement("tr");
      row.innerHTML = `
        <td>${countyName}</td>
        <td>$${price}</td>
      `;
  
      tbody.appendChild(row);
    });
  }
  
  d3.json("Resources/date_data.json").then(function(datedataset) {
    let dateKeys = Object.keys(datedataset);
    let dateSlider = document.getElementById("date-slider");
    let selectedDate = document.getElementById("selected-date");
  
    dateSlider.max = dateKeys.length - 1;
  
    function plotHousingPrices(dateIndex) {
      let date = dateKeys[dateIndex];
  
      if (!datedataset[date] || !datedataset[date].Counties) {
        console.error('Data not available for the selected date.');
        return;
      }
  
      let housingPrices = {};
      let countyNames = {};
      for (let countyKey in datedataset[date].Counties) {
        if (countyKey !== "CA") {
          let countyData = datedataset[date].Counties[countyKey];
          let fipsCode = countyData.FIPS;
          let price = countyData.Price;
  
          let name = countyKey;
  
          housingPrices[fipsCode] = price;
          countyNames[fipsCode] = name;
        }
      }
  
      fetch("https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json")
        .then(response => response.json())
        .then(geojson => {
          let data = [{
            type: 'choropleth',
            geojson: geojson,
            locations: Object.keys(housingPrices),
            z: Object.values(housingPrices),
            colorscale: 'Portland',
            colorbar: {
              title: 'Median Housing Prices ($)',
              titleside: 'top',
              tickmode: 'array'
            },
            showscale: true,
            hoverinfo: 'text',
            text: Object.keys(countyNames).map(fipsCode => `<b>County:</b> ${countyNames[fipsCode]}<br><b>Price:</b> $${housingPrices[fipsCode].toLocaleString()}`),
          }];
  
          let layout = {
            geo: {
              scope: 'usa',
              center: { lon: -120.4179, lat: 36.7783 },
              showland: true,
              landcolor: 'rgb(217, 217, 217)',
              projection: { scale: 2.3 },
            },
            title: `Median Housing Prices - ${date}`,
            width: 1200,
            height: 700,
          };
  
          Plotly.newPlot('choropleth-map', data, layout);
          selectedDate.textContent = date;
  
          // Call the table population function
          plotHousingPricesTable(dateIndex, housingPrices, countyNames);
        })
        .catch(error => console.error(error));
    }
  
    dateSlider.addEventListener("input", function () {
      let dateIndex = parseInt(dateSlider.value);
      plotHousingPrices(dateIndex);
    });
  
    plotHousingPrices(0); 
  });
  




