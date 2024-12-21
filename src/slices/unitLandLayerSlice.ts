import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  GeoJsonToFeatureConverter,
  formatNumber,
  getToastOptions,
} from "../lib/helpFunction";
import { LandObj } from "./landSummarySlice";
import { loadUnitLandLayer } from "../thunk/unitLandLayerThunk";
import { toast } from "react-toastify";

export type ArchiveInfo = {
  unitId: number;
  landId: number;
  deletedBy: number;
  locale: string;
};

interface LandState {
  landDetails: LandObj | undefined;
  landLayers: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  isCompleted: boolean;
  error: string | undefined;
  layerInfo: {
    layerName: string | undefined;
    isClicked: false;
    isMouseEnter: false;
    version: number;
  };
}

const initialState: LandState = {
  landDetails: undefined,
  landLayers: [],
  status: "idle",
  isCompleted: false,
  error: undefined,
  layerInfo: {
    isClicked: false,
    isMouseEnter: false,
    layerName: undefined,
    version: 0,
  },
};

const unitLandLayerSlice = createSlice({
  name: "unitLandLayer",
  initialState,
  reducers: {
    // setSelectedUnitLayerState: (state, action: PayloadAction<any>) => {
    //   state.layerInfo.layerName = action.payload.layerName;
    //   state.layerInfo.isClicked = action.payload.isClicked;
    //   state.layerInfo.isMouseEnter = action.payload.isMouseEnter;
    //   state.layerInfo.version += 1;
    // },
    fetchComplete(state, action: PayloadAction<boolean>) {
      state.isCompleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUnitLandLayer.pending, (state) => {
        state.status = "loading";
        state.isCompleted = false;
      })
      .addCase(
        loadUnitLandLayer.fulfilled,
        (
          state,
          action: PayloadAction<{
            noContent: boolean;
            data: LandObj;
            locale: string;
          }>
        ) => {
          const { noContent, data, locale } = action.payload;
          if (noContent) {
            toast.warning(
              "No land information found for the given Unit in viltrapporten land register",
              {
                ...getToastOptions(),
                position: "top-center",
              }
            );
            return {
              ...state,
              status: "succeeded",
              landDetails: undefined,
              landLayers: [],
              isCompleted: true,
            };
          } else {
            const landLayerArray: any[] = [];
            state.status = "succeeded";
            // Use the locale for LocalizeNumber
            state.landDetails = {
              TotalLandsCount: data.TotalLandsCount,
              TotalSharedLandsCount: data.TotalSharedLandsCount,
              TotalForestArea: formatNumber(data.TotalForestArea, locale),
              TotalMountainArea: formatNumber(data.TotalMountainArea, locale),
              TotalAgricultureArea: formatNumber(
                data.TotalAgricultureArea,
                locale
              ),
              TotalArea: formatNumber(data.TotalArea, locale),
              Lands: data.Lands.map((land, index) => {
                const landLayer = GeoJsonToFeatureConverter(land.MapGeoJson);

                if (landLayer) {
                  landLayerArray.push(landLayer);
                }

                return {
                  LandId: land.LandId,
                  Municipality: land.Municipality,
                  MainNo: land.MainNo,
                  SubNo: land.SubNo,
                  PlotNo: land.PlotNo,
                  NoOfReferencedLands: land.NoOfReferencedLands,
                  AreaInForest: formatNumber(
                    land.AreaInForest.toString(),
                    locale
                  ),
                  AreaInMountain: formatNumber(
                    land.AreaInMountain.toString(),
                    locale
                  ),
                  AreaInAgriculture: formatNumber(
                    land.AreaInAgriculture.toString(),
                    locale
                  ),
                  TotalArea: formatNumber(land.TotalArea.toString(), locale),
                  Notes: land.Notes,
                  OwnershipTypeId: land.OwnershipTypeId,
                  OwnershipType: land.OwnershipType,
                  LandOwnerId: land.LandOwnerId,
                  DisplayName: land.DisplayName,
                  LandOwners: land.LandOwners.map((owner) => ({
                    LandOwnerId: owner.LandOwnerId,
                    SystemUserId: owner.SystemUserId,
                    LandIdq: owner.LandIdq + index,
                    ContactOwnerLandId: owner.LandIdq + index * 2,
                    DisplayName: owner.DisplayName,
                    FullName: owner.FullName,
                    Email: owner.Email,
                    ContactNumber: owner.ContactNumber,
                    IsSelected: owner.IsSelected,
                    IsSharedLandOwner: owner.IsSharedLandOwner,
                  })),
                  LandUnits: land.LandUnits.map((unit) => ({
                    UnitId: unit.UnitId,
                    Unit: unit.Unit,
                    LandTypeId: unit.LandTypeId,
                  })),
                  HasSubRows: true,
                  SubTableContant: "", // Default value for missing properties
                  LandUnit: "",
                  SubSubRows: "",
                  HasSubSubRows: false,
                  availableNames: [],
                  selectedNames: [],
                  SubContent: [
                    {
                      LandOwners: land.LandOwners.map((owner) => ({
                        LandOwnerId: owner.LandOwnerId,
                        SystemUserId: owner.SystemUserId,
                        LandIdq: owner.LandIdq + index,
                        ContactOwnerLandId: owner.LandIdq + index * 2,
                        DisplayName: owner.DisplayName,
                        FullName: owner.FullName,
                        Email: owner.Email,
                        ContactNumber: owner.ContactNumber,
                        IsSelected: owner.IsSelected,
                        IsSharedLandOwner: owner.IsSharedLandOwner,
                      })),
                      LandUnits: land.LandUnits.map((unit) => ({
                        UnitId: unit.UnitId,
                        Unit: unit.Unit,
                        LandTypeId: unit.LandTypeId,
                      })),
                      SubTableContant: "", // to prevent red warning on file, all asigned with default values(no future usage) ***
                      LandUnit: "",
                      SubSubRows: "",
                      HasSubSubRows: false,
                      HasSubRows: false,
                      SubContent: [],
                      availableNames: [],
                      selectedNames: [],
                      LandId: 0,
                      Municipality: "",
                      MainNo: "",
                      SubNo: "",
                      PlotNo: "",
                      NoOfReferencedLands: 0,
                      AreaInForest: "",
                      AreaInMountain: "",
                      AreaInAgriculture: "",
                      TotalArea: "",
                      Notes: "",
                      OwnershipTypeId: 0,
                      OwnershipType: "",
                      LandOwnerId: 0,
                      DisplayName: "",
                      MapGeoJson: "",
                      LandLayer: null,
                    },
                  ],
                  MapGeoJson: "",
                  LandLayer: landLayer,
                };
              }),
            };
            state.landLayers = landLayerArray;
          }
        }
      )
      .addCase(loadUnitLandLayer.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error = action.payload.message;
          // state.error.statusCode = action.payload.statusCode;
        } else {
          state.error = action.error.message;
          // state.error.statusCode = 500;
        }
      });
  },
});

export const { fetchComplete } = unitLandLayerSlice.actions;
export default unitLandLayerSlice.reducer;
