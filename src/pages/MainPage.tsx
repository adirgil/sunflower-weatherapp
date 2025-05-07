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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { StringParam, useQueryParam } from "use-query-params";
import { point } from "@turf/helpers";
import distance from "@turf/distance";
import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const ContinentSelect = ({
  value,
  onChange,
  options,
}: {
  value: string | null | undefined;
  onChange: (val: string | undefined) => void;
  options: string[];
}) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        bg="white"
        boxShadow="inset 0 0 6px rgba(0, 0, 0, 0.3)"
        textAlign="left"
        w="200px"
      >
        <Text fontSize="sm">{value || "All Continents"}</Text>
      </MenuButton>
      <MenuList zIndex={10}>
        <MenuItem fontSize="sm" onClick={() => onChange(undefined)}>
          All
        </MenuItem>
        {options.map((continent) => (
          <MenuItem
            key={continent}
            fontSize="sm"
            onClick={() => onChange(continent)}
          >
            {continent}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

const userLocation = { lat: 32.0853, lng: 34.7818 }; // Tel Aviv

function MainPage() {
  console.log("Cities data:", cities);
  const navigate = useNavigate();
  const [search, setSearch] = useQueryParam("search", StringParam);
  const [sort, setSort] = useQueryParam("sort", StringParam);
  const [continent, setContinent] = useQueryParam("continent", StringParam);
  const [unit, setUnit] = useQueryParam("unit", StringParam);

  const MotionBox = motion(Box);

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
            .map(({ id, image, name, country, description }: City) => (
              <MotionBox
                w={[180, 250]}
                h={[180, 250]}
                p={6}
                borderRadius="md"
                key={id}
                boxShadow="dark-lg"
                bgImage={`url(${image})`}
                bgSize="cover"
                bgColor="blackAlpha.600"
                bgBlendMode="overlay"
                cursor="pointer"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 16px rgba(255, 255, 255, 0.4)",
                }}
                transition={{ type: "spring", stiffness: 150 }}
                onClick={() => {
                  navigate(`/city/${id}`);
                }}
              >
                <Text fontSize={["md", "2xl"]} color="white">
                  {name}
                </Text>
                <Text fontSize={["sm", "xl"]} color="white">
                  {country}
                </Text>
                <Text fontSize="xs" color="white" mt={2} noOfLines={[3, 0]}>
                  {description}
                </Text>
              </MotionBox>
            ))}
        </Box>
      )}
    </Flex>
  );
}
export default MainPage;
