// src/components/ui/notify/toast.ts
import { MaterialIcons } from "@expo/vector-icons";
import { Box, HStack, Icon, Slide, Text, Toast } from "native-base";
import PressableLog from "../../PressableLog";

type ToastStatus = "success" | "error" | "warning" | "info";

const palette: Record<ToastStatus, { bg: string; bar: string; icon: string }> =
  {
    success: { bg: "white", bar: "emerald.500", icon: "check-circle-outline" },
    error: { bg: "white", bar: "red.500", icon: "error-outline" },
    warning: { bg: "white", bar: "amber.500", icon: "warning-amber" },
    info: { bg: "white", bar: "blue.500", icon: "info-outline" },
  };

export function showToast({
  title,
  status = "success",
  description = "",
}: {
  title: string;
  status?: ToastStatus;
  description: string;
}) {
  Toast.show({
    placement: "top",
    duration: 5000,
    render: ({ id }) => (
      <Slide in placement="top" duration={600} pt={16}>
        <Box
          shadow={3}
          rounded="lg"
          bg={palette[status].bg}
          overflow="hidden"
          mx={4}
        >
          {/* kairioji spalvota juosta */}
          <Box w={1.5} bg={palette[status].bar} position="absolute" h="100%" />
          <HStack space={3} alignItems="center" px={4} py={3}>
            <Icon
              as={MaterialIcons}
              name={palette[status].icon}
              color={palette[status].bar}
              size="md"
            />

            <Box flex={1}>
              <Text fontWeight="bold" color="gray.800">
                {title}
              </Text>
              {!!description && (
                <Text fontSize="xs" color="gray.500">
                  {description}
                </Text>
              )}
            </Box>

            {/* uždarymo X */}
            <PressableLog
              analyticsLabel="Close notification"
              onPress={() => Toast.close(id)}
              accessibilityLabel="Close notification"
              hitSlop={8}
            >
              <Icon
                as={MaterialIcons}
                name="close"
                size="sm"
                color="gray.500"
              />
            </PressableLog>
          </HStack>
        </Box>
      </Slide>
    ),
  });
}
