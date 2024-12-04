import Resizable from "../ui/Resizable";
import LoadingModal from "../ui/LoadingModal";
import MapWrapper from "../features/map/MapWrapper";
import { useAppContext } from "../context/AppContext";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { fetchUserDrawnFeatures } from "../thunk/mapSavedFeatureThunk";
import { useEffect } from "react";
import store, { RootState } from "../app/store";
import { loadUnitLandLayer } from "../thunk/unitLandLayerThunk";
import { LocaleKey, localeFormats } from "../lib/helpFunction";
import { useTranslation as useCustomTranslation } from "../context/TranslationContext";
import { setLoadingState } from "../slices/loadingSlice";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { handleSidebarToggle, mapWrapperRef } = useAppContext();
  const { selectedNode, selectedRootUnitId } = useAppSelector(
    (state: RootState) => state.tree
  );
  const { language } = useCustomTranslation();

  useEffect(() => {
    dispatch(fetchUserDrawnFeatures()); // get saved user defined features ***(here can be used to retrive data which appropriate to user belongs to area)
  }, []);

  useEffect(() => {
    dispatch(setLoadingState(true));
    dispatch(
      loadUnitLandLayer({
        unitId:
          selectedNode === undefined
            ? selectedRootUnitId
            : selectedNode?.UnitID,
        locale: localeFormats[language as LocaleKey].locale,
      })
    ); // get unit under land layers and land data
  }, [selectedNode, selectedRootUnitId]);

  const handleResizeChanged = (height: number) => {
    if (mapWrapperRef.current) {
      mapWrapperRef.current.mapToolToggle(height);
    }
    if (height > 80) {
      handleSidebarToggle(false);
    } else {
      if (store.getState().sideBar.isSidebarVisible) handleSidebarToggle(true);
    }
  };

  const handleLayerChanged = () => {
    if (mapWrapperRef.current) {
      mapWrapperRef.current.mapLayerChange();
    }
  };

  const handleUnitLayerChanged = () => {
    if (mapWrapperRef.current) {
      mapWrapperRef.current.mapUnitLayerChange();
    }
  };

  return (
    <div className="map-container relative flex flex-col w-full h-full overflow-hidden">
      <div className="flex-1 bg-gray-100 dark:bg-tblColord">
        <MapWrapper ref={mapWrapperRef} />
        <LoadingModal />
      </div>
      <Resizable
        onLayerChanged={handleLayerChanged}
        onUnitLayerChanged={handleUnitLayerChanged}
        onResizeChanged={handleResizeChanged}
      />
    </div>
  );
};

export default Dashboard;
