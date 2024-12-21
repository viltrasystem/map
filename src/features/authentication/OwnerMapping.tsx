import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState, persistor } from "../../app/store";
import DarkModeToggle from "../../ui/DarkModeToggle";
import TranslationToggle from "../../ui/TranslationToggle";
import { useTranslation } from "react-i18next";
import { logout } from "../../thunk/authThunk";
import { LogoutRequest } from "../../lib/types";
import { setLandMapping, MappingState } from "../../slices/landMappingSlice";
import { setLoadingState } from "../../slices/loadingSlice";
import { GiDeer } from "react-icons/gi";

const OwnerMapping = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(false);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { token, user, isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  const { rootId, unitId, currentUserId } = useParams<{
    rootId: string;
    unitId: string;
    currentUserId: string;
  }>();

  useEffect(() => {
    if (
      rootId &&
      unitId &&
      currentUserId &&
      !isNaN(Number(rootId)) &&
      !isNaN(Number(unitId)) &&
      !isNaN(Number(currentUserId))
    ) {
      setIsValid(true);
      const landMapping: MappingState = {
        isMapping: true,
        rootId: parseInt(rootId),
        unitId: parseInt(unitId),
        currentUserId: parseInt(currentUserId),
        landId: 0,
        mainNo: "",
        municipality: "",
        subNo: "",
      };
      dispatch(setLandMapping(landMapping));
      if (parseInt(currentUserId) === user.UserId) {
        dispatch(setLoadingState(true));
        navigate("/land_selector");
      }
    }
  }, [rootId, unitId, currentUserId, user.UserId, dispatch, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
    }
  }, [isAuthenticated, navigate]);

  const name = user.DisplayName?.toUpperCase();
  const description = t("mapping:different_user", { name });

  const logoutRequest: LogoutRequest = {
    UserId: user.UserId,
    Token: token.accessToken,
    RefreshToken: token.refreshToken,
  };

  const logoutHandle = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    dispatch(logout(logoutRequest));
    persistor.purge(); // Clears the persisted storage
  };

  return (
    <div>
      <main className="flex h-screen items-center justify-center bg-neutral-100 shadow-2xl dark:bg-neutral-100">
        <section className="max-w-5xl h-full bg-neutral-100 p-10">
          <div className="flex flex-wrap items-start justify-center gap-6 h-full text-neutral-800 font-light">
            <div className="w-full">
              <div className="bg-gray-100 rounded-lg shadow-lg dark:bg-slate-800 dark:text-gray-200">
                <div className="flex justify-end gap-1 pt-2 pr-5">
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
                {isValid ? (
                  <div className="p-10">
                    <p>{description}</p>
                    <p className="flex justify-center pt-5">
                      {t("mapping:login_request")}
                    </p>
                    <div className="flex w-1/2 justify-center m-auto py-5">
                      <button
                        className="w-full px-6 py-2 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out rounded-md border-2 border-transparent background-gradient hover:border-blue-500 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:border-blue-500 active:bg-blue-700"
                        onClick={logoutHandle}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col p-10">
                    <p>{t("mapping:invalid_request")}</p>
                    <p className="flex justify-around pt-2">
                      {t("mapping:close_request")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OwnerMapping;
