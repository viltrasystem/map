// import { useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import UserHeader from "./UserHeader";
import HeaderMenu from "./HeaderMenu";
import IconButton from "./IconButton";
import DarkModeToggle from "./DarkModeToggle";
import TranslationToggle from "./TranslationToggle";
import { MemorizedUnitList } from "../features/userUnit/UnitList";
import { MemorizedTree } from "../features/userUnit/Tree";
import { useEffect, useRef } from "react";
import ErrorBoundary from "../error/errorBoundary";
import { useAppSelector } from "../app/hook";
import { RootState } from "../app/store";

interface RightSidePanelProps {
  isOpen: boolean;
  onClosePanel: () => void;
}

const RightSidePanel: React.FC<RightSidePanelProps> = ({
  isOpen,
  onClosePanel,
}) => {
  // const [panelRectX, setPanelRectX] = useLocalStorage<number | undefined>(
  //   "panelRectX",
  //   0
  // );
  // const [panelRectY, setPanelRectY] = useLocalStorage<number | undefined>(
  //   "panelRectY",
  //   0
  // );
  const { status, isCompleted } = useAppSelector(
    (state: RootState) => ({
      status: state.unitLandLayer.status,
      isCompleted: state.unitLandLayer.isCompleted,
    }),
    (prev, next) =>
      prev.status === next.status && prev.isCompleted === next.isCompleted
  );

  const panelRef = useRef<HTMLDivElement | null>(null);
  // useEffect(() => {
  //   const panelRect = panelRef.current?.getBoundingClientRect();
  //   setPanelRectX(panelRect?.left);
  //   setPanelRectY(panelRect?.top);
  //   return () => {
  //     //  console.log("close");
  //   };
  // }, [isOpen]);
  useEffect(() => {
    if (status === "succeeded" && isCompleted) {
      onClosePanel();
    }
  }, [isCompleted]);

  return (
    <>
      {isOpen && (
        <div
          ref={panelRef}
          className="SidePanel absolute top-0 right-0 h-full overflow-y-auto bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 w-72 shadow-lg z-20 rounded-tl-lg rounded-bl-lg pl-2 pt-2"
        >
          {/* right side panel content goes here */}
          {/* <h1>{t("rightsidepanel.abc")}</h1>
          <p>{t("welcome.message")}</p> */}
          <div className="flex  justify-end space-x-2 me-2">
            <DarkModeToggle />
            <TranslationToggle />
            <IconButton onClick={onClosePanel}>
              <HiOutlineXMark size={35} />
            </IconButton>
          </div>
          <UserHeader />
          <div className="sm:hidden flex-1 items-center justify-end">
            <HeaderMenu isInsidePanel={true} />
          </div>
          {/* Add your navigation links here */}
          {/* <a href="#" className="block text-red py-2">
            ewew
          </a> */}
          {/* <a href="#" className="block text-red py-2">
            {t("abc")}
          </a>
          <a href="#" className="block text-red py-2">
            {t("about")}
          </a>
          <a href="#" className="block text-red py-2">
            {t("contact")}
          </a> */}
          <ErrorBoundary>
            <MemorizedUnitList />
          </ErrorBoundary>
          <MemorizedTree />
          {/* <UnitList />
          <Tree /> */}
        </div>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={onClosePanel}
        ></div>
      )}
    </>
  );
};

export default RightSidePanel;
