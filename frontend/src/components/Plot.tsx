import React from 'react';
import { 
  LineChart, 
  BarChart,
  Line, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  TooltipProps
} from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { Container } from 'react-bootstrap';
// Define the structure for hourly weather data
interface HourlyWeatherData {
  time: string;
  temperature: number;
  precipitationProbability: number;
  windSpeed: number;

}

// Custom Tooltip Type
type CustomTooltipProps = TooltipProps<ValueType, NameType> & {
  // You can add any additional props if needed
};

// Custom Tooltip Component with TypeScript
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="bg-white border p-2 shadow-sm" 
        style={{ 
          border: '1px solid #ccc', 
          borderRadius: '4px' 
        }}
      >
        <p className="mb-0">{`Heure : ${label}`}</p>
        {payload.map((entry) => (
          <p 
            key={entry.name} 
            className="mb-0" 
            style={{color: entry.color}}
          >
            {`${entry.name} : ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface HourlyWeatherPlotsProps{
  data:object;
  selection:number;
}

// Hourly Weather Plots Component
const HourlyWeatherPlots: React.FC<HourlyWeatherPlotsProps> = ({data, selection}) => {
  // Mock data - replace with actual API data
  const hourly = data.hourly[selection];
  const mockHourlyData: HourlyWeatherData[] = [...Array(24).keys()].map((i)=>({
    time: hourly.Heures[i],
      temperature: hourly.temperature_2m[i].toFixed(1),
      precipitationProbability: hourly.precipitation_probability[i].toFixed(0),
      windSpeed: hourly.wind_speed_10m[i].toFixed(1)
  }));

  return (
    <div className="container-fluid px-4">
      {/* Temperature and Wind Speed Combined Plot */}
      <div className="row mb-4">
        <div className="col-sm">
          <h6 className="invisible text-muted mb-3">Température (°C) et Vitesse du vent (km/h)</h6>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart 
              data={mockHourlyData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid 
                horizontal={true} 
                vertical={false} 
                stroke="#f0f0f0" 
              />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left"
                label={{ value: 'Temp. (°C)', angle: -90, position: 'center', dx:-8 }}
                axisLine={false}
                tickLine={false}
                type="number"
                dataKey={(v)=>parseInt(v.temperature)}
                domain={['dataMin-2',  'dataMax+2']}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                label={{ value: 'Vit. Vent (km/h)', angle: 90, position: 'center', dx:8 }}
                axisLine={false}
                tickLine={false}
                type="number"
                dataKey={(v)=>parseInt(v.windSpeed)}
                domain={['dataMin-2',  'dataMax+2']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="temperature" 
                name="Température"
                stroke="#FF6B6B" 
                strokeWidth={2}
                dot={{ stroke: '#FF6B6B', strokeWidth: 2, r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="windSpeed" 
                name="Vitesse du vent"
                stroke="#59788E" 
                strokeWidth={2}
                dot={{ stroke: '#59788E', strokeWidth: 2, r: 4 }}
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      

      {/* Precipitation Probability Bar Plot */}
        <div className="col-sm">
          <h6 className="invisible text-muted mb-3">Probabilité de précipitations (%)</h6>
          <ResponsiveContainer minWidth={300} height={200}>
            <BarChart 
              data={mockHourlyData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid 
                horizontal={true} 
                vertical={false} 
                stroke="#f0f0f0" 
              />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                type="number"
                domain={[0, 100]}
                label={{ value: 'Prob. de Préc. (%)', angle: -90, position: 'center', dx:-8 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="precipitationProbability" 
                name="Précipitations"
                fill="#1E90FF" 
                activeBar={false}
              />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HourlyWeatherPlots;