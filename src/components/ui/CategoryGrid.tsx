import { Category } from "@/src/api/generated/models/Category";
import { Box, Text, Wrap } from "native-base";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import PressableLog from "../PressableLog";

export default function CategoryGrid({
  categories,
  onPress,
}: {
  categories: Category[];
  onPress: (cat: Category) => void;
}) {
  return (
    <Wrap direction="row" justify="flex-start">
      {categories.map((cat) => (
        <PressableLog
          accessibilityRole="button"
          analyticsLabel={`Category: ${cat.name}`}
          accessibilityLabel={`Category: ${cat.name}`}
          focusable
          key={cat.id}
          onPress={() => onPress(cat)}
        >
          {({ isPressed }) => (
            <Box
              px={4}
              py={2}
              m={1}
              borderRadius="full"
              bg={isPressed ? "primary.200" : "#FFFCF9"}
              maxW={wp("40%")}
              transform={[{ scale: isPressed ? 0.98 : 1 }]}
              shadow={isPressed ? 1 : 0}
            >
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="primary.800"
                textAlign="center"
                numberOfLines={1}
              >
                {cat.name}
              </Text>
            </Box>
          )}
        </PressableLog>
      ))}
    </Wrap>
  );
}
