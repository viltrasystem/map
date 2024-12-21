import React, { useEffect, useRef, useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { setHeightState } from "../slices/resizableSlice";
import LandTable from "../features/land/LandTable";
import LandTabs, { Tab } from "./LandTabs";
import UnitLandLayerTable from "../features/map/UnitLandLayerTable";
import { useTranslation as useCustomTranslation } from "../context/TranslationContext";
import { OwnedLand } from "../lib/types";
import { localeFormats, LocaleKey } from "../lib/helpFunction";
import { setLoadingState } from "../slices/loadingSlice";
import { loadUnitLandLayer } from "../thunk/unitLandLayerThunk";

type ResizableProps = {
  onResizeChanged: (val: number) => void;
  onLayerChanged: () => void;
  mapMarkerRemoved: () => void;
  onUnitLayerChanged: () => void;
};

const Resizable: React.FC<ResizableProps> = ({
  onResizeChanged,
  onLayerChanged,
  mapMarkerRemoved,
  onUnitLayerChanged,
}) => {
  const dispatch = useAppDispatch();
  const [toggleState, setToggleState] = useState(false);
  const { user } = useAppSelector((state: RootState) => state.auth);

  const { land } = useAppSelector(
    (state: RootState) => state.selectland,
    (prev, next) => prev.land === next.land // Shallow comparison
  );
  const { landDetails } = useAppSelector(
    (state: RootState) => state.unitLandLayer,
    (prev, next) => prev.landDetails === next.landDetails
  );
  const { initialHeight } = useAppSelector(
    (state: RootState) => state.bottomPaneIntial,
    (prev, next) => prev.initialHeight === next.initialHeight
  );
  const { selectedNode } = useAppSelector(
    (state: RootState) => ({
      selectedNode: state.tree.selectedNode,
    }),
    (prev, next) => prev.selectedNode === next.selectedNode
  );

  const { language } = useCustomTranslation();

  useEffect(() => {
    if (selectedNode) {
      if (
        selectedNode &&
        selectedNode.UnitID > 0 &&
        selectedNode?.UnitTypeID !== 1
      ) {
        const landReq: OwnedLand = {
          userId: user.UserId,
          isDnnId: true,
          isLandTab: toggleState,
          unitId: selectedNode.UnitID,
          locale: localeFormats[language as LocaleKey].locale,
        };
        dispatch(setLoadingState(true));
        dispatch(loadUnitLandLayer(landReq)); // get unit under land layers and land data
      }
    }
  }, [user, selectedNode, toggleState, language, dispatch]);

  const bottomPaneRef = useRef<HTMLDivElement | null>(null);
  const arrowUpRef = useRef<HTMLButtonElement | null>(null);
  const arrowDownRef = useRef<HTMLButtonElement | null>(null);
  const isResizing = useRef(false);
  const currentHeight = useRef(initialHeight);
  console.log("resizing ...........................................");
  const startResizing = (clientY: number) => {
    if (
      isResizing.current &&
      bottomPaneRef.current &&
      arrowUpRef.current &&
      arrowDownRef.current
    ) {
      const newHeight =
        ((window.innerHeight - clientY) / window.innerHeight) * 100;
      if (bottomPaneRef.current) {
        bottomPaneRef.current.style.height = `${newHeight}%`;
        arrowUpRef.current.style.display = `${
          newHeight === 100 ? "none" : "block"
        }`;
        arrowDownRef.current.style.display = `${
          newHeight === 0.05 ? "none" : "block"
        }`;
        currentHeight.current = newHeight; // Store the current height in a ref
        if (currentHeight.current) {
          dispatch(setHeightState(newHeight));
          if (newHeight >= 50) onResizeChanged(newHeight);
        }
      }
    }
  };

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleTouchStart = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isResizing.current) {
      startResizing(event.clientY);
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (isResizing.current && event.touches.length === 1) {
      startResizing(event.touches[0].clientY);
    }
  };

  const stopResizing = () => {
    isResizing.current = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", stopResizing);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResizing);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", stopResizing);
    };
  }, []);

  const handleMaximizeButtonClick = (): void => {
    if (bottomPaneRef.current && arrowUpRef.current && arrowDownRef.current) {
      const height: number =
        currentHeight.current >= initialHeight ? 100 : initialHeight;
      currentHeight.current = height; // Update the ref
      bottomPaneRef.current!.style.height = `${height}%`;
      arrowUpRef.current.style.display = `${height === 100 ? "none" : "block"}`;
      arrowDownRef.current.style.display = `${
        height === 0.05 ? "none" : "block"
      }`;
      dispatch(setHeightState(height));
      if (height >= 50) onResizeChanged(height);
    }
  };

  const handleMinimizeButtonClick = (): void => {
    if (bottomPaneRef.current && arrowUpRef.current && arrowDownRef.current) {
      const height: number =
        currentHeight.current <= initialHeight ? 0.05 : initialHeight;
      currentHeight.current = height; // Update the ref
      bottomPaneRef.current!.style.height = `${height}%`;
      arrowUpRef.current.style.display = `${height === 100 ? "none" : "block"}`;
      arrowDownRef.current.style.display = `${
        height === 0.05 ? "none" : "block"
      }`;
      dispatch(setHeightState(height));
      onResizeChanged(height);
    }
  };

  const handleToggle = (value: boolean) => {
    setToggleState(value);
  };

  return (
    <>
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`${
          land.length > 0 || (landDetails && landDetails?.Lands.length > 0)
            ? "block"
            : "hidden"
        } w-full h-6 pr-3 bg-sky-400 dark:bg-sky-500 cursor-row-resize flex justify-end`}
      >
        <div className="flex gap-2">
          <button
            ref={arrowDownRef}
            className="text-2xl hover:text-white hover:rounded-full hover:border-1 hover:bg-sky-800 flex items-center justify-center"
            onClick={handleMinimizeButtonClick}
          >
            <MdOutlineKeyboardArrowDown />
          </button>
          <button
            ref={arrowUpRef}
            className="text-2xl hover:text-white hover:rounded-full hover:border-1    hover:bg-sky-800"
            onClick={handleMaximizeButtonClick}
          >
            <MdOutlineKeyboardArrowUp />
          </button>
        </div>
      </div>
      <div
        ref={bottomPaneRef}
        style={{ height: `${currentHeight.current}%` }}
        className={`${
          land.length > 0 || (landDetails && landDetails?.Lands.length > 0)
            ? "block"
            : "hidden"
        } "bg-gray-200 w-full h-full"`}
      >
        <LandTabs summaryType="land" onToggle={handleToggle} isMapView={true}>
          <Tab label="Unit Land" type="land">
            <UnitLandLayerTable
              onUnitLayerChanged={onUnitLayerChanged}
              toggleState={toggleState}
            />
          </Tab>
          <Tab label="Selected Land" type="selectedLand">
            <LandTable
              onLayerChanged={onLayerChanged}
              mapMarkerRemoved={mapMarkerRemoved}
            />
          </Tab>
        </LandTabs>
      </div>
    </>
  );
};

export default Resizable;
