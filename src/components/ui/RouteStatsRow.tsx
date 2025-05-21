import React from "react";
import { HStack } from "native-base";
import StatChip from "@/src/components/ui/StatChip";

type Props = {
  distance?: number | string;
  elevation?: number | string;
  difficulty?: string;
  estimated_time?: string;
};

export default function RouteStatsRow({
  distance,
  elevation,
  difficulty,
  estimated_time,
}: Props) {
  const parsedDistance = Number(distance);
  const isValidDistance = !isNaN(parsedDistance);

  return (
    <HStack flexWrap="wrap">
      <StatChip
        icon="map-marker"
        label={isValidDistance ? `${parsedDistance.toFixed(1)} km` : "–"}
      />
      <StatChip
        icon="area-chart"
        label={elevation ? `${elevation} m ↑` : "–"}
      />
      <StatChip icon="road" label={difficulty ?? "–"} />
      <StatChip icon="clock-o" label={estimated_time ?? "–"} />
    </HStack>
  );
}
