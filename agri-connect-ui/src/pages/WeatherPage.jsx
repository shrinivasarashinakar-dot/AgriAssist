import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = '0012b499ea158d52cd94850657755711'; // Replace with your actual API key

const WeatherPage = () => {
  const [location, setLocation] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const getBackgroundImage = (condition) => {
    if (!condition) return '/sunny.gif';
    const main = condition.toLowerCase();
    if (main.includes('rain')) return '/rain.gif';
    if (main.includes('cloud')) return '/cloudy.gif';
    if (main.includes('storm') || main.includes('thunder')) return '/storm.gif';
    return '/sunny.gif';
  };

  const fetchWeather = async (city) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      setError('');
    } catch (err) {
      setError('City not found');
      setWeather(null);
    }
  };

  useEffect(() => {
    const farmer = JSON.parse(localStorage.getItem('farmer'));
    if (farmer?.location) {
      setLocation(farmer.location);
      fetchWeather(farmer.location);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity);
    }
  };

  const bgImage = getBackgroundImage(weather?.weather?.[0]?.main);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: `url("${bgImage}")` }}
    >
      <div className="max-w-md mx-auto card-soft w-full p-6 shadow-soft">
        <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center">🌦️ Weather Report</h2>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter city name"
            className="input flex-1"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <button type="submit" className="btn-primary px-4">Search</button>
        </form>

        {error && <p className="alert-error text-center mb-4">{error}</p>}

        {weather && (
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-semibold text-green-900">📍 {weather.name}</h3>

            {weather.weather[0].icon && (
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="mx-auto"
              />
            )}

            <div className="text-xl font-medium text-slate-800">
              {weather.weather[0].main} - {weather.weather[0].description}
            </div>

            <div className="grid grid-cols-3 gap-3 text-slate-700 text-base mt-4">
              <div className="card p-3">
                🌡️ <strong>{weather.main.temp}°C</strong>
                <div className="text-xs text-slate-500">Feels like: {weather.main.feels_like}°C</div>
              </div>
              <div className="card p-3">
                💧 <strong>{weather.main.humidity}%</strong>
                <div className="text-xs text-slate-500">Humidity</div>
              </div>
              <div className="card p-3">
                💨 <strong>{weather.wind.speed} m/s</strong>
                <div className="text-xs text-slate-500">Wind Speed</div>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-600">
              🌅 Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}<br />
              🌇 Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherPage;
