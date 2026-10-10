import React from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Compass, 
  Sun, 
  CloudRain, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Volume2,
  Calendar,
  ThermometerSun,
  ShieldCheck
} from 'lucide-react';
import { weatherData } from '../data/weatherData';
import { translations } from '../data/translations';

export default function WeatherView({ currentLang, onSpeakText }) {
  const t = translations[currentLang] || translations.en;

  const readWeatherAloud = () => {
    const textToSpeak = `कृषि मौसम समाचार: तापमान ${weatherData.current.temp} डिग्री सेल्सियस है। स्थिति: ${weatherData.current.condition}। हवा की गति ${weatherData.current.windSpeed} किलोमीटर प्रति घंटा। छिड़काव सलाह: ${weatherData.agroAdvisory.description}`;
    onSpeakText(textToSpeak);
  };

  return (
    <div className="weather-page animate-fade">
      {/* Header */}
      <div className="section-header-box">
        <div>
          <span className="badge badge-green">Hyperlocal Agro-Meteorological Station</span>
          <h2 className="section-title">{t.weather} (सटीक कृषि मौसम सलाह)</h2>
          <p className="section-subtitle">
            Microclimate weather forecasts designed specifically for field operations, irrigation scheduling, and fungicide spraying.
          </p>
        </div>

        <button onClick={readWeatherAloud} className="btn-secondary voice-listen-btn">
          <Volume2 size={18} />
          <span>Listen Weather in Voice</span>
        </button>
      </div>

      {/* Main Weather Hero Card */}
      <div className="weather-primary-card glass-panel">
        <div className="weather-top-status">
          <div className="weather-location-title">
            <MapPin size={20} className="loc-marker" />
            <div>
              <h3>{weatherData.location.city}</h3>
              <span className="loc-sub">{weatherData.location.region} • Elevation {weatherData.location.elevation}</span>
            </div>
          </div>
          <span className="badge badge-green">Automated Station Active</span>
        </div>

        <div className="weather-hero-data-row">
          {/* Big Temp & Condition */}
          <div className="weather-main-figure">
            <CloudSun size={76} className="sun-icon-main" />
            <div>
              <div className="big-degree">{weatherData.current.temp}°C</div>
              <div className="condition-phrase">{weatherData.current.condition}</div>
            </div>
          </div>

          {/* Key Agri Weather Metrics */}
          <div className="weather-indicators-grid">
            <div className="weather-metric-pill">
              <Droplets size={20} className="metric-icon blue" />
              <div>
                <span className="m-label">Relative Humidity</span>
                <span className="m-val">{weatherData.current.humidity}%</span>
              </div>
            </div>

            <div className="weather-metric-pill">
              <Wind size={20} className="metric-icon green" />
              <div>
                <span className="m-label">Wind Speed & Dir</span>
                <span className="m-val">{weatherData.current.windSpeed} km/h ({weatherData.current.windDirection})</span>
              </div>
            </div>

            <div className="weather-metric-pill">
              <CloudRain size={20} className="metric-icon amber" />
              <div>
                <span className="m-label">Rain Probability</span>
                <span className="m-val">{weatherData.current.rainProbability}% (Low)</span>
              </div>
            </div>

            <div className="weather-metric-pill">
              <ThermometerSun size={20} className="metric-icon purple" />
              <div>
                <span className="m-label">Soil Moisture</span>
                <span className="m-val">{weatherData.current.soilMoisture}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specialized Agro-Spray Advisory Card */}
        <div className="agro-advisory-box">
          <div className="advisory-title-row">
            <ShieldCheck size={22} className="advisory-icon" />
            <h4>{weatherData.agroAdvisory.title}</h4>
          </div>
          <p className="advisory-desc-text">{weatherData.agroAdvisory.description}</p>
          <div className="advisory-tags-row">
            <span className="badge badge-green">✓ {weatherData.agroAdvisory.sprayStatus}</span>
            <span className="badge badge-blue">💧 {weatherData.agroAdvisory.irrigationAdvice}</span>
          </div>
        </div>
      </div>

      {/* Hourly Timeline for Field Operations */}
      <div className="hourly-forecast-box glass-panel">
        <h3 className="subbox-title">Hourly Field Operation Window (Today)</h3>
        <div className="hourly-slider">
          {weatherData.hourly.map((hour, idx) => (
            <div key={idx} className="hourly-card">
              <span className="hour-time">{hour.time}</span>
              <span className="hour-temp">{hour.temp}°C</span>
              <div className="hour-specs">
                <span className="h-rain"><CloudRain size={12} /> {hour.rain}%</span>
                <span className="h-wind"><Wind size={12} /> {hour.wind}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Day Weather Forecast */}
      <div className="fiveday-forecast-box glass-panel">
        <h3 className="subbox-title">5-Day Agricultural Weather Outlook</h3>
        <div className="fiveday-cards-grid">
          {weatherData.forecast.map((f, idx) => (
            <div key={idx} className="day-forecast-card">
              <span className="forecast-day-name">{f.day}</span>
              <span className="forecast-date">{f.date}</span>
              <div className="forecast-icon-wrap">
                {f.icon === 'sun' ? <Sun size={32} className="icon-sun" /> :
                 f.icon === 'cloud-rain' ? <CloudRain size={32} className="icon-rain" /> :
                 <CloudSun size={32} className="icon-cloud" />}
              </div>
              <div className="day-temps">
                <span className="high-t">{f.maxTemp}°C</span>
                <span className="low-t">{f.minTemp}°C</span>
              </div>
              <span className="day-cond">{f.condition}</span>
              <div className="day-rain-prob">
                <Droplets size={12} />
                <span>{f.rainProb}% Rain</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
