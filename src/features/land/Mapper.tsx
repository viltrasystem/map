import { useState } from "react";
import { useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import LandTabs, { Tab } from "../../ui/LandTabs";
import LandDetail from "./LandDetail";
import LandOwner from "./LandOwners";
import IconButton from "../../ui/IconButton";
import { PiSubtractSquare } from "react-icons/pi";

const Mapper = () => {
  const { selectedTab } = useAppSelector(
    (state: RootState) => state.tabSelection
  );

  const { rootNode } = useAppSelector(
    (state: RootState) => ({
      rootNode: state.tree.rootNode,
    }),
    (prev, next) => prev.rootNode === next.rootNode
  );

  const [toggleState, setToggleState] = useState(false);
  const [isLandWindowOpen, setIsLandWindowOpen] = useState<boolean | undefined>(
    undefined
  );

  console.log(rootNode, "mapper ........................");

  const handleToggle = (value: boolean) => {
    setToggleState(value);
  };

  const handleLandWindowOpen = () => {
    setIsLandWindowOpen(true); // Toggle the state
  };

  const handleLandWindowClose = () => {
    setIsLandWindowOpen(false);
  };

  return (
    <div className="dark:bg-tblColord w-full min-w-full">
      {rootNode && rootNode.UnitID > 0 ? (
        rootNode.IsHead ? ( // && rootNode.UnitTypeID !== 6
          <>
            <div className="flex-1 flex items-center justify-between pl-10 pr-6 py-1 w-full">
              <div className="flex-shrink-0 flex md:w-auto justify-between items-center space-x-1 sm:space-x-4">
                <IconButton onClick={handleLandWindowOpen}>
                  <PiSubtractSquare size={25} />
                </IconButton>
              </div>
            </div>
            <div className="flex justify-between px-6 w-full">
              <LandTabs
                summaryType={selectedTab}
                onToggle={handleToggle}
                isMapView={false}
              >
                <Tab label="Land Detail" type="land">
                  <LandDetail
                    toggleState={toggleState}
                    landWindowOpen={isLandWindowOpen} // Always passes the latest state
                    landWindowClose={handleLandWindowClose}
                  />
                </Tab>
                <Tab label="Land Owner" type="landowner">
                  <LandOwner />
                </Tab>
              </LandTabs>
            </div>
          </>
        ) : (
          <div className="flex flex-col p-10">
            <p className="flex justify-around pt-2 text-gray-800 dark:text-gray-200">
              User is not eligible to view land details
            </p>
          </div>
        )
      ) : null}
    </div>
  );
};

export default Mapper;
