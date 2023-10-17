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
        }
    };

    let county2Trace = {
        x: dates,
        y: county2Data,
        name: county2,
        type: 'bar',
        opacity: 0.70,
        marker: {
            color: '#ff7f0e'
        }
    };

    let gdpTrace = {
        x: dates,
        y: GDP,
        name: 'GDP',
        yaxis: 'y2',
        line: {
            color: 'green'
        },
        type: 'scatter'
    };

    let interestTrace = {
        x: dates,
        y: interest,
        name: 'Interest Rate',
        yaxis: 'y3',
        line: {
            color: '#d62728'
        },
        type: 'scatter'
    };

    let unemploymentTrace = {
        x: dates,
        y: unemployment,
        name: 'Unemployment Rate',
        yaxis: 'y4',
        line: {
            color: '#9467bd'
        },
        type: 'scatter'
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
            title: 'Median Housing Price',
            titlefont: {
                color: '#1f77b4'
            },
            tickfont: {
                color: '#1f77b4'
            },
        },
        yaxis2: {
            title: 'GDP',
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
            title: 'Interest Rate',
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
            title: 'Unemployment Rate',
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


