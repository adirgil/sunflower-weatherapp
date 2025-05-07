import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { City } from "../types/City";

export function CityCard({ city }: { city: City }) {
  const MotionBox = motion(Box);
  const { id, name, country, description, image } = city;
  const navigate = useNavigate();

  return (
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
  );
}
