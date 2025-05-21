import React from "react";
import Map from "@/src/components/map/map";
import Spinner from "@/src/components/ui/Spinner";
import { useRouteMapData } from "@/src/hooks/useRouteMapData";

export default function RouteMapScreen() {
  const { points, title, isLoading } = useRouteMapData();

  if (isLoading || !points) {
    return <Spinner />;
  }

  return <Map title={title} points={points} />;
}
