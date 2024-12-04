import React, { ReactNode, createContext, useContext } from "react";
import { MapWrapperRef } from "../features/map/MapWrapper";

interface PrintInfo {
  title: string;
}

interface AppContextProps {
  handleSidebarToggle: (isVisible: boolean) => void;
  handlePrintMap: (arg: PrintInfo) => void;
  mapWrapperRef: React.RefObject<MapWrapperRef>;
}

interface AppProviderProps {
  value: AppContextProps;
  children: ReactNode;
}
const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<AppProviderProps> = ({
  value,
  children,
}) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
