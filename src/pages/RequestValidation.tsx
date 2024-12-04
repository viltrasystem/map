import React from "react";
import DarkModeToggle from "../ui/DarkModeToggle";
import TranslationToggle from "../ui/TranslationToggle";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";
import ValidContent from "../ui/ValidContent";
import InvalidContent from "../ui/InvalidContent";
import UserUnitMismatch from "../ui/UserUnitMismatch";

interface RequestValidationProps {
  isValid: boolean;
  isUserValid: boolean;
  isUnitMatch: boolean | undefined;
  description: string | undefined;
  logoutHandle: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  t: any;
}

const RequestValidation: React.FC<RequestValidationProps> = ({
  isValid,
  isUserValid,
  isUnitMatch,
  description,
  logoutHandle,
  t,
}) => {
  console.log(
    isValid,
    isUserValid,
    isUnitMatch,
    description,
    t("mapping:user_unit_invalid")
  );

  return (
    <div>
      <main className="modal  h-fit fixed inset-0 flex m-auto content-center justify-center items-center z-50">
        <section className="bg-neutral-100 max-w-5xl">
          <div className="gap-6 flex h-full flex-wrap items-start justify-center text-neutral-800 font-light">
            <div className="w-full">
              <div className="bg-gray-100 rounded-lg shadow-lg dark:bg-slate-800 dark:text-gray-200">
                <div className="flex justify-end gap-1 pt-2 pr-5">
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
                {!isUserValid && (
                  <ValidContent
                    description={description}
                    logoutHandle={logoutHandle}
                    t={t}
                  />
                )}
                {isUnitMatch !== undefined && !isUnitMatch && (
                  <UserUnitMismatch
                    description={description}
                    logoutHandle={logoutHandle}
                    t={t}
                  />
                )}
                {!isValid && <InvalidContent t={t} description={description} />}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RequestValidation;
