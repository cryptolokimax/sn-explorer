import React from "react";
import { WorldMap, Stack, Box, Text } from "grommet";

const WorldMapComponent = ({ publicIp }) => {
  if (!publicIp) return (<></>);
  const { latitude, longitude, country } = publicIp;
  return (
    <Stack anchor="center">
      <WorldMap
        color="light-5"
        onSelectPlace={(lat, lon) => { }}
        places={[
          {
            name: "",
            location: [latitude, longitude],
            color: "accent-2",
            onClick: (name) => { },
          },
        ]}
        selectColor="accent-2"
      />
      <Box
        pad="medium"
        background={{ color: "white", opacity: "strong" }}
        border={{ color: "accent-2" }}
        round
      >
        <Text size="large" weight="bold">
          {country.country}
        </Text>
      </Box>
    </Stack>
  );
};

export default WorldMapComponent;
