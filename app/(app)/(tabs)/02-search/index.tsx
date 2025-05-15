import React, { useMemo, useState } from 'react';
import {
  Box,
  Text,
  FlatList,
  Spinner,
  ScrollView,
  IconButton,
} from 'native-base';
import {TouchableWithoutFeedback, Keyboard} from "react-native"
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { skipToken } from '@reduxjs/toolkit/query';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import Header from '@/src/components/Header';
import SearchBar from '@/src/components/SearchBar';
import MiniTourCard from '@/src/components/MiniTourCard';
import FlexContainer from '@/src/components/layout/FlexContainer';

import { useAppDispatch, useAppSelector } from '@/src/data/hooks';
import { clearFilters } from '@/src/data/features/filters/filtersSlice';
import { useGetRoutesQuery } from '@/src/store/travelApi';

export default function SearchScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  /* --- local search state --- */
  const [searchTerm, setSearchTerm] = useState('');

  /* --- global filters --- */
  const { filters } = useAppSelector((st) => st.filters);

  /* --- compose query params for RTK Query --- */
  const queryParams = useMemo(() => {
    if (searchTerm.length < 3 && !filters) return skipToken;

    return {
      ...(searchTerm.length >= 3 ? { search: searchTerm } : {}),
      ...(filters ?? {}),
    };
  }, [searchTerm, filters]);

  /* --- RTK Query hook --- */
  const {
    data: routeRes,
    isLoading,
    isFetching,
    isError,
  } = useGetRoutesQuery(queryParams, { refetchOnFocus: true });

  const routes = routeRes?.data ?? [];
  const isEmptyResults = !isLoading && !routes.length;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView keyboardShouldPersistTaps="handled" style={{ backgroundColor: '#FFF' }}>
        <FlexContainer gap={16}>
          <Header
            title="Search"
          />

          <SearchBar
            placeholder="Search Tours"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onClear={() => setSearchTerm('')}
          />

          {/* Informacinė juosta arba spinneris */}
          {searchTerm.length < 3 && !filters ? (
            <Text color="gray.400" textAlign="center">
              Type to search...
            </Text>
          ) : isLoading ? (
            <Box alignItems="center" py="20px">
              <Spinner size="lg" color="primary.500" />
            </Box>
          ) : isError ? (
            <Text color="red.500" textAlign="center">
              Error loading routes.
            </Text>
          ) : isEmptyResults ? (
            <Text color="gray.500" textAlign="center">
              No results found.
            </Text>
          ) : (
            <FlatList
              data={routes}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between', gap: wp('1%') }}
              contentContainerStyle={{ gap: wp('1%'), marginHorizontal: wp('3%') }}
              renderItem={({ item }) => <MiniTourCard tour={item} />}
              scrollEnabled={false}
            />
          )}

          {/* „Clear filters“ mygtukas */}
          {filters && (
            <Text
              style={{ textAlign: 'center', color: 'blue' }}
              onPress={() => dispatch(clearFilters())}
            >
              Clear filters ✕
            </Text>
          )}
        </FlexContainer>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
