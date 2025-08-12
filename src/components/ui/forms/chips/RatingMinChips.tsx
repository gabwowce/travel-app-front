import React from "react";
import { Wrap } from "native-base";
import Chip from "./Chip";

const OPTIONS: (number | undefined)[] = [undefined, 3, 3.5, 4, 4.5, 5];

export default function RatingMinChips({
  value,
  onChange,
}: {
  value?: number;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <Wrap direction="row" space={2} alignItems="center">
      {OPTIONS.map((opt, i) => {
        const label = opt === undefined ? "Any" : `${opt}+`;
        return (
          <Chip
            key={i}
            label={label}
            isActive={
              value === opt || (opt === undefined && value === undefined)
            }
            onPress={() => onChange(opt)}
            ariaLabel={`Minimum rating ${label}`}
          />
        );
      })}
    </Wrap>
  );
}
