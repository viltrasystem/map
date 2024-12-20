import { MouseEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiBars3,
  HiOutlineCloudArrowUp,
  HiOutlineHome,
  HiOutlineLink,
} from "react-icons/hi2";
import { LiaDrawPolygonSolid } from "react-icons/lia";
import { TbMapPlus } from "react-icons/tb";
import IconButton from "./IconButton";
import RightSidePanel from "./RightSidePanel";
import DrawModal from "../features/map/DrawModal";
import { useAppDispatch, useAppSelector } from "../app/hook";
import store, { RootState } from "../app/store";
import HeaderMenu from "./HeaderMenu";
import { HiOutlineSearch } from "react-icons/hi";
import { saveUserDrawnFeatures } from "../thunk/drawnFeatureThunk";
import SpinnerMini from "./SpinnerMini";
import { MappingState, setLandMapping } from "../slices/landMappingSlice";
import LandSelector from "../features/land/LandSelector";
import { setSelectedDrawOption } from "../slices/mapDrawFeatureSlice";
import { toast } from "react-toastify";
import { getToastOptions, wordExistsInUri } from "../lib/helpFunction";
import { useAppContext } from "../context/AppContext";
import { setSelectedTab } from "../slices/tabSelectionSlice";
import { fetchComplete } from "../slices/unitLandLayerSlice";
import { GiDeer } from "react-icons/gi";

interface HeaderProps {
  isFetchedUserUnits: boolean;
  // closeToolTip: () => void;
}
const Header: React.FC<HeaderProps> = ({ isFetchedUserUnits }) => {
  const dispatch = useAppDispatch();
  const { mapWrapperRef } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLandSelectorModalOpen, setIsLandSelectorModalOpen] = useState(false);
  const loading = useAppSelector(
    (state: RootState) => state.mapDrawnFeature.isLoading
  );

  const { rootId, unitId, currentUserId, municipality, mainNo, subNo } =
    useAppSelector((state: RootState) => state.mapping);
  const { drawnFeatures } = useAppSelector(
    (state: RootState) => state.mapDrawnFeature
  );
  const navigate = useNavigate();
  //const INTERVAL_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds
  const openPanel = () => {
    setIsOpen(true);
    dispatch(fetchComplete(false));
  };

  const searchBtnclickHandler: MouseEventHandler<
    HTMLButtonElement
  > = (): void => {
    const landMapping: MappingState = {
      isMapping: false,
      rootId: rootId,
      unitId: unitId,
      currentUserId: currentUserId,
      municipality: municipality,
      mainNo: mainNo,
      subNo: subNo,
      landId: 0, //***
    };
    dispatch(setLandMapping(landMapping));
    setIsLandSelectorModalOpen((state) => !state);
    // navigate("/land_selector");
  };

  const homeBtnclickHandler: MouseEventHandler<
    HTMLButtonElement
  > = (): void => {
    const url = `/dashboard`;
    dispatch(setSelectedTab("land"));
    navigate(url);
  };
  const linkBtnclickHandler: MouseEventHandler<
    HTMLButtonElement
  > = (): void => {};
  const drawBtnclickHandler: MouseEventHandler<
    HTMLButtonElement
  > = (): void => {
    setIsModalOpen((state) => !state);
  };
  const mapLayerBtnclickHandler: MouseEventHandler<
    HTMLButtonElement
  > = (): void => {
    navigate("/land");
  };
  const saveBtnclickHandler: MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    if (drawnFeatures.length > 0) {
      await dispatch(saveUserDrawnFeatures());
    } else {
      toast.error("No features to save", {
        ...getToastOptions,
        position: "top-center",
      });
    }
  };

  // const closePanel = () => {
  //   setIsOpen(false);
  // };

  const handleModalClose = () => {
    setIsModalOpen(false);
    dispatch(setSelectedDrawOption(null));
    // closeToolTip();
  };

  const handleSelectedLayerLoad = () => {
    if (mapWrapperRef.current) {
      mapWrapperRef.current.mapLayerChange();
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-gray-200">
      <div className="w-screen h-full flex  justify-between lg:gap-16 xl:gap-20">
        <div className="w-auto flex  justify-center gap-4 bg-logo">
          <span className="px-1 sm:px-3 py-1">
            <GiDeer className="w-10 h-10 sm:w-10 sm:h-10" />
          </span>
          <span className="hidden lg:block self-center text-xl font-semibold whitespace-nowrap text-gradient">
            Viltrapporten Map
          </span>
        </div>
        <div className="flex-1 flex items-center justify-between">
          {/* button area */}
          <div className="flex-shrink-0 flex md:w-auto  justify-between items-center  space-x-1 sm:space-x-4">
            <IconButton onClick={homeBtnclickHandler}>
              <HiOutlineHome size={35} />
            </IconButton>
            {!wordExistsInUri("land") &&
              store.getState().tree.rootNode.UnitTypeID !== 6 && (
                <IconButton onClick={mapLayerBtnclickHandler}>
                  <TbMapPlus size={35} />
                </IconButton>
              )}
            <IconButton onClick={linkBtnclickHandler}>
              <HiOutlineLink size={35} />
            </IconButton>
            <IconButton onClick={searchBtnclickHandler}>
              <HiOutlineSearch size={35} />
            </IconButton>
            {wordExistsInUri("dashboard") && (
              <IconButton onClick={drawBtnclickHandler}>
                <LiaDrawPolygonSolid size={35} />
              </IconButton>
            )}
            {wordExistsInUri("dashboard") &&
              (!loading ? (
                <IconButton
                  onClick={saveBtnclickHandler}
                  disabled={drawnFeatures.length === 0}
                >
                  <HiOutlineCloudArrowUp size={35} />
                </IconButton>
              ) : (
                <IconButton>
                  <SpinnerMini />
                </IconButton>
              ))}
            {isModalOpen && (
              <DrawModal
                isModalOpen={isModalOpen}
                modalClose={handleModalClose}
              />
            )}
            {isLandSelectorModalOpen && (
              <LandSelector
                isLandSelectorModalIsOpen={isLandSelectorModalOpen}
                landSelectorModalClose={() => setIsLandSelectorModalOpen(false)}
                onSelectedLayerLoad={() => handleSelectedLayerLoad()}
              />
            )}
          </div>
          <div>
            {/* Right side nav bar and panel */}
            <div className="flex flex-1 me-2 items-center justify-end">
              <div className="hidden sm:flex flex-1 items-center justify-end">
                <HeaderMenu isInsidePanel={false} />
              </div>
              <IconButton onClick={openPanel} disabled={isFetchedUserUnits}>
                <HiBars3 size={35} />
              </IconButton>
            </div>
            {isOpen && (
              <RightSidePanel
                isOpen={isOpen}
                onClosePanel={() => setIsOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
