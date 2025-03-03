import React from 'react';
import { 
  CloudSun, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudFog, 
  CloudLightning,
  Droplet,
  Wind,
  Thermometer,
  Compass
} from 'lucide-react';

import HourlyWeatherPlots from './Plot';

// Define types for weather code mapping
interface WeatherCodeInfo {
  icon: React.ComponentType<{ size?: number, className?: string }>;
  description: string;
  color: string;
}


interface myData {
  daily: Array<object>,
  hourly: Array<object>,
  current: Array<string>,
  coordinates: object,
  timezone : object
}

// Define types for weather data
interface WeatherData {
  date: Date;
  city:string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  currentTemp: number;
  precipitationProbability: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  uvIndex?: number | null;
  data:myData;
  selection:number;
}

// Mapping of Open-Meteo weather codes to icons and descriptions
const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { 
    icon: Sun, 
    description: "Ciel dégagé",
    color: "text-warning"
  },
  1: { 
    icon: CloudSun, 
    description: "Principalement dégagé",
    color: "text-primary"
  },
  2: { 
    icon: CloudSun, 
    description: "Partiellement nuageux",
    color: "text-primary"
  },
  3: { 
    icon: Cloud, 
    description: "Couvert",
    color: "text-secondary"
  },
  45: { 
    icon: CloudFog, 
    description: "Brumeux",
    color: "text-muted"
  },
  51: { 
    icon: CloudRain, 
    description: "Bruine légère",
    color: "text-primary"
  },
  61: { 
    icon: CloudRain, 
    description: "Pluie faible",
    color: "text-primary"
  },
  63: { 
    icon: CloudRain, 
    description: "Pluie modérée",
    color: "text-primary"
  },
  71: { 
    icon: CloudSnow, 
    description: "Neige légère",
    color: "text-white"
  },
  95: { 
    icon: CloudLightning, 
    description: "Orage",
    color: "text-dark"
  }
};

// Utility function to convert wind direction to cardinal direction
const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// WeatherSummary Component
const WeatherSummary: React.FC<WeatherData> = ({ 
  date,
  city, 
  weatherCode, 
  maxTemp, 
  minTemp, 
  currentTemp,
  precipitationProbability,
  windSpeed,
  windDirection,
  humidity,
  uvIndex = null,
  data,
  selection
}) => {
  // Get weather details from the map, default to Cloud if not found
  const weatherDetails = WEATHER_CODE_MAP[weatherCode] || WEATHER_CODE_MAP[3];
  const WeatherIcon = weatherDetails.icon;

  // Format date
  const formattedDate = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="bg-white shadow rounded-3 d-flex justify-content-center align-items-center">
         <div className='container'>
          <div className='row justify-content-center align-items-center'>
            <div className='col-sm d-flex justify-content-center'>
              <div className="container">
                {/* Main Weather Summary */}
                <div className="d-flex w-100 justify-content-center align-items-center gap-4">
            <div className="d-flex align-items-center gap-4">
                {/* Weather Icon */}
                <div className={weatherDetails.color}>
                    <WeatherIcon size={64} />
                </div>

                {/* Basic Weather Info */}
                <div className='d-inline-block' >
                    <h2 className="h4 text-capitalize fw-bold">{city}, {formattedDate}</h2>
                    <p className="text-muted">{weatherDetails.description}</p>
                
                    {/* Temperature Range */}
                    <div className="d-flex gap-2 mt-2">
                        <span className="text-danger d-flex align-items-center">
                            <Thermometer size={16} className="me-1"/> 
                            Max: {maxTemp}°C
                        </span>
                        <span className="text-primary d-flex align-items-center">
                            <Thermometer size={16} className="me-1"/> 
                            Min: {minTemp}°C
                        </span>
                    </div>
                </div>
            </div>
                </div>
                <div className="container d-inline-flex align-items-center w-100">
                  <div className="d-inline w-100">
                    <div className='container'>
                      <div className='row'>
                    {/* Detailed Weather Information */}
                {/* Precipitation Probability */}
                {precipitationProbability >= 0 && (
                <div className="col-sm justify-content-center">
                    <div className="d-flex align-items-center gap-2">
                        <Droplet size={16} className="text-primary"/>
                        <span>Précipitations: {precipitationProbability}%</span>
                    </div>
                </div>
                )}

                {/* Wind Information */}
                <div className="col-sm">
                    <div className="d-flex align-items-center gap-2">
                        <Wind size={16} className="text-success"/>
                        <span>
                            Vent: {windSpeed} km/h {getWindDirection(windDirection)}
                        </span>
                    </div>
                </div>

                {/* Current Temperature */}
                <div className="col-sm">
                    <div className="d-flex align-items-center gap-2">
                        <Thermometer size={16} className="text-warning"/>
                        <span>Température : {currentTemp}°C</span>
                    </div>
                </div>

                {/* Humidity */}
                <div className="col-sm">
                    <div className="d-flex align-items-center gap-2">
                        <Droplet size={16} className="text-info"/>
                        <span>Humidité: {humidity}%</span>
                    </div>
                </div>
                    </div>
                   
                {/* UV Index - Only render if provided */}
                {uvIndex !== null && (
                <div className="col-sm">
                    <div className="d-flex align-items-center gap-2">
                        <Compass size={16} className="text-warning"/>
                        <span>Indice UV: {uvIndex}</span>
                    </div>
                </div>
                )}
                <div className="col-sm">
                    <div className="invisible d-flex align-items-center gap-2">
                        <Compass size={16} className="text-warning"/>
                        <span>Indice UV: {uvIndex}</span>
                    </div>
                
                
                    
                  </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm'>
              <HourlyWeatherPlots data={data} selection={selection}/>
            </div>
          </div>
        </div>
    </div>
  );
};

interface WeatherProps {
  data:myData;
  selection:number;
  city:string;
}


// Example usage
const WeatherApp: React.FC<WeatherProps> = ({city, data, selection}) => {
  // Mock data - replace with actual API data
  const daily = data.daily[selection];
  const current = data.current;
  var isSelected = false;
  if (daily && daily.date && current && current.date){
    isSelected = daily.date == current.findLastIndex;
  }
 
  const myDate = daily?.date ? new Date(daily.date) : new Date.now();
  
  const mockWeatherData: WeatherData = {
    date: myDate,
    city:city,
    weatherCode: daily.weather_code,
    maxTemp:daily.temperature_2m_max.toFixed(1),
    minTemp: daily.temperature_2m_min.toFixed(1),
    currentTemp: isSelected ? current.temperature_2m.toFixed(1) : (0.5*(daily.temperature_2m_max + daily.temperature_2m_min)).toFixed(1),
    precipitationProbability: isSelected ? current.precipitation.toFixed(1) : daily.precipitation_probability_max.toFixed(1),
    windSpeed: isSelected ? current.wind_speed_10m.toFixed(1) : daily.wind_speed_10m_max.toFixed(1),
    windDirection: isSelected ? current.wind_direction_10m.toFixed(1) : daily.wind_direction_10m_dominant.toFixed(1), // South
    humidity: isSelected ? current.precipitation.toFixed(1): daily.precipitation_probability_max.toFixed(1),
    uvIndex: daily.uv_index_max.toFixed(1) // Optional - can be omitted
  };

  return (
    <div className="container py-4">
      <WeatherSummary data={data} selection={selection} {...mockWeatherData} />
    </div>
  );
};

export default WeatherApp;