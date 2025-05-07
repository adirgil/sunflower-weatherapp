import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";

export function ContinentSelect({
  value,
  onChange,
  options,
}: {
  value: string | null | undefined;
  onChange: (val: string | undefined) => void;
  options: string[];
}) {
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
}
