import React, { useEffect, useState } from "react";
import { BsThermometer, BsGeoAlt, BsClockHistory } from "react-icons/bs";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const ipResponse = await fetch("http://ip-api.com/json/");
        const ipData = await ipResponse.json();
        const cityName = ipData.city || "Karachi";
        const response = await fetch(`https://wttr.in/${cityName}?format=j1`);
        const weatherData = await response.json();

        setWeather({
          temp: weatherData.current_condition[0].temp_C,
          city: weatherData.nearest_area[0].areaName[0].value,
        });
      } catch (error) {
        setWeather({
          temp: "25",
          city: "Karachi",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 1800000);
    return () => clearInterval(interval);
  }, []);

  const getTemperatureColor = (temp) => {
    if (temp >= 35) return "text-red-500";
    if (temp >= 30) return "text-orange-500";
    if (temp >= 25) return "text-amber-500";
    if (temp >= 20) return "text-green-500";
    return "text-blue-500";
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700/50">
        <div className="size-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
          Loading...
        </span>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-md border border-blue-200 dark:border-blue-700/50 hover:shadow-md transition-all duration-200 group">
      {/* Temperature */}
      <div className="flex items-center gap-1">
        <BsThermometer
          className={`size-3 ${getTemperatureColor(
            weather.temp
          )} group-hover:animate-pulse`}
        />
        <span
          className={`text-xs font-bold ${getTemperatureColor(
            weather.temp
          )} font-mono`}
        >
          {weather.temp}°
        </span>
      </div>

      {/* Separator */}
      <div className="w-px h-2.5 bg-blue-300 dark:bg-blue-600"></div>

      {/* City */}
      <div className="flex items-center gap-1">
        <BsGeoAlt className="size-2.5 text-blue-600 dark:text-blue-400" />
        <span className="text-xs text-blue-700 dark:text-blue-300 font-medium truncate max-w-16">
          {weather.city}
        </span>
      </div>
    </div>
  );
};

export default WeatherWidget;
