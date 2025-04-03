import React, { createContext, useContext, useState } from "react";

type TourStepData = {
  country?: string;
  city?: string;
  category?: string;
};

type ContextType = {
  data: TourStepData;
  setData: (newData: Partial<TourStepData>) => void;
  reset: () => void;
};

const TourContext = createContext<ContextType | null>(null);

export const CreateTourProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setDataState] = useState<TourStepData>({});

  const setData = (newData: Partial<TourStepData>) => {
    setDataState((prev) => ({ ...prev, ...newData }));
  };

  const reset = () => setDataState({});

  return <TourContext.Provider value={{ data, setData, reset }}>{children}</TourContext.Provider>;
};

export const useCreateTour = () => {
  const context = useContext(TourContext);
  if (!context) throw new Error("useCreateTour must be used within CreateTourProvider");
  return context;
};
