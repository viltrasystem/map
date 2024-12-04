import Heading from "../ui/Heading";
import DarkModeToggle from "../ui/DarkModeToggle";
import TranslationToggle from "../ui/TranslationToggle";
import Logo from "../ui/Logo";
import { useTranslation } from "react-i18next";
import { TbError404 } from "react-icons/tb";

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
                  <Logo size={60} />
                  <div className="text-gradient">
                    <Heading
                      headingElement="h4"
                      headingTxt={t("mapping:title")}
                    />
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
