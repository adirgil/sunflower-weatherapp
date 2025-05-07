import { StringParam, useQueryParam } from "use-query-params";
import { City, UseCityFiltersOptions } from "../types/City";
import { useMemo } from "react";
import { point } from "@turf/helpers";
import distance from "@turf/distance";

const userLocation = { lat: 32.0853, lng: 34.7818 }; // Tel Aviv

export function useCityFilters(
  cities: City[],
  options?: UseCityFiltersOptions
) {
  const [search, setSearch] = useQueryParam("search", StringParam);
  const [sort, setSort] = useQueryParam("sort", StringParam);
  const [continent, setContinent] = useQueryParam("continent", StringParam);

  const onlyActive = options?.onlyActive !== false;

  const allContinents = useMemo(() => {
    return Array.from(new Set(cities.map((c) => c.continent)));
  }, [cities]);

  const filteredCities = useMemo(() => {
    const query = (search || "").toLowerCase();

    let result = cities.filter(
      (city) =>
        (city.name.toLowerCase().includes(query) ||
          city.country.toLowerCase().includes(query)) &&
        (!continent || city.continent === continent)
    );

    if (onlyActive) {
      result = result.filter((city) => city.active);
    }

    if (sort === "distance") {
      const from = point([userLocation.lng, userLocation.lat]); //User Location Static (Tel Aviv), can be dynamic.
      result.sort((a, b) => {
        const distA = distance(from, point([a.coords.lng, a.coords.lat]));
        const distB = distance(from, point([b.coords.lng, b.coords.lat]));
        return distA - distB;
      });
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [search, sort, continent, cities, onlyActive]);

  return {
    search,
    setSearch,
    sort,
    setSort,
    continent,
    setContinent,
    allContinents,
    filteredCities,
  };
}
