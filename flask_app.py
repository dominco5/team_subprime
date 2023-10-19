from flask import Flask, jsonify
import json


app = Flask(__name__)


@app.route("/")
def home():
    """Lists all available API routes."""
    return (
        "<h1>California Housing Prices Analysis</h1>"
        "<h2>Available Routes:</h2>"
        "<b>/api/CA</b><br/>"
        "Get information on median housing prices for the state of California from 1990 to 2023.<br/><br/>"
        "<b>/api/Orange</b><br/>"
        "Replace 'Orange' with the county of interest to get information on median housing prices for the specified county.<br/><br/>"
        "<b>/api/date/4-1-08</b><br/>"
        "Replace '4-1-08' with the date you want to query in the format M-D-YY or MM-DD-YY, "
        "where single-digit months and days should be entered without leading zeros (e.g., 1-1-90) to get information on housing prices for California counties for the specified date.<br/><br/>"
        "<b>/api/percent_change/start/1-1-10/end/1-1-20</b><br/>"
        "Replace '1-1-10' and '1-1-20' with start and end dates to get the percent change in housing prices between the specified dates.<br/><br/>"
        "<b>/api/GDP</b><br/>"
        "Get information on Gross Domestic Product (GDP).<br/><br/>"
        "<b>/api/FEDFUNDS</b><br/>"
        "Get information on Federal Funds Interest Rate.<br/><br/>"
        "<b>/api/UNRATE</b><br/>"
        "Get information on the Unemployment Rate.<br/><br/>"
        "Note: Dates available in the dataset are January 1, April 1, July 1, and October 1 from 1990 to 2023.<br/><br/>"
    )


@app.route("/api/<county>")
def county_search(county):
    with open('Resources/pricing_data.json', 'r') as json_file:
        data = json.load(json_file)

    if county in data:
        county_data = {county: data[county]}
        response = json.dumps(county_data, indent=4)
    else:
        response = jsonify({"error": "County not found"})

    return response


@app.route("/api/date/<date>")
def date_search(date):
    with open('Resources/date_data.json', 'r') as json_file:
        data = json.load(json_file)
    date = date.replace("-", "/")

    if date in data:
        date_data = data[date]["Counties"]

        county_price_data = {county: county_data["Price"] for county, county_data in date_data.items()}

        response = jsonify(county_price_data)
    else:
        response = jsonify({"error": "Date not found"})

    return response


@app.route("/api/percent_change/start/<start>/end/<end>")
def average_rate_of_change(start, end):
    with open('Resources/date_data.json', 'r') as json_file:
        data = json.load(json_file) 

    start_date = start.replace("-", "/")
    end_date = end.replace("-", "/")

    if start_date not in data or end_date not in data:
        return jsonify({"error": "Start date or end date not found in data"})

    start_prices = data[start_date]["Counties"]
    end_prices = data[end_date]["Counties"]

    percent_change = {}

    for county in start_prices:
        if county in end_prices:
            start_price = start_prices[county]["Price"]
            end_price = end_prices[county]["Price"]

            if start_price > 0: 
                percent_change[county] = ((end_price - start_price) / start_price) * 100 
            else:
                percent_change[county] = 0

    return jsonify(percent_change)

if __name__ == '__main__':
    app.run(debug=True)