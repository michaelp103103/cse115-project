import bottle
import json
import data

url1 = 'https://www.ncdc.noaa.gov/access-data-service/api/v1/data?dataset=global-summary-of-the-year&dataTypes=TAVG&stations=USW00094728&startDate=1895-01-01&endDate=2017-12-31&format=json'
url2 = 'https://www.ncdc.noaa.gov/cag/national/time-series/110-tavg-12-12-1895-2017.json?base_prd=true&begbaseyear=1895&endbaseyear=2017'

@bottle.route("/")
def send_to_index():
    return bottle.static_file("index.html", root="")

@bottle.route("/charts.js")
def get_charts():
    return bottle.static_file("charts.js", root="")

@bottle.route("/data")
def get_all_data():
    return data.get_data(url1, url2)


bottle.run(host="0.0.0.0", port=8080, debug=True)