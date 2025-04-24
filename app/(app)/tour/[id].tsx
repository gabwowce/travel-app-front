import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAppDispatch ,useAppSelector} from "@/src/data/hooks";
import { Box, Spinner, Text } from "native-base";
import Map from "@/src/components/map/map";
import { fetchRoutePlaces } from "@/src/data/features/routes/routesThunks";
import { fetchRouteById } from "@/src/data/features/routes/routesThunks";

export interface TourPoint {
  id: string;
  title: string;
  coords: {
    latitude: number;
    longitude: number;
  };
  url: string;
  address: string;
  category?: "museum" | "nature" | "food";
  description: string;
}

const fakePoints: TourPoint[] = [
  {
    id: "1",
    title: "Gedimino pilis",
    coords: { latitude: 54.6869, longitude: 25.2896 },
    url: "https://lt.wikipedia.org/wiki/Gedimino_pilis",
    address: "Arsenalo g. 5, Vilnius",
    category: "museum",
    description: "Vienas svarbiausių Lietuvos simbolių. Pilies bokštas siūlo puikius vaizdus į Senamiestį ir Neries pakrantę. Vienas svarbiausių Lietuvos simbolių. Pilies bokštas siūlo puikius vaizdus į Senamiestį ir Neries pakrantę. Vienas svarbiausių Lietuvos simbolių. Pilies bokštas siūlo puikius vaizdus į Senamiestį ir Neries pakrantę."
  },
  {
    id: "2",
    title: "Katedros aikštė",
    coords: { latitude: 54.6862, longitude: 25.2871 },
    url: "https://vilnius-tourism.lt/lankytinos-vietos/katedros-aikste/",
    address: "Katedros a., Vilnius",
    category: "museum",
    description: "Vilniaus širdis – vieta renginiams, pasivaikščiojimams ir istorijos pažinimui. Aikštę supa svarbiausi miesto pastatai."
  },
  {
    id: "3",
    title: "Vilniaus universitetas",
    coords: { latitude: 54.6828, longitude: 25.2896 },
    url: "https://www.vu.lt",
    address: "Universiteto g. 3, Vilnius",
    category: "museum",
    description: "Vienas seniausių universitetų Rytų Europoje, garsėjantis savo kiemeliais, freskomis ir akademine dvasia."
  },
  {
    id: "4",
    title: "Aušros Vartai",
    coords: { latitude: 54.6756, longitude: 25.2924 },
    url: "https://lt.wikipedia.org/wiki/Aušros_Vartai",
    address: "Aušros Vartų g. 14, Vilnius",
    category: "museum",
    description: "Šventovė ir istoriniai vartai, garsėjantys stebuklingu Marijos paveikslu, traukiantys tiek turistus, tiek maldininkus."
  },
  {
    id: "5",
    title: "MO Muziejus",
    coords: { latitude: 54.6767, longitude: 25.2800 },
    url: "https://mo.lt",
    address: "Pylimo g. 17, Vilnius",
    category: "museum",
    description: "Modernus menas pačiame Vilniaus centre. Pastato architektūra bei parodos traukia šiuolaikinio meno mėgėjus."
  },
  {
    id: "6",
    title: "Bernardinų sodas",
    coords: { latitude: 54.6851, longitude: 25.2962 },
    url: "https://vilnius-tourism.lt/lankytinos-vietos/bernardinu-sodas/",
    address: "B. Radvilaitės g. 8A, Vilnius",
    category: "nature",
    description: "Istorinis parkas šalia Vilnelės – puiki vieta pasivaikščioti, pailsėti ar atvykti su vaikais."
  },
  {
    id: "7",
    title: "Operos ir baleto teatras",
    coords: { latitude: 54.6894, longitude: 25.2767 },
    url: "https://opera.lt",
    address: "A. Vienuolio g. 1, Vilnius",
    category: "museum",
    description: "Pagrindinė klasikinės muzikos ir šokio scena Lietuvoje, siūlanti aukščiausio lygio spektaklius."
  },
  {
    id: "8",
    title: "Vingio parkas",
    coords: { latitude: 54.6808, longitude: 25.2486 },
    url: "https://vilnius-tourism.lt/lankytinos-vietos/vingio-parkas/",
    address: "M. K. Čiurlionio g. 100, Vilnius",
    category: "nature",
    description: "Didžiulis žalias parkas, tinkamas sportui, pasivaikščiojimams ir koncertams. Viena mėgstamiausių vilniečių vietų."
  },
  {
    id: "9",
    title: "Televizijos bokštas",
    coords: { latitude: 54.6822, longitude: 25.2133 },
    url: "https://www.tvbokstas.lt/",
    address: "Sausio 13-osios g. 10, Vilnius",
    category: "museum",
    description: "Aukščiausias pastatas Lietuvoje su besisukančiu restoranu ir apžvalgos aikštele. Simbolinė vieta Sausio 13-osios istorijoje."
  },
  {
    id: "10",
    title: "Lukiškių kalėjimas 2.0",
    coords: { latitude: 54.6891, longitude: 25.2757 },
    url: "https://www.lukiskiukalejimas.lt/",
    address: "Lukiškių skg. 6, Vilnius",
    category: "museum",
    description: "Buvęs kalėjimas, dabar – kultūros ir meno erdvė. Įspūdinga atmosfera su ekskursijomis ir renginiais."
  },
  {
    id: "11",
    title: "Televizijos bokštas",
    coords: { latitude: 54.1822, longitude: 25.2133 },
    url: "https://www.tvbokstas.lt/",
    address: "Sausio 13-osios g. 10, Vilnius (tolimesnis taškas)",
    category: "museum",
    description: "Aukštai nuo miesto šurmulio – vieta su istorija ir panoraminiais vaizdais. Lankytina ir nuošalesnė versija."
  },
  {
    id: "12",
    title: "Lukiškių kalėjimas 2.0",
    coords: { latitude: 54.6891, longitude: 25.1757 },
    url: "https://www.lukiskiukalejimas.lt/",
    address: "Lukiškių skg. 6, Vilnius (kita lokacija)",
    category: "museum",
    description: "Alternatyvi Lukiškių kalėjimo lokacija – urbanistinė, eksperimentinė, skirta performansams ir kūrybai."
  },
];




export default function TourDetails() {
  const { id, title, image, rating, location } = useLocalSearchParams();
  const routeId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id ?? "");

  const dispatch = useAppDispatch();
  const [points, setPoints] = useState<TourPoint[]>([]);
  const loading = useAppSelector((state)=> state.routes.loading);

  useEffect(() => {
    if (routeId) {
      dispatch(fetchRoutePlaces(routeId))
        .unwrap()
        .then((places) => {
          const mapped = places.map((place: any) => ({
            id: String(place.id),
            title: place.name,
            coords: {
              latitude: parseFloat(place.latitude),
              longitude: parseFloat(place.longitude),
            },
            url: place.media?.[0]?.url ?? "",
          }));
          setPoints(mapped);
        })
        .catch((err) => console.log("Klaida gaunant taškus:", err))
    }
  }, [routeId]);

  // if (loading) return <Spinner mt="10" />;

  return (
    <Map
      title={title as string ?? "Tour"}
      points={fakePoints}
    />
  );
}


