import React, { useEffect, useState } from "react";
import FilterInput from "./FilterInput";
import SlideToggle from "./SlideToggle";
import SpinnerMini from "./SpinnerMini";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { setSelectedTab } from "../slices/tabSelectionSlice";

type TabProps = {
  type: string;
  label: string;
  children: React.ReactNode;
};

const Tab: React.FC<TabProps> = ({ children }) => {
  return <div className="tab-content">{children}</div>;
};

type LandTabsProps = {
  summaryType: string;
  isMapView: boolean;
  children: React.ReactNode;
  onToggle: (value: boolean) => void;
};

const LandTabs: React.FC<LandTabsProps> = ({
  summaryType,
  isMapView,
  children,
  onToggle,
}) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>("");
  const { status } = useAppSelector((state: RootState) => state.unitLandLayer);
  const { selectedTab } = useAppSelector(
    (state: RootState) => state.tabSelection
  );

  useEffect(() => {
    setActiveTab(summaryType);
  }, [summaryType]);

  useEffect(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);

  const handleToggle = (value: boolean) => {
    if (onToggle) onToggle(value); //!isMapView &&
  };

  const handleActiveTab = (tabType: string) => {
    dispatch(setSelectedTab(tabType));
  };

  const tabs = React.Children.toArray(
    children
  ) as React.ReactElement<TabProps>[];

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-between">
        <div className="inline-flex border-gray-200 dark:bg-gray-900">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`py-[2px] px-4 focus:outline-none ${
                activeTab === tab.props.type
                  ? "border-b-2 border-cyan-400 dark:border-cyan-400   text-slate-50 bg-sky-600"
                  : "border-b-2 border-slate-800  dark:border-slate-800 text-slate-50 bg-sky-700"
              }`}
              onClick={() => handleActiveTab(tab.props.type!)}
            >
              <div className="grid grid-flow-col justify-items-end gap-2 items-center">
                <p>{tab.props.label}</p>
                {status === "loading" &&
                  tab.props.type === "land" &&
                  isMapView && (
                    <p>
                      <SpinnerMini />
                    </p>
                  )}
              </div>
            </button>
          ))}
        </div>
        <div className="mb-1 flex gap-2 items-center">
          {activeTab === "land" && (
            <div className="">
              <SlideToggle
                onValue="One"
                offValue="Zero"
                onToggle={handleToggle}
              />
            </div>
          )}
          {(activeTab === "land" || activeTab === "selectedLand") && (
            <div className="">
              <FilterInput />
            </div>
          )}
        </div>
      </div>
      <div className="tab-content  min-w-full">
        {tabs.filter((tab) => {
          return tab.props.type == activeTab;
        })}
      </div>
    </div>
  );
};

export default LandTabs;
export { Tab };
