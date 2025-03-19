import React, { useState } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Box, HStack, Text } from "native-base";
import ScreenContainer from "@/src/components/ScreenContainer";
import Header from "@/src/components/Header";
import SearchBar from "@/src/components/SearchBar";
import SelectableList from "@/src/components/SelectableList";
import Button from "@/src/components/btns/Button";

interface SelectableListScreenProps {
  title: string;
  data: { id: number; name: string }[];
  selectedItem: string | null;
  setSelectedItem: (item: { id: number; name: string }) => void;
  loading: boolean;
  error: string | null;
  onBackPress: () => void;
  onNextPress: () => void;
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
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScreenContainer variant="top">
        <Header title={title} onBackPress={onBackPress} />

        <SearchBar
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onClear={() => setSearchTerm("")}
        />

        <Box flex={1} justifyContent="space-center">
          <Box flex={1} pb={10}>
            <SelectableList
              title=""
              data={filteredData}
              loading={loading}
              error={error}
              renderItem={(item) => (
                <HStack
                  alignItems="center"
                  space={3}
                  px={3}
                  py={2}
                  borderWidth={selectedItem === item.name ? 2 : 1}
                  borderColor={selectedItem === item.name ? "#001F3F" : "#D1D5DB"}
                  borderRadius={10}
                  p={3}
                >
                  <Text>{item.name}</Text>
                </HStack>
              )}
              onSelect={setSelectedItem}
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
