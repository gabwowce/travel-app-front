import React from "react";
import { router } from "expo-router";
import CircleButton from "./CircleButton"; // <- path pasitikrink

type Props = {
  routeKey: string;
};

export default function FilterCircleButton({ routeKey }: Props) {
  return (
    <CircleButton
      variant="filter"
      onPress={() =>
        router.push({
          pathname: "/(app)/(modals)/filters",
          params: { from: routeKey },
        })
      }
    />
  );
}
