import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { cities } from "../data/citiesData";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const CityDetailsPage = () => {
  const { cityId } = useParams();
  const [searchParams] = useSearchParams();
  const unit = searchParams.get("unit") || "c";

  const city = cities.find((c) => c.id.toString() === cityId);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const units = unit === "f" ? "imperial" : "metric";
  const symbol = unit === "f" ? "°F" : "°C";

  console.log("weather", weather);

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&units=${units}&appid=${API_KEY}`
        );

        if (!response.ok) throw new Error("Weather fetch failed");

        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, units]);

  if (!city) return <Text>City not found</Text>;
  if (loading) return <Spinner />;

  return (
    <Box p={6}>
      <Text fontSize="3xl" mb={2}>
        Current Weather in {city.name}, {city.country}
      </Text>

      <Text fontSize="xl">
        {weather.weather[0].description} — {weather.main.temp}
        {symbol}
      </Text>

      <Text fontSize="sm" mt={2}>
        Feels like: {weather.main.feels_like}
        {symbol}
      </Text>

      <Text fontSize="sm" mt={1}>
        Humidity: {weather.main.humidity}%
      </Text>

      <Text fontSize="sm" mt={1}>
        Wind: {weather.wind.speed} m/s
      </Text>
    </Box>
  );
};

export default CityDetailsPage;
