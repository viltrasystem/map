import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import rightSidePanelEn from "./../locales/en-US/translation-rightSidePanel.json";
import rightSidePanelNb from "./../locales/nb-NO/translation-rightSidePanel.json";
import landSelectorEn from "./../locales/en-US/translation-landSelector.json";
import landSelectorNb from "./../locales/nb-NO/translation-landSelector.json";
import mappingEn from "./../locales/en-US/translation-mapping.json";
import mappingNb from "./../locales/nb-NO/translation-mapping.json";
import drawModalEn from "./../locales/en-US/translation-drawModal.json";
import drawModalNb from "./../locales/nb-NO/translation-drawModal.json";
import landTableEn from "./../locales/en-US/translation-landTable.json";
import landTableNb from "./../locales/nb-NO/translation-landTable.json";
import landSummaryTableEn from "./../locales/en-US/translation-landSummaryTable.json";
import landSummaryTableNb from "./../locales/nb-NO/translation-landSummaryTable.json";
import landOwnersTableEn from "./../locales/en-US/translation-landOwnersTable.json";
import landOwnersTableNb from "./../locales/nb-NO/translation-landOwnersTable.json";
import ownerEn from "./../locales/en-US/translation-owner.json";
import ownerNb from "./../locales/nb-NO/translation-owner.json";
import commonEn from "./../locales/en-US/translation-common.json";
import commonNb from "./../locales/nb-NO/translation-common.json";
import landEn from "./../locales/en-US/translation-land.json";
import landNb from "./../locales/nb-NO/translation-land.json";

i18n
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en-US",
    lng: "nb-NO", // Default language
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    resources: {},
    ns: [
      "rightSidePanel",
      "landSelector",
      "drawModel",
      "mapping",
      "landTable",
      "landSummaryTable",
      "landOwnersTable",
      "owner",
      "common",
      "land",
    ], // Specify your custom namespace(s)
  });

i18n.addResourceBundle("en-US", "rightSidePanel", rightSidePanelEn);
i18n.addResourceBundle("en-US", "landSelector", landSelectorEn);
i18n.addResourceBundle("en-US", "drawModel", drawModalEn);
i18n.addResourceBundle("en-US", "mapping", mappingEn);
i18n.addResourceBundle("en-US", "landTable", landTableEn);
i18n.addResourceBundle("en-US", "landSummaryTable", landSummaryTableEn);
i18n.addResourceBundle("en-US", "landOwnersTable", landOwnersTableEn);
i18n.addResourceBundle("en-US", "owner", ownerEn);
i18n.addResourceBundle("en-US", "common", commonEn);
i18n.addResourceBundle("en-US", "land", landEn);

i18n.addResourceBundle("nb-NO", "rightSidePanel", rightSidePanelNb);
i18n.addResourceBundle("nb-NO", "mapping", mappingNb);
i18n.addResourceBundle("nb-NO", "landSelector", landSelectorNb);
i18n.addResourceBundle("nb-NO", "drawModel", drawModalNb);
i18n.addResourceBundle("nb-NO", "landTable", landTableNb);
i18n.addResourceBundle("nb-NO", "landSummaryTable", landSummaryTableNb);
i18n.addResourceBundle("nb-NO", "landOwnersTable", landOwnersTableNb);
i18n.addResourceBundle("nb-NO", "owner", ownerNb);
i18n.addResourceBundle("nb-NO", "common", commonNb);
i18n.addResourceBundle("nb-NO", "land", landNb);

// console.log(
//   "Resource bundles for en-US:",
//   i18n.getResourceBundle("en-US", "rightSidePanel")
// );

export default i18n;

//to use translations as below in component the name space "rightSidePanel" need to be add to i18n.ts fil name spaces otehrwise default name space "translation" need to be used
//import translationsEn from "../locales/en-US/translation-rightSidePanel.json";
//import translationsNo from "../locales/nb-NO/translation-rightSidePanel.json";
// i18n.addResourceBundle("en-US", "rightSidePanel", translationsEn);
// i18n.addResourceBundle("nb-NO", "rightSidePanel", translationsNo);

//in  public\locales\nb-NO, public\locales\en-US are can be accesible using t("key") in that files it is default
