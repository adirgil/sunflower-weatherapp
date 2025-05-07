import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, Text, Spinner, Flex, Button } from "@chakra-ui/react";
import { cities } from "../data/citiesData";
import { motion } from "framer-motion";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const CityDetailsPage = () => {
  const { cityId } = useParams();
  const [searchParams] = useSearchParams();
  const unit = searchParams.get("unit") || "c";

  const city = cities.find((c) => c.id.toString() === cityId);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const units = unit === "f" ? "imperial" : "metric";
  const symbol = unit === "f" ? "°F" : "°C";

  console.log("weather", weather);

  const MotionBox = motion(Box);

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
    <MotionBox
      p={6}
      bg="gray.50"
      borderRadius="md"
      boxShadow="lg"
      maxW="xl"
      m={10}
      textAlign="center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <Box mb={6}>
        <Button
          onClick={() => navigate(-1)}
          colorScheme="blue"
          variant="outline"
          size="sm"
        >
          ← Back to Cities
        </Button>
      </Box>
      <Text fontSize="3xl" mb={2}>
        Weather in {city.name}, {city.country}
      </Text>
      <Box mb={4}>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          style={{ margin: "0 auto" }}
        />
      </Box>
      <Text fontSize="4xl" fontWeight="bold" mb={1}>
        {Math.round(weather.main.temp)}
        {symbol}
      </Text>
      <Text fontSize="md" color="gray.600" textTransform="capitalize">
        {weather.weather[0].description}
      </Text>
      <Flex
        justify="space-around"
        align="center"
        mt={4}
        fontSize="sm"
        color="gray.600"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Text fontWeight="medium">Feels like</Text>
          <Text>
            {Math.round(weather.main.feels_like)}
            {symbol}
          </Text>
        </Box>
        <Box>
          <Text fontWeight="medium">Humidity</Text>
          <Text>{weather.main.humidity}%</Text>
        </Box>
        <Box>
          <Text fontWeight="medium">Wind</Text>
          <Text>{weather.wind.speed} m/s</Text>
        </Box>
      </Flex>
    </MotionBox>
  );
};

export default CityDetailsPage;
