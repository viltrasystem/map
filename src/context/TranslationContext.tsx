import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import i18n from "../services/i18n"; // Import the i18n instance
import Cookies from "js-cookie";

// Define the shape of the context
interface TranslationContextProps {
  language: string;
  changeLanguage: (newLanguage: string) => void;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(
  undefined
);

interface TranslationProviderPros {
  children: ReactNode;
}

export const TranslationProvider = ({
  children,
}: TranslationProviderPros): JSX.Element => {
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (newLanguage: string): void => {
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
    Cookies.set("userLanguage", newLanguage, {
      sameSite: "None",
      secure: true,
    });
  };

  useEffect(() => {
    const userLanguage =
      Cookies.get("userLanguage") || navigator.language || "en-US";
    changeLanguage(userLanguage);
  }, []);

  return (
    <TranslationContext.Provider value={{ language, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
