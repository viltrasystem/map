import { ReactNode, createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/UseLocalStorageState";

interface DarkModeContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps | undefined>(
  undefined
);

interface DarkModeProviderPros {
  children: ReactNode;
}

const DarkModeProvider = ({ children }: DarkModeProviderPros): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage(
    window.matchMedia("(prefers-color-scheme:dark)").matches,
    "isDarkMode"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((isDark) => !isDark);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

const useDarkMode = () => {
  // custom hook directly consume context
  const context = useContext(DarkModeContext);
  if (context === undefined)
    throw new Error("DarkModeContext was used out side of DarkModeContext");

  return context;
};

export { DarkModeProvider, useDarkMode };
