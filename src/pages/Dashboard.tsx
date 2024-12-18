import Resizable from "../ui/Resizable";
import LoadingModal from "../ui/LoadingModal";
import MapWrapper from "../features/map/MapWrapper";
import { useAppContext } from "../context/AppContext";
import { useAppDispatch } from "../app/hook";
import { fetchUserDrawnFeatures } from "../thunk/mapSavedFeatureThunk";
import { useCallback, useEffect } from "react";
import store from "../app/store";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { handleSidebarToggle, mapWrapperRef } = useAppContext();

  console.log("dashboard...............................");

  useEffect(() => {
    dispatch(fetchUserDrawnFeatures()); // get saved user defined features ***(here can be used to retrive data which appropriate to user belongs to area)
  }, [dispatch]);

  const handleResizeChanged = useCallback(
    (height: number) => {
      if (mapWrapperRef.current) {
        mapWrapperRef.current.mapToolToggle(height);
      }
      if (height > 80) {
        handleSidebarToggle(false);
      } else {
        if (store.getState().sideBar.isSidebarVisible)
          handleSidebarToggle(true);
      }
    },
    [handleSidebarToggle, mapWrapperRef]
  );

  const handleLayerChanged = useCallback(() => {
    if (mapWrapperRef.current) {
      mapWrapperRef.current.mapLayerChange();
    }
  }, [mapWrapperRef]);

  const handleUnitLayerChanged = useCallback(() => {
    if (mapWrapperRef.current) {
      mapWrapperRef.current.mapUnitLayerChange();
    }
  }, [mapWrapperRef]);

  const handleMarkerRemoved = useCallback(() => {
    if (mapWrapperRef.current) {
      mapWrapperRef.current.mapMarkerRemove();
    }
  }, [mapWrapperRef]);

  return (
    <div className="map-container relative flex flex-col w-full h-full overflow-hidden">
      <div className="flex-1 bg-gray-100 dark:bg-tblColord">
        <MapWrapper ref={mapWrapperRef} />
        <LoadingModal />
      </div>
      <Resizable
        onLayerChanged={handleLayerChanged}
        onUnitLayerChanged={handleUnitLayerChanged}
        mapMarkerRemoved={handleMarkerRemoved}
        onResizeChanged={handleResizeChanged}
      />
    </div>
  );
};

export default Dashboard;
