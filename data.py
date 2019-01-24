import urllib.request
import json
from numpy import *
from scipy.interpolate import *


dict1 = {}

def convert_c2f_and_round(list0):
    list0[1] = round(list0[1] * 9 / 5 + 32, 3)
    return list0
    
    
def temp(V):
    return V[1]
    
def year(U):
    return U[0]
    
def line_func(listOfParams):
    x_val = listOfParams[2]
    y_val = listOfParams[0] * x_val + listOfParams[1]
    return [x_val, y_val]
    
    
def find_ny_record_temps(nyTemps):
    nyTempsWandC = {
                    'coolest years': {}, 
                    'warmest years': {}
                    }
    nyTempsCopy = sorted(nyTemps, key=temp)
    
    for num in range(0,3):
        coolLoop = []
        coolYear1 = nyTempsCopy.pop(0)
        coolLoop.append(coolYear1)
        while nyTempsCopy[0][1] == coolYear1[1]:
            coolYear = nyTemps_.pop(0)
            coolLoop.append(coolYear)
    
        nyTempsWandC['coolest years'][str(num + 1)] = coolLoop
    
        warmLoop = []
        warmYear1 = nyTempsCopy.pop(-1)
        warmLoop.append(warmYear1)
        while nyTempsCopy[-1][1] == warmYear1[1]:
            warmYear = nyTempsCopy.pop(-1)
            warmLoop.append(warmYear)
            
        nyTempsWandC['warmest years'][str(num + 1)] = warmLoop
        
    return nyTempsWandC

    
def long_term_avg(ny_temps):
    sum = 0
    count = 0
    for item in ny_temps:
        sum = sum + item[1]
        count = count + 1
    return round(sum / count, 3)
    

def find_line_endpoints(nyOrUSData):
    
    x = []
    y = []
    for item in nyOrUSData:
        x.append(item[0])
        y.append(item[1])
    
    arrX = array(x)
    arrY = array(y)
    
    
    line_params = polyfit(arrX, arrY, 1).tolist()
    
    line_params.append(0)
    
    line_params[2] = x[0]
    a = line_func(line_params)
    
    line_params[2] = x[-1]
    b = line_func(line_params)
    
    return [[a[0], b[0]], [a[1], b[1]]]
    

    
def get_data(url1, url2):
    urls = [url1, url2]
    
    for url in urls:
        response = urllib.request.urlopen(url)
        content1 = response.read().decode()
        content = json.loads(content1)
        
        list1 = []
        
        if "data" in content: #US Conditional
            list_of_years = []
            for key in content['data']:
                list_of_years.append(int(key[:4]))
            first_year = min(list_of_years)
            last_year = max(list_of_years)
            for num in range(first_year, 1 + last_year):
                year_key = str(num) + "12"
                usTemp = content['data'][year_key]
                loop_list = [num, float(usTemp['value']), float(usTemp['anomaly'])]
                list1.append(loop_list)
            
            dict1['us annual temps'] = list1
            dict1['us endpoints'] = find_line_endpoints(list1)
            
        else: #NY Conditional
            for num in range(0, len(content)):
                loop_list0 = [int(content[num]['DATE']), float(content[num]['TAVG'])]
                loop_list0 = convert_c2f_and_round(loop_list0)
                list1.append(loop_list0)
            nyList = sorted(list1, key=year)
            
            dict1['ny temp records'] = find_ny_record_temps(nyList)
            dict1['ny annual temps'] = nyList
            dict1['ny endpoints'] = find_line_endpoints(nyList)
            dict1['long term avg'] = long_term_avg(nyList)
            
    
    jsonStr = json.dumps(dict1)
    return jsonStr
    
"""    
url01 = 'https://www.ncdc.noaa.gov/access-data-service/api/v1/data?dataset=global-summary-of-the-year&dataTypes=TAVG&stations=USW00094728&startDate=1895-01-01&endDate=2017-12-31&format=json'
url02 = 'https://www.ncdc.noaa.gov/cag/national/time-series/110-tavg-12-12-1895-2017.json?base_prd=true&begbaseyear=1895&endbaseyear=2017'
    
print(get_data(url01, url02))"""