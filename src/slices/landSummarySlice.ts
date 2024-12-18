import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { landSummary, archiveLand } from "../thunk/landSummaryThunk";
import { formatNumber } from "../lib/helpFunction";

export type ArchiveInfo = {
  unitId: number;
  landId: number;
  deletedBy: number;
  locale: string;
};

interface LandState {
  //summaryInfo: summaryInfo;
  landDetails: LandObj | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
}

const initialState: LandState = {
  // summaryInfo: { unitId: 0, summaryType: "land" },
  landDetails: null,
  status: "idle",
  error: undefined,
};

const landSummarySlice = createSlice({
  name: "landSummary",
  initialState,
  reducers: {
    // setLandSummaryUnit: (state, action: PayloadAction<summaryInfo>) => {
    //   state.summaryInfo.unitId = action.payload.unitId;
    //   state.summaryInfo.summaryType = action.payload.summaryType;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(landSummary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        landSummary.fulfilled,
        (state, action: PayloadAction<{ data: LandObj; locale: string }>) => {
          state.status = "succeeded";
          const { data, locale } = action.payload;
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
            Lands: data.Lands.map((land, index) => ({
              LandId: land.LandId,
              Municipality: land.Municipality,
              MainNo: land.MainNo,
              SubNo: land.SubNo,
              PlotNo: land.PlotNo,
              NoOfReferencedLands: land.NoOfReferencedLands,
              AreaInForest: formatNumber(land.AreaInForest.toString(), locale),
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
              LandLayer: null,
            })),
          };
        }
      )
      .addCase(landSummary.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error = action.payload.message;
          // state.error.statusCode = action.payload.statusCode;
        } else {
          state.error = action.error.message;
          // state.error.statusCode = 500;
        }
      })
      .addCase(archiveLand.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        archiveLand.fulfilled,
        (state, action: PayloadAction<{ data: LandObj; locale: string }>) => {
          state.status = "succeeded";
          const { data, locale } = action.payload;

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
            Lands: data.Lands.map((land, index) => ({
              LandId: land.LandId,
              Municipality: land.Municipality,
              MainNo: land.MainNo,
              SubNo: land.SubNo,
              PlotNo: land.PlotNo,
              NoOfReferencedLands: land.NoOfReferencedLands,
              AreaInForest: formatNumber(land.AreaInForest.toString(), locale),
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
                  HasSubRows: false,
                  HasSubSubRows: false,
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
              LandLayer: null,
            })),
          };
        }
      )
      .addCase(archiveLand.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      });
  },
});

//export const { setLandSummaryUnit } = landSummarySlice.actions;
export default landSummarySlice.reducer;

export interface LandObj {
  TotalLandsCount: number;
  TotalSharedLandsCount: number;
  TotalForestArea: string;
  TotalMountainArea: string;
  TotalAgricultureArea: string;
  TotalArea: string;
  Lands: LandInfo[];
}

export interface LandInfo {
  LandId: number;
  Municipality: string;
  MainNo: string;
  SubNo: string;
  PlotNo: string;
  NoOfReferencedLands: number;
  AreaInForest: string;
  AreaInMountain: string;
  AreaInAgriculture: string;
  TotalArea: string;
  Notes: string;
  OwnershipTypeId: number;
  OwnershipType: string;
  LandOwnerId: number;
  DisplayName: string;
  LandOwners: LandOwnerInfo[];
  LandUnits: LandUnitInfo[];
  SubTableContant: string;
  LandUnit: string; // only used in owners table=>owners land sub table
  HasSubRows: boolean;
  SubContent: LandInfo[];
  SubSubRows: string;
  HasSubSubRows: boolean;
  availableNames: [];
  selectedNames: [];
  LandLayer: any[] | null;
  MapGeoJson: string; // used for dto match for unit land fetch data
}

export interface LandOwnerInfo {
  LandOwnerId: number;
  SystemUserId: number;
  LandIdq: number;
  ContactOwnerLandId: number;
  DisplayName: string;
  FullName: string;
  Email: string;
  ContactNumber: string;
  IsSelected: boolean;
  IsSharedLandOwner: boolean;
}

export interface LandUnitInfo {
  UnitId: number;
  Unit: string;
  LandTypeId: number;
}

