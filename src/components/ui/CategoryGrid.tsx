// src/components/ui/CategoryGrid.tsx
import { Box, Pressable, Text, Wrap } from "native-base";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Category } from "@/src/api/generated/models/Category";

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
        <Pressable
          key={cat.id}
          onPress={() => onPress(cat)}
          _pressed={{ bg: "primary.200" }}
        >
          <Box
            px={4}
            py={2}
            m={1}
            borderRadius="full"
            bg="primary.100"
            maxW={wp("40%")}
          >
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="primary.800"
              textAlign="center"
            >
              {cat.name}
            </Text>
          </Box>
        </Pressable>
      ))}
    </Wrap>
  );
}
