import React from "react";
import { HStack, Badge } from "native-base";

type Category = {
  id?: number | string;
  name?: string;
  color?: string;
};

type Props = {
  categories?: Category[];
};

export default function CategoryBadges({ categories }: Props) {
  if (!categories || categories.length === 0) return null;

  return (
    <HStack flexWrap="wrap">
      {categories.map((c) => (
        <Badge
        accessible
  accessibilityRole="text"
  accessibilityLabel={`Category: ${c.name}`}
          key={c.id}
          bg={c.color ?? "primary.500"}
          _text={{ color: "white", fontSize: "xs" }}
          mr="2"
          mb="2"
        >
          {c.name}
        </Badge>
      ))}
    </HStack>
  );
}
