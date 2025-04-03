import React, { useState, useRef } from "react";
import { TouchableWithoutFeedback, Keyboard, FlatList } from "react-native";
import { Box, HStack, Text, IconButton, CloseIcon } from "native-base";
import ScreenContainer from "@/src/components/ScreenContainer";
import Header from "@/src/components/Header";
import SearchBar from "@/src/components/SearchBar";
import Button from "@/src/components/btns/Button";
import { useAppDispatch } from "@/src/data/hooks";
import { resetTour } from "@/src/data/features/tours/tourSlice";
import { useRouter } from "expo-router";

interface SelectableListScreenProps {
  title: string;
  data: { id: number; name: string; [key: string]: any }[];
  selectedItem: string | null;
  setSelectedItem: (item: { id: number; name: string }) => void;
  loading: boolean;
  error: string | null;
  onBackPress: () => void;
  onNextPress: () => void;
  renderIcon?: (item: any) => React.ReactNode;
  showCloseButton?: boolean;
}

const SelectableListScreen: React.FC<SelectableListScreenProps> = ({
  title,
  data,
  selectedItem,
  setSelectedItem,
  loading,
  error,
  onBackPress,
  onNextPress,
  renderIcon,
  showCloseButton = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const listRef = useRef<FlatList<any>>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const handleSelect = (item: { id: number; name: string }) => {
    setSelectedItem(item);

    const index = filteredData.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({ index, viewPosition: 0.5 });
      }, 100);
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScreenContainer variant="top">
        <Header
          title={title}
          onBackPress={onBackPress}
         
        />

        <SearchBar
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onClear={() => setSearchTerm("")}
        />

        <Box flex={1} justifyContent="space-between">
          <Box flex={1} pb={10}>
            <FlatList
              ref={listRef}
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => handleSelect(item)}>
                  <HStack
                    alignItems="center"
                    space={3}
                    px={3}
                    py={2}
                    borderWidth={selectedItem === item.name ? 2 : 1}
                    borderColor={selectedItem === item.name ? "#001F3F" : "#D1D5DB"}
                    borderRadius={10}
                    p={3}
                    mb={2}
                  >
                    {renderIcon && renderIcon(item)}
                    <Text>{item.name}</Text>
                  </HStack>
                </TouchableWithoutFeedback>
              )}
              keyboardShouldPersistTaps="handled"
            />
          </Box>

          {selectedItem && (
            <Box pb="60px">
              <Button label="Next" onPress={onNextPress} theme="primary" />
            </Box>
          )}
        </Box>
      </ScreenContainer>
    </TouchableWithoutFeedback>
  );
};

export default SelectableListScreen;