export interface tblLandInfo {
  LandId: number;
  Municipality: string;
  MainNo: string;
  SubNo: string;
  PlotNo: string;
  NoOfReferencedLands: number;
  AreaInForest: number;
  AreaInMountain: number;
  AreaInAgriculture: number;
  TotalArea: number;
  Notes: string;
  OwnershipTypeId: number;
  OwnershipType: string;
  LandOwnerId: number;
  DisplayName: string;
  LandOwners: LandOwnerInfo[];
  LandUnits: LandUnitInfo[];
  SubTableContant: string;
}

////////////////////////////

// import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { landSummery } from "../thunk/landSummaryThunk";

// interface LandState {
//   landDetails: LandObj | null;
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: LandState = {
//   landDetails: null,
//   status: "idle",
//   error: null,
// };

// const landSummarySlice = createSlice({
//   name: "landSummary",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(landSummery.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(
//         landSummery.fulfilled,
//         (state, action: PayloadAction<LandObj>) => {
//           state.status = "succeeded";
//           state.landDetails = {
//             totalLandsCount: action.payload.totalLandsCount,
//             totalSharedLandsCount: action.payload.totalSharedLandsCount,
//             totalForestArea: action.payload.totalForestArea,
//             totalMountainArea: action.payload.totalMountainArea,
//             totalAgricultureArea: action.payload.totalAgricultureArea,
//             totalArea: action.payload.totalArea,
//             lands: action.payload.lands.map((land) => ({
//               landId: land.landId,
//               municipality: land.municipality,
//               mainNo: land.mainNo,
//               subNo: land.subNo,
//               plotNo: land.plotNo,
//               noOfReferencedLands: land.noOfReferencedLands,
//               areaInForest: land.areaInForest,
//               areaInMountain: land.areaInMountain,
//               areaInAgriculture: land.areaInAgriculture,
//               totalArea: land.totalArea,
//               notes: land.notes,
//               ownershipTypeId: land.ownershipTypeId,
//               ownershipType: land.ownershipType,
//               landOwnerId: land.landOwnerId,
//               displayName: land.displayName,
//               landOwners: land.landOwners.map((owner) => ({
//                 landOwnerId: owner.landOwnerId,
//                 systemUserId: owner.systemUserId,
//                 landId: owner.landId,
//                 contactOwnerLandId: owner.contactOwnerLandId,
//                 displayName: owner.displayName,
//                 fullName: owner.fullName,
//                 email: owner.email,
//                 contactNumber: owner.contactNumber,
//                 isSelected: owner.isSelected,
//                 isSharedLandOwner: owner.isSharedLandOwner,
//               })),
//               landUnits: land.landUnits.map((unit) => ({
//                 unitId: unit.unitId,
//                 unit: unit.unit,
//                 landTypeId: unit.landTypeId,
//               })),
//             })),
//           };
//         }
//       )
//       .addCase(landSummery.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       });
//   },
// });

// export default landSummarySlice.reducer;

// export interface LandObj {
//   totalLandsCount: number;
//   totalSharedLandsCount: number;
//   totalForestArea: number;
//   totalMountainArea: number;
//   totalAgricultureArea: number;
//   totalArea: number;
//   lands: LandInfo[];
// }

// export interface LandInfo {
//   landId: number;
//   municipality: string;
//   mainNo: string;
//   subNo: string;
//   plotNo: string;
//   noOfReferencedLands: number;
//   areaInForest: number;
//   areaInMountain: number;
//   areaInAgriculture: number;
//   totalArea: number;
//   notes: string;
//   ownershipTypeId: number;
//   ownershipType: string;
//   landOwnerId: number;
//   displayName: string;
//   landOwners: LandOwnerInfo[];
//   landUnits: LandUnitInfo[];
// }

// export interface LandOwnerInfo {
//   landOwnerId: number;
//   systemUserId: number;
//   landId: number;
//   contactOwnerLandId: number;
//   displayName: string;
//   fullName: string;
//   email: string;
//   contactNumber: string;
//   isSelected: boolean;
//   isSharedLandOwner: boolean;
// }

// export interface LandUnitInfo {
//   unitId: number;
//   unit: string;
//   landTypeId: number;
// }
