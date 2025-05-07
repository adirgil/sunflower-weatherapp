import React, { useMemo } from "react";
import { cities } from "../data/citiesData";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { StringParam, useQueryParam } from "use-query-params";
import { point } from "@turf/helpers";
import distance from "@turf/distance";
import { CloseIcon } from "@chakra-ui/icons";
import { ContinentSelect } from "../components/ContinentSelect";
import { CityCard } from "../components/CityCard";
import { City } from "../types/City";

const userLocation = { lat: 32.0853, lng: 34.7818 }; // Tel Aviv

function MainPage() {
  console.log("Cities data:", cities);
  const [search, setSearch] = useQueryParam("search", StringParam);
  const [sort, setSort] = useQueryParam("sort", StringParam);
  const [continent, setContinent] = useQueryParam("continent", StringParam);
  const [unit, setUnit] = useQueryParam("unit", StringParam);

  const tempUnit = unit || "c";

  const allContinents: string[] = useMemo(() => {
    return Array.from(new Set(cities.map((c) => c.continent)));
  }, []);

  const filteredCities: City[] = useMemo(() => {
    const query = (search || "").toLowerCase();

    let result = cities.filter(
      (city) =>
        (city.name.toLowerCase().includes(query) ||
          city.country.toLowerCase().includes(query)) &&
        (!continent || city.continent === continent)
    );

    if (sort === "distance") {
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
    <Flex p={[2, 10]} flexDir="column" gap={8}>
      <Flex gap={8} flexDir={["column", "row"]} align="flex-start">
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
          <ContinentSelect
            value={continent}
            onChange={(val) => setContinent(val)}
            options={allContinents}
          />
        </Flex>
        <Flex gap={8}>
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
      </Flex>
      {!filteredCities.length ? (
        <Box fontSize="2xl">No Cities Found!</Box>
      ) : (
        <Box
          display="flex"
          flexWrap="wrap"
          gap={[4, 8]}
          justifyContent={["center", "flex-start"]}
        >
          {filteredCities
            .filter((city) => city.active)
            .map((city: City) => (
              <CityCard city={city} key={city.id} />
            ))}
        </Box>
      )}
    </Flex>
  );
}
export default MainPage;
