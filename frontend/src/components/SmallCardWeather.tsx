import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudFog, 
  CloudLightning 
} from 'lucide-react';

// Define types for weather code mapping
interface WeatherCodeInfo {
  icon: React.ComponentType<{ size?: number, className?: string }>;
  description: string;
  color: string;
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
    color: "text-muted"
  },
  95: { 
    icon: CloudLightning, 
    description: "Orage",
    color: "text-dark"
  }
};

// Define prop types for the compact weather card
interface CompactWeatherCardProps {
  date: Date;
  idx: number;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  isSelected: boolean;
  onCardClick:(idx :number) => void; 
}

// Compact Weather Card Component
const CompactWeatherCard: React.FC<CompactWeatherCardProps> = ({ 
  date,
  idx, 
  weatherCode, 
  maxTemp, 
  minTemp,
  isSelected,
  onCardClick
}) => {

  const doClick = (idx:number)=>{
    onCardClick(idx);
    console.log(idx)
  }

  // Get weather details from the map, default to Cloud if not found
  const weatherDetails = WEATHER_CODE_MAP[weatherCode] || WEATHER_CODE_MAP[3];
  const WeatherIcon = weatherDetails.icon;

  // Format date
  const formattedDate = date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <div 
      className={`card shadow rounded-3 text-center ${isSelected ? 'border-dark' : ''}`}
      style={{ 
        maxWidth: '200px', 
        width: '200px', 
        margin: '0 auto',
        cursor: 'pointer' 
      }}
      onClick={()=>doClick(idx)} 
    >
      <div className="card-body p-2 d-flex flex-column align-items-center">
        {/* Date */}
        <h6 className="card-title mb-2">
          {formattedDate}
        </h6>

        {/* Weather Icon - Centered Container */}
        <div className="d-flex justify-content-center align-items-center mb-2" style={{height: '48px'}}>
          <WeatherIcon 
            size={48} 
            className={`${weatherDetails.color}`} 
          />
        </div>

        {/* Temperature Range */}
        <div className="d-flex gap-2">
          <span className="text-danger">
            ↑ {maxTemp}°C
          </span>
          <span className="text-primary">
            ↓ {minTemp}°C
          </span>
        </div>
      </div>
    </div>
  );
};

interface WeatherForecastViewProps {
  data : object;
  handleClick:(idx:number) => void; 
  selection:number;
}

// Example usage component
const WeatherForecastView: React.FC<WeatherForecastViewProps> = ({data, handleClick, selection}) => {
  // Mock data - replace with actual API data
  const mockWeatherData = data.daily.map((day, index) =>({
    date: new Date(day.date),
    idx : index,
    weatherCode: day.weather_code,
    maxTemp: day.temperature_2m_max.toFixed(1),
    minTemp: day.temperature_2m_min.toFixed(1)
  }));

  /*[
    {
      date: new Date('2024-03-15'),
      idx : 0,
      weatherCode: 2,
      maxTemp: 18,
      minTemp: 10
    },
    {
      date: new Date('2024-03-15'),
      idx : 1,
      weatherCode: 2,
      maxTemp: 18,
      minTemp: 10
    },
    {
      date: new Date('2024-03-15'),
      idx : 2,
      weatherCode: 2,
      maxTemp: 18,
      minTemp: 10
    },
    {
      date: new Date('2024-03-15'),
      idx : 3,
      weatherCode: 2,
      maxTemp: 18,
      minTemp: 10
    },
    {
      date: new Date('2024-03-15'),
      idx : 4,
      weatherCode: 2,
      maxTemp: 18,
      minTemp: 10
    }

  ];*/

  return (
    <div className="container">
      <div className="row justify-content-center">
        {mockWeatherData.map((day, index) => (
          <div key={index} className="col-auto mb-3">
            <CompactWeatherCard {...day} onCardClick={handleClick} isSelected={index==selection}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecastView;