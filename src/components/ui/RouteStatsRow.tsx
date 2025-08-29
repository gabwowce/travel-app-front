import StatChip from "@/src/components/ui/StatChip";
import { HStack } from "native-base";
import React from "react";

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
        accessibilityLabel={
          isValidDistance
            ? `Distance: ${parsedDistance.toFixed(1)} kilometers`
            : "Distance unknown"
        }
      />
      <StatChip
        icon="area-chart"
        label={elevation ? `${elevation} m ↑` : "–"}
        accessibilityLabel={
          elevation
            ? `Elevation gain: ${elevation} meters`
            : "Elevation unknown"
        }
      />
      <StatChip
        icon="road"
        label={difficulty ?? "–"}
        accessibilityLabel={
          difficulty ? `Difficulty: ${difficulty}` : "Difficulty unknown"
        }
      />
      <StatChip
        icon="clock-o"
        label={estimated_time ?? "–"}
        accessibilityLabel={
          estimated_time
            ? `Estimated time: ${estimated_time}`
            : "Estimated time unknown"
        }
      />
    </HStack>
  );
}
