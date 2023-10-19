const apiKey = '8O07TTRWR4BZMSUZ'; // Replace with your Alpha Vantage API key
const symbols = ['SPY', 'XLF', 'SMH', 'IYR'];
const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;

function fetchDailyLow(symbol) {
    fetch(`${apiUrl}${symbol}`)
        .then(response => response.json())
        .then(data => {
            const timeSeriesData = data['Time Series (Daily)'];
            const dates = Object.keys(timeSeriesData);
            const latestDate = dates[0]; // Assumes the data is sorted by date

            const lowPrice = timeSeriesData[latestDate]['3. low'];

            console.log(`${symbol} - Daily Low on ${latestDate}: $${lowPrice}`);
        })
        .catch(error => {
            console.error(`Error fetching data for ${symbol}:`, error);
        });
}

function updateData() {
    for (const symbol of symbols) {
        fetchDailyLow(symbol);
    }

    // Schedule the next update in 24 hours
    setTimeout(updateData, 86400000);
}

// Initial data retrieval and scheduling the updates
updateData();
