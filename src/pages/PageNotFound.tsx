import DarkModeToggle from "../ui/DarkModeToggle";
import TranslationToggle from "../ui/TranslationToggle";
import { useTranslation } from "react-i18next";
import { TbError404 } from "react-icons/tb";
import { GiDeer } from "react-icons/gi";

const PageNotFound = () => {
  const { t } = useTranslation();

  return (
    <div>
      <main className="modal  h-fit fixed inset-0 flex m-auto content-center justify-center items-center z-50">
        <section className="bg-neutral-100 max-w-5xl">
          <div className="flex h-full flex-wrap items-start justify-center text-neutral-800 font-light">
            <div className="w-auto">
              <div className="bg-gray-100 rounded-lg shadow-lg dark:bg-slate-800 dark:text-gray-200">
                <div className="flex justify-end gap-1 p-2">
                  <DarkModeToggle />
                  <TranslationToggle />
                </div>
                <div className="flex flex-col items-center gap-1 pt-6 text-center bg-logo">
                  <GiDeer className="w-10 h-10 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-14 lg:h-14 xl:w-16 xl:h-16" />
                  <div className="text-gradient">
                    <h1
                      className="text-base font-medium 
                                        sm:text-lg sm:font-medium 
                                        md:text-xl md:font-medium 
                                        lg:text-2xl lg:font-medium
                                        xl:text-2xl xl:font-medium"
                    >
                      {t("mapping:title")}
                    </h1>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center gap-x-4   px-12">
                  <p className="">{t("mapping:request_not_found")}</p>
                  <div>
                    <TbError404 size={100} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PageNotFound;
