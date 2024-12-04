import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../ui/Header";
import SideBar, { PrintInfo } from "../ui/SideBar";
import { Outlet } from "react-router-dom";
import { setSelectedRootUnitId } from "../slices/treeSlice";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { useGetUserUnitsQuery } from "../services/userUnitApi";
import { UserUnit, setUserUnitList } from "../slices/userUnitSlice";
import store, { RootState, persistor } from "../app/store";
import { MapWrapperRef } from "../features/map/MapWrapper";
import { AppProvider } from "../context/AppContext";
import { LogoutRequest } from "../lib/types";
import { logout } from "../thunk/authThunk";
import RequestValidation from "./RequestValidation";
import { useTranslation } from "react-i18next";
import { setSideBarVisibility } from "../slices/sideBarSlice";

const AppLayout = () => {
  const { token, user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const { rootId, unitId } = useAppSelector(
    (state: RootState) => state.mapping
  );

  const { t } = useTranslation();
  const [isUserUnitAvailable, setIsUserUnitAvailable] = useState(true);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const mapWrapperRef = useRef<MapWrapperRef>(null);
  const isSidebarShowRef = useRef<boolean>(true);

  const sidebarVisible = useRef(true);

  useEffect(() => {
    const updateSidebarVisibility = () => {
      if (window.innerWidth > 1920) {
        handleSidebarToggle(true);
        setSideBarVisibility(true);
      } else {
        handleSidebarToggle(false);
        setSideBarVisibility(false);
      }
      console.log("Sidebar visibility:", sidebarVisible.current);
    };
    updateSidebarVisibility();
    window.addEventListener("resize", updateSidebarVisibility);
    return () => {
      window.removeEventListener("resize", updateSidebarVisibility);
    };
  }, []);

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

  const userUnitInitialState = useMemo(() => {
    const initialState: UserUnit = {
      UnitID: 0,
      Unit: "",
      UnitTypeID: 0,
      ReferenceID: "",
      ImgUrl: "",
      ParentUnit: "",
      ChildCount: 0,
      ChildTeamsCount: 0,
      IsActiveForHunting: false,
      IsHuntingComplete: false,
      IsArchived: false,
      IsAllowedToRegisterLands: false,
      IsMainUnit: false,
      IsMunicipalityUser: false,
      IsExporter: false,
      IsPriceUser: false,
      IsLandAssignableUser: false,
      IsLandOwner: false,
      IsReporter: false,
      IsHead: false,
      IsGuest: false,
      IsHuntingPolice: false,
    };
    return initialState;
  }, []);

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
      skip:
        store.getState().tree.rootNode != null &&
        store.getState().tree.rootNode.UnitID > 0 &&
        rootId === 0, // if data exists/not open from mapping no need to fetch or reset(while refresh)
    }
  );

  useEffect(() => {
    if (!isFetchedUserUnits && fetchedUserUnits) {
      if (rootId > 0) {
        const isUserUnitAvailable = fetchedUserUnits.find(
          (userUnit) => userUnit.UnitID === rootId
        );
        if (isUserUnitAvailable) {
          dispatch(setUserUnitList(fetchedUserUnits));
          dispatch(setSelectedRootUnitId(rootId));
        } else {
          setIsUserUnitAvailable(false);
        }
      } else {
        dispatch(setUserUnitList(fetchedUserUnits));
        const defaultUnits: UserUnit[] | undefined = fetchedUserUnits?.filter(
          (unit: UserUnit) => unit.IsMainUnit
        );
        const defaultUnit = defaultUnits
          ? defaultUnits[0]
          : fetchedUserUnits
          ? fetchedUserUnits[0]
          : userUnitInitialState;
        if (defaultUnit) dispatch(setSelectedRootUnitId(defaultUnit.UnitID));
      }
    }

    const sidebar = sidebarRef.current;
    const button = buttonRef.current;
    if (sidebar && button) {
      sidebar.style.gridTemplateColumns = "18rem 1fr";
      button.innerHTML = `<svg class="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
</svg>`;
    }
  }, [
    isFetchedUserUnits,
    fetchedUserUnits,
    userUnitInitialState,
    isError,
    error,
    rootId,
    unitId,
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
      } else {
        sidebar.style.gridTemplateColumns = "0 1fr";
        button.innerHTML = `<svg class="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
</svg>
`;
        sidebarVisible.current = false;
        isSidebarShowRef.current = false;
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

  if (!isUserUnitAvailable) {
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
            <div className="absolute top-[2px] left-[6px]  z-10">
              <button
                className="rounded-full p-[4px] w-8 h-8 flex items-center justify-center text-gray-800  hover:text-gray-100 hover:bg-gray-400  hover:ring-gray-600
        dark:text-tblColora  dark:hover:text-gray-800 dark:hover:bg-gray-400 dark:focus:ring-gray-800  dark:hover:ring-gray-600  transition duration-300"
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
