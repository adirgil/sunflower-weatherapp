import React, { useMemo } from "react";
import { cities, City } from "../data/citiesData";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { StringParam, useQueryParam } from "use-query-params";
import { point } from "@turf/helpers";
import distance from "@turf/distance";
import { CloseIcon } from "@chakra-ui/icons";

const userLocation = { lat: 32.0853, lng: 34.7818 }; // Tel Aviv

function MainPage() {
  console.log("Cities data:", cities);
  const navigate = useNavigate();
  const [search, setSearch] = useQueryParam("search", StringParam);
  const [sort, setSort] = useQueryParam("sort", StringParam);
  const [continent, setContinent] = useQueryParam("continent", StringParam);
  const [unit, setUnit] = useQueryParam("unit", StringParam);

  const tempUnit = unit || "c";

  const allContinents = useMemo(() => {
    return Array.from(new Set(cities.map((c) => c.continent)));
  }, []);

  const filteredCities = useMemo(() => {
    const query = (search || "").toLowerCase();

    let result = cities.filter(
      (city) =>
        (city.name.toLowerCase().includes(query) ||
          city.country.toLowerCase().includes(query)) &&
        (!continent || city.continent === continent)
    );

    if (sort === "country") {
      result.sort((a, b) => a.country.localeCompare(b.country));
    } else if (sort === "distance") {
      const from = point([userLocation.lng, userLocation.lat]);
      result.sort((a, b) => {
        const distA = distance(from, point([a.coords.lng, a.coords.lat]));
        const distB = distance(from, point([b.coords.lng, b.coords.lat]));
        return distA - distB;
      });
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [search, sort, continent]);

  return (
    <Flex p={10} flexDir="column" gap={8}>
      <Flex gap={8}>
        <Flex flexDir="column" gap={2}>
          <Text>Search</Text>
          <InputGroup minW={300}>
            <Input
              placeholder="search by name or country..."
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
              bg="white"
              boxShadow="inset 0 0 6px rgba(0, 0, 0, 0.3)"
            />
            {search && (
              <InputRightElement>
                <IconButton
                  aria-label="Clear search"
                  icon={<CloseIcon boxSize={2} color="white" />}
                  w="20px"
                  h="20px"
                  minW="unset"
                  borderRadius="full"
                  bg="black"
                  _hover={{ bg: "gray.700" }}
                  onClick={() => setSearch(undefined)}
                />
              </InputRightElement>
            )}
          </InputGroup>
        </Flex>
        <Flex flexDir="column" gap={2}>
          <Text>Continent</Text>
          <Select
            value={continent || ""}
            onChange={(e) => setContinent(e.target.value || undefined)}
            maxW="200px"
            mb={6}
            bg="white"
            placeholder="All"
            boxShadow="inset 0 0 6px rgba(0, 0, 0, 0.3)"
          >
            {allContinents.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Flex>
        <Flex flexDir="column" gap={2}>
          <Text>Sort by</Text>
          <ButtonGroup size="md" isAttached variant="outline">
            <Button
              onClick={() => setSort("name")}
              variant={sort === "name" || !sort ? "solid" : "outline"}
            >
              Name
            </Button>
            <Button
              onClick={() => setSort("distance")}
              variant={sort === "distance" ? "solid" : "outline"}
            >
              Distance
            </Button>
          </ButtonGroup>
        </Flex>
        <Flex flexDir="column" gap={2}>
          <Text>Unit</Text>
          <ButtonGroup size="md" isAttached variant="outline">
            <Button
              onClick={() => setUnit("c")}
              variant={tempUnit === "c" ? "solid" : "outline"}
            >
              °C
            </Button>
            <Button
              onClick={() => setUnit("f")}
              variant={tempUnit === "f" ? "solid" : "outline"}
            >
              °F
            </Button>
          </ButtonGroup>
        </Flex>
      </Flex>
      {!filteredCities.length ? (
        <Box fontSize="2xl">No Cities Found!</Box>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={8}>
          {filteredCities
            .filter((city) => city.active)
            .map(({ id, image, name, country, description }: City) => (
              <Box
                w={60}
                h={60}
                p={6}
                borderRadius="md"
                key={id}
                boxShadow="dark-lg"
                bgImage={`url(${image})`}
                bgSize="cover"
                bgColor="blackAlpha.600"
                bgBlendMode="overlay"
                cursor="pointer"
                onClick={() => {
                  navigate(`/city/${id}`);
                }}
              >
                <Text fontSize="2xl" color="white">
                  {name}
                </Text>
                <Text fontSize="xl" color="white">
                  {country}
                </Text>
                <Text fontSize="xs" color="white" mt={2}>
                  {description}
                </Text>
              </Box>
            ))}
        </Box>
      )}
    </Flex>
  );
}
export default MainPage;
