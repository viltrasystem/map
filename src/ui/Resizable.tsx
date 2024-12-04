import React, { useEffect, useRef } from "react";
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

type ResizableProps = {
  onResizeChanged: (val: number) => void;
  onLayerChanged: () => void;
  onUnitLayerChanged: () => void;
};

const Resizable: React.FC<ResizableProps> = ({
  onResizeChanged,
  onLayerChanged,
  onUnitLayerChanged,
}) => {
  const dispatch = useAppDispatch();
  const { landInfo } = useAppSelector((state: RootState) => state.selectland);
  const { landDetails } = useAppSelector(
    (state: RootState) => state.unitLandLayer
  );
  const { initialHeight } = useAppSelector(
    (state: RootState) => state.bottomPaneIntial
  );

  const bottomPaneRef = useRef<HTMLDivElement | null>(null);
  const arrowUpRef = useRef<HTMLButtonElement | null>(null);
  const arrowDownRef = useRef<HTMLButtonElement | null>(null);
  const isResizing = useRef(false);
  const currentHeight = useRef(initialHeight);

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (
      isResizing.current &&
      bottomPaneRef.current &&
      arrowUpRef.current &&
      arrowDownRef.current
    ) {
      const newHeight =
        ((window.innerHeight - event.clientY) / window.innerHeight) * 100;
      bottomPaneRef.current.style.height = `${newHeight}%`;
      arrowUpRef.current.style.display = `${
        newHeight === 100 ? "none" : "block"
      }`;
      arrowDownRef.current.style.display = `${
        newHeight === 0.05 ? "none" : "block"
      }`;
      currentHeight.current = newHeight; // Store the current height in a ref
      if (currentHeight.current) {
        dispatch(setHeightState(currentHeight.current));
        if (newHeight >= 50) onResizeChanged(newHeight);
      }
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
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

  const handleLayerChanged = () => {
    onLayerChanged();
  };
  const handleUnitLayerChanged = () => {
    onUnitLayerChanged();
  };

  return (
    <>
      <div
        onMouseDown={handleMouseDown}
        className={`${
          landInfo.length > 0 || (landDetails && landDetails?.Lands.length > 0)
            ? "block"
            : "hidden"
        } w-full h-6  pr-3 gap-1 bg-gray-400 cursor-row-resize flex justify-end`}
      >
        {/* {currentHeight.current !== 0.05 && ( */}
        <button
          ref={arrowDownRef}
          className="text-2xl hover:text-white hover:rounded-3xl hover:border-1 hover:bg-blue-800"
          onClick={handleMinimizeButtonClick}
        >
          <MdOutlineKeyboardArrowDown />
        </button>
        {/* )} */}
        {/* {currentHeight.current < 100 && ( */}
        <button
          ref={arrowUpRef}
          className="text-2xl hover:rounded-full hover:border-1  hover:text-white  hover:border-1 hover:bg-blue-800"
          onClick={handleMaximizeButtonClick}
        >
          <MdOutlineKeyboardArrowUp />
        </button>
        {/* )} */}
      </div>
      <div
        ref={bottomPaneRef}
        style={{ height: `${currentHeight.current}%` }}
        className={`${
          currentHeight.current === 0.05 ? "hidden" : "block"
        } "bg-gray-200 overflow-y-scroll" ${
          landInfo.length > 0 || (landDetails && landDetails?.Lands.length > 0)
            ? "block"
            : "hidden"
        }`}
      >
        <LandTabs summaryType={"unitland"} isMapView={true}>
          <Tab label="Unit Land" type="unitland">
            <UnitLandLayerTable onUnitLayerChanged={handleUnitLayerChanged} />
          </Tab>
          <Tab label="Selected Land" type="land">
            <LandTable onLayerChanged={handleLayerChanged} />
          </Tab>
        </LandTabs>
      </div>
    </>
  );
};

export default Resizable;
