import { combineReducers } from "@reduxjs/toolkit";
import treeReducer from "../slices/treeSlice";
import unitTreeReducer from "../slices/unitTreeSlice";
import userUnitReducer from "../slices/userUnitSlice";
import mapFeatureReducer from "../slices/mapFeatureSlice";
import mapDrawnFeatureReducer from "../slices/mapDrawnFeatureSlice";
import selectlandReducer from "../slices/selectedlandSlice";
import selectedLayerReducer from "../slices/selectedLayerSlice";
import tabSelectionReducer from "../slices/tabSelectionSlice";
import unitLandLayerReducer from "../slices/unitLandLayerSlice";
//import selectedlandInfoReducer from "../slices/selectedLandInfoSlice";
import sosiReducer from "../slices/sosiSlice";
import drawReducer from "../slices/mapDrawFeatureSlice";
import mapSavedFeatureReducer from "../slices/mapSavedFeatureSlice";
import mapLegendReducer from "../slices/mapLegendSlice";
import sideBarReducer from "../slices/sideBarSlice";
import resizableReducer from "../slices/resizableSlice";
import bottomPaneIntialReducer from "../slices/bottomPaneIntialSlice";
import loadingMapReducer from "../slices/loadingSlice";
//import languageReducer from "../slices/languageSlice";
import landMappingReducer from "../slices/landMappingSlice";
import landSummaryReducer from "../slices/landSummarySlice";
import summaryReducer from "../slices/summarySlice";
import landOwnersReducer from "../slices/landOwnersSlice";
import { userUnitApi } from "../services/userUnitApi";
import { refreshApi } from "../services/refreshApi";
import treeApi from "../services/treeApi";
import landSelectorApi from "../services/landSelectorApi";
import filterReducer from "../slices/filterSlice";
//import { authApi } from "../services/authApi"; // Import the auth API
import authReducer from "../slices/authSlice"; // Import the auth API
import baseMapApi, { mapApi, wfsApi } from "../services/mapsApi";
//import { baseLayerApi } from "../services/baseLayer";

const appReducer = combineReducers({
  auth: authReducer,
  userUnit: userUnitReducer,
  tree: treeReducer,
  unitTree: unitTreeReducer,
  mapFeature: mapFeatureReducer,
  mapDrawnFeature: mapDrawnFeatureReducer,
  mapSavedFeature: mapSavedFeatureReducer,
  mapLegend: mapLegendReducer,
  sideBar: sideBarReducer,
  resize: resizableReducer,
  bottomPaneIntial: bottomPaneIntialReducer,
  loading: loadingMapReducer,
  //language: languageReducer,
  mapping: landMappingReducer,
  selectland: selectlandReducer,
  unitLandLayer: unitLandLayerReducer,
  selectedLayer: selectedLayerReducer,
  tabSelection: tabSelectionReducer,
  landSummary: landSummaryReducer,
  summary: summaryReducer,
  landOwners: landOwnersReducer,
  filter: filterReducer,
  // selectedlandInfo: selectedlandInfoReducer,
  sosi: sosiReducer,
  draw: drawReducer,
  // [authApi.reducerPath]: authApi.reducer,
  [refreshApi.reducerPath]: refreshApi.reducer, // Add the API reducer
  [userUnitApi.reducerPath]: userUnitApi.reducer,
  [treeApi.reducerPath]: treeApi.reducer,
  [landSelectorApi.reducerPath]: landSelectorApi.reducer,
  [baseMapApi.reducerPath]: baseMapApi.reducer,
  [mapApi.reducerPath]: mapApi.reducer,
  [wfsApi.reducerPath]: wfsApi.reducer,
  // [baseLayerApi.reducerPath]: baseLayerApi.reducer, // Add the API reducer
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "LOGOUT/fulfilled") {
    state = undefined; // Reset all state
    //state = { auth: state.auth };  // Reset all state except for `auth` (or other keys you want to persist)
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof appReducer>;
export default rootReducer;
