import { useEffect, useRef, useState } from "react";
import Header from "../ui/Header";
import SideBar, { PrintInfo } from "../ui/SideBar";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { useGetUserUnitsQuery } from "../services/userUnitApi";
import { setUserUnitList } from "../slices/userUnitSlice";
import store, { RootState, persistor } from "../app/store";
import { MapWrapperRef } from "../features/map/MapWrapper";
import { AppProvider } from "../context/AppContext";
import { LogoutRequest } from "../lib/types";
import { logout } from "../thunk/authThunk";
import RequestValidation from "./RequestValidation";
import { useTranslation } from "react-i18next";
import { setSideBarVisibility } from "../slices/sideBarSlice";
import { selectRootNode } from "../lib/selectRootNode";

const AppLayout = () => {
  const { token, user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const { rootId } = useAppSelector(
    (state: RootState) => ({ rootId: state.mapping.rootId }),
    (prev, next) => prev.rootId === next.rootId
  );
  const { isAtTop } = useAppSelector(
    (state: RootState) => ({
      isAtTop: state.resize.isAtTop,
    }),
    (prev, next) => prev.isAtTop === next.isAtTop
  );
  const { t } = useTranslation();
  const [IsUserUnitAvailable, setIsUserUnitAvailable] = useState(true);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const mapWrapperRef = useRef<MapWrapperRef>(null);
  const isSidebarShowRef = useRef<boolean>(true);

  const sidebarVisible = useRef(true);
  console.log("appLayout...............................");

  const {
    data: fetchedUserUnits,
    isLoading: isFetchedUserUnits,
    isError,
    error,
  } = useGetUserUnitsQuery(
    {
      dnnUserId: user.UserId,
      isAdmin: user.IsAdmin,
    },
    {
      skip: store.getState().userUnit.userUnitList.length > 0,
    }
  );

  useEffect(() => {
    const updateSidebarVisibility = () => {
      if (window.innerWidth > 1280) {
        handleSidebarToggle(true);
        dispatch(setSideBarVisibility(true));
      } else {
        handleSidebarToggle(false);
        dispatch(setSideBarVisibility(false));
      }
      console.log("Sidebar visibility:", sidebarVisible.current);
    };
    updateSidebarVisibility();
    window.addEventListener("resize", updateSidebarVisibility);
    return () => {
      window.removeEventListener("resize", updateSidebarVisibility);
    };
  }, [dispatch]);

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

  useEffect(() => {
    if (store.getState().userUnit.userUnitList.length === 0) {
      if (!isFetchedUserUnits && fetchedUserUnits) {
        if (rootId > 0) {
          console.log(rootId);
          const isUserUnitAvailable = fetchedUserUnits.some(
            (userUnit) => userUnit.UnitID === rootId
          );

          if (isUserUnitAvailable) {
            dispatch(async (dispatch, getState) => {
              const state = getState();
              console.log(state.userUnit.userUnitList);
              dispatch(setUserUnitList(fetchedUserUnits));

              const userUnits = state.userUnit.userUnitList; // Adjust according to your Redux slice
              const rootNodeExists = userUnits.some(
                (unit) => unit.UnitID === rootId
              );

              if (rootNodeExists) {
                selectRootNode(rootId, userUnits, user, dispatch);
              }
            });
          } else {
            setIsUserUnitAvailable(false);
          }
        } else {
          dispatch(async (dispatch, getState) => {
            dispatch(setUserUnitList(fetchedUserUnits));

            const defaultUnits = fetchedUserUnits.filter(
              (unit) => unit.IsMainUnit
            );
            const defaultUnit = defaultUnits[0] || fetchedUserUnits[0];
            const state = getState();
            const userUnits = state.userUnit.userUnitList;
            if (userUnits.length > 0 && defaultUnit) {
              selectRootNode(defaultUnit.UnitID, userUnits, user, dispatch);
            }
          });
        }
      }
    } else {
      if (rootId > 0) {
        const isUserUnitAvailable = store
          .getState()
          .userUnit.userUnitList.find((userUnit) => userUnit.UnitID === rootId);
        if (isUserUnitAvailable) {
          selectRootNode(
            rootId,
            store.getState().userUnit.userUnitList,
            user,
            dispatch
          );
        } else {
          setIsUserUnitAvailable(false);
        }
      }
    }
  }, [
    isFetchedUserUnits,
    user,
    fetchedUserUnits,
    isError,
    error,
    rootId,
    dispatch,
  ]);

  const toggleSidebarVisibility = () => {
    const sidebar = sidebarRef.current;
    const button = buttonRef.current;
    const sidebarState = sidebarVisible.current;
    if (sidebar && button) {
      if (!sidebarState) {
        sidebar.style.gridTemplateColumns = "18rem 1fr";
        button.innerHTML = `<svg class="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
</svg>
`;
        sidebarVisible.current = true;
        isSidebarShowRef.current = true;
        dispatch(setSideBarVisibility(true));
      } else {
        sidebar.style.gridTemplateColumns = "0 1fr";
        button.innerHTML = `<svg class="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
</svg>
`;
        sidebarVisible.current = false;
        isSidebarShowRef.current = false;
        dispatch(setSideBarVisibility(false));
      }
    }
  };

  const handleSidebarToggle = (isVisible: boolean) => {
    if (isSidebarShowRef.current) {
      // fire when table hight change, initiate from dashboard
      const sidebar = sidebarRef.current;
      const button = buttonRef.current;

      if (sidebar && button) {
        if (isVisible) {
          sidebar.style.gridTemplateColumns = "18rem 1fr";
          button.innerHTML = `<svg class="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
</svg>
`;
        } else {
          sidebar.style.gridTemplateColumns = "0 1fr";
          button.innerHTML = `<svg class="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
</svg>
`;
        }
        sidebarVisible.current = isVisible;
      }
    }
  };

  const handlePrintMap = (arg: PrintInfo) => {
    console.log(`${arg.title} title show applayerout`);
    if (mapWrapperRef.current) {
      mapWrapperRef.current.PrintMap(arg);
    }
  };
  const handleDownloadMap = (arg: PrintInfo) => {
    console.log(`${arg.title} title show applayerout`);
    if (mapWrapperRef.current) {
      mapWrapperRef.current.DownloadMap(arg);
    }
  };
  const handleCancelDownloadMap = () => {
    console.log(`cancel show applayerout`);
    if (mapWrapperRef.current) {
      mapWrapperRef.current.CancelDownloadMap();
    }
  };

  const contextValue = { handleSidebarToggle, handlePrintMap, mapWrapperRef };

  if (!IsUserUnitAvailable) {
    return (
      <div>
        <RequestValidation
          isValid={true}
          isUserValid={true}
          isUnitMatch={false}
          description={t("mapping:user_unit_different")}
          logoutHandle={logoutHandle}
          t={t}
        />
      </div>
    );
  }

  return (
    <AppProvider value={contextValue}>
      <div className="grid grid-rows-[3rem,1fr] bg-neutral-100 h-screen w-screen">
        <Header isFetchedUserUnits={isFetchedUserUnits} />
        <div
          className="grid grid-rows-1 grid-flow-col transition-transform ease-in-out"
          ref={sidebarRef}
        >
          <div>
            <SideBar
              printMap={handlePrintMap}
              downloadMap={handleDownloadMap}
              cancelDownloadMap={handleCancelDownloadMap}
            />
          </div>
          <div className="flex relative">
            <div className="absolute top-[1px] left-[6px] z-10">
              <button
                className={`rounded-lg ${
                  isAtTop
                    ? "-mt-[2px] w-7 h-7 hover:text-white hover:bg-sky-800"
                    : "w-8 h-8  text-gray-800 dark:text-gray-800 hover:text-gray-100 dark:hover:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-600"
                } flex items-center justify-center hover:border-1
         transition duration-300`}
                ref={buttonRef}
                onClick={toggleSidebarVisibility}
              ></button>
            </div>
            <Outlet />
            {/* <Outlet context={contextValue} /> */}
          </div>
        </div>
      </div>
    </AppProvider>
  );
};

export default AppLayout;
