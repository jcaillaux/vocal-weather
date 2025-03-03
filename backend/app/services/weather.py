import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry
import datetime

class OpenMeteoService :

    def __init__(self):
        self.url = "https://api.open-meteo.com/v1/forecast"

        cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
        retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
        self.openmeteo = openmeteo_requests.Client(session = retry_session)
    
    def get_forecast(self, lat:float=52.52, lon:float=13.41, start_date:str = None, end_date:str=None):
        start_date = str(datetime.datetime.now().today().date()) if start_date is None else start_date
        end_date   = start_date if end_date is None else end_date

        hourly_data  = ["temperature_2m", "precipitation_probability", "wind_speed_10m", "wind_direction_10m"]
        daily_data   = ["weather_code", "temperature_2m_max", "temperature_2m_min", "uv_index_max", "precipitation_probability_max", "wind_speed_10m_max", "wind_direction_10m_dominant"]
        current_data = ["temperature_2m", "is_day", "precipitation", "weather_code", "wind_speed_10m", "wind_direction_10m"]
        params = {
	        "latitude"   : lat,
	        "longitude"  : lon,
	        "hourly"     : hourly_data,
            "daily"      : daily_data,
            "current"    : current_data,
            "timezone"   : "Europe/Berlin",
            "start_date" : start_date,
            "end_date"   : end_date
        }
        response = self.openmeteo.weather_api(self.url, params=params)[0]
  
        
        data = {
            'coordinates' : {
                'latitude'  : response.Latitude(),
                'longitude' : response.Longitude()
            },
            'timezone' : {
                'name'   : response.Timezone().decode(),
                'symbol' : response.TimezoneAbbreviation().decode()
            },
            'hourly' : self.extract_hourly_data(response, hourly_data),
            'daily'  : self.extract_daily_data(response, daily_data),
            'current' : self.extract_current_data(response, current_data)

        }
        
        return data

    def extract_hourly_data(self, response, data_name):
        hourly = response.Hourly()
        hourly_data = []
        stamps = pd.date_range(
            start = pd.to_datetime(hourly.Time()    + response.UtcOffsetSeconds(), unit = "s", utc = True),
            end   = pd.to_datetime(hourly.TimeEnd() + response.UtcOffsetSeconds(), unit = "s", utc = True),
            freq  = pd.Timedelta(seconds = hourly.Interval()),
            inclusive = "left"
        ).strftime('%H:%M').to_list()
        nb_days = len(stamps) // 24
        for d in range(nb_days):
            hash = {'Heures' : stamps[:24]}
            for i in range(hourly.VariablesLength()):
                hash[data_name[i]] = hourly.Variables(i).ValuesAsNumpy().tolist()[d*24:(d+1)*24]
            hourly_data.append(hash)
        
        return hourly_data
    
    def extract_daily_data(self, response, data_name):
        daily = response.Daily()
        daily_data = []
        stamps = pd.date_range(
            start = pd.to_datetime(daily.Time()    + response.UtcOffsetSeconds(), unit = "s", utc = True),
            end   = pd.to_datetime(daily.TimeEnd() + response.UtcOffsetSeconds(), unit = "s", utc = True),
            freq  = pd.Timedelta(seconds = daily.Interval()),
            inclusive = "left"
        ).strftime('%Y-%m-%d').to_list()
        
        for d in range(len(stamps)):
            hash = {'date' : stamps[d]}
            for i in range(daily.VariablesLength()):
                hash[data_name[i]] = daily.Variables(i).ValuesAsNumpy().tolist()[d]
            daily_data.append(hash)
        
        return daily_data
    
    def extract_current_data(self, response, data_name):
        current = response.Current()
        current_data = {'date' : pd.to_datetime(current.Time()    + response.UtcOffsetSeconds(), unit = "s", utc = True).strftime('%Y-%m-%d')}
        
        for i in range(current.VariablesLength()):
            current_data[data_name[i]] = current.Variables(i).Value()
        
        return current_data


if __name__ == '__main__':
    open_meteo = OpenMeteoService()
    response = open_meteo.get_forecast(lat=52.52, lon=13.41,start_date='2025-03-02', end_date='2025-03-03')

    print(response['hourly'])

