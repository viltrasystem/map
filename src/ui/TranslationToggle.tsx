import { useTranslation } from "../context/TranslationContext";
import { US, NO } from "country-flag-icons/react/3x2";
import IconButton, { IconClasses } from "./IconButton";

const TranslationToggle = () => {
  const { language, changeLanguage } = useTranslation();
  const iconOpacity: IconClasses = {
    opacity: "opacity-50",
  };
  const iconClasses: IconClasses = {};

  const changeEnglishLanguage = () => {
    changeLanguage("en-US");
  };

  const changeNorwagianLanguage = () => {
    changeLanguage("nb-NO");
  };

  return (
    <>
      <IconButton
        onClick={changeNorwagianLanguage}
        classes={language === "nb-NO" ? iconClasses : iconOpacity}
      >
        <NO title="Norway" className="w-8 h-8" />
      </IconButton>
      <IconButton
        onClick={changeEnglishLanguage}
        classes={language === "en-US" ? iconClasses : iconOpacity}
      >
        <US title="United States" className="w-8 h-8" />
      </IconButton>
    </>
  );
};

export default TranslationToggle;
