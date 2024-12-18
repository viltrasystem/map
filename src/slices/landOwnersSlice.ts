import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { landOwners } from "../thunk/landOwnersThunk";
import { LandInfo } from "./landSummarySlice";
import { formatFloat, formatInteger, formatNumber } from "../lib/helpFunction";

export type SharedLand = {
  landIdListStr: string | undefined;
  unitId: number;
};

interface OwnersState {
  ownerDetails: LandOwnersObj | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OwnersState = {
  ownerDetails: null,
  status: "idle",
  error: null,
};

const landOwnersSlice = createSlice({
  name: "landOwners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(landOwners.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        landOwners.fulfilled,
        (
          state,
          action: PayloadAction<{ data: LandOwnersObj; locale: string }>
        ) => {
          state.status = "succeeded";
          const { data, locale } = action.payload;
          state.ownerDetails = {
            LandsCount: formatInteger(data.LandsCount, locale),
            OwnersCount: data.OwnersCount,
            UnitTotalArea: formatNumber(data.UnitTotalArea.toString(), locale),
            ForestArea: formatNumber(data.ForestArea.toString(), locale),
            MountainArea: formatNumber(data.MountainArea.toString(), locale),
            AgricultureArea: formatNumber(
              data.AgricultureArea.toString(),
              locale
            ),
            LandOwner: data.LandOwner.map((owner) => ({
              LandId: owner.LandId,
              IsSharedLand: owner.IsSharedLand,
              FullName: owner.FullName,
              DisplayName: owner.DisplayName,
              Email: owner.Email,
              ContactNumber: owner.ContactNumber,
              AddLine1: owner.AddLine1,
              AddLine2: owner.AddLine2,
              AddCity: owner.AddCity,
              BankAccountNo: owner.BankAccountNo,
              Notes: owner.Notes,
              ForestArea: formatNumber(owner.ForestArea.toString(), locale),
              MountainArea: formatNumber(owner.MountainArea.toString(), locale),
              AgricultureArea: formatNumber(
                owner.AgricultureArea.toString(),
                locale
              ),
              TotalArea: formatNumber(owner.TotalArea.toString(), locale),
              LandOwnerForestShare: formatFloat(
                owner.LandOwnerForestShare.toString(),
                locale
              ),
              LandOwnerAgricultureShare: formatFloat(
                owner.LandOwnerAgricultureShare.toString(),
                locale
              ),
              LandOwnerMountainShare: formatFloat(
                owner.LandOwnerMountainShare.toString(),
                locale
              ),
              LandsCount: owner.LandsCount,
              LandOwnerId: owner.LandOwnerId,
              SystemUserId: owner.SystemUserId,
              FName: owner.FName,
              LName: owner.LName,
              LandNote: owner.LandNote,
              Unit: owner.Unit,
              NoOfOccurrences: owner.NoOfOccurrences,
              ContactOwnerLandId: owner.ContactOwnerLandId,
              LandOwnerTotalShare: formatFloat(
                owner.LandOwnerTotalShare.toString(),
                locale
              ),
              LandIdListStr: owner.LandIdListStr,
              HasSubRows: false,
              SubRows: undefined,
              Owners: owner.Owners, //// ***
            })),
          };
        }
      )
      .addCase(landOwners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default landOwnersSlice.reducer;

export interface LandOwnersObj {
  ForestArea: string;
  MountainArea: string;
  AgricultureArea: string;
  LandsCount: string;
  UnitTotalArea: string;
  OwnersCount: number;
  LandOwner: OwnerInfo[];
}

export interface OwnerInfo {
  IsSharedLand: boolean;
  LandId: number;
  LandIdListStr?: string;
  ContactOwnerLandId: number;
  LandOwnerId: number;
  SystemUserId: number;
  DisplayName?: string;
  FName?: string;
  LName?: string;
  FullName?: string;
  Email?: string;
  ContactNumber?: string;
  AddLine1?: string;
  AddLine2?: string;
  AddCity?: string;
  BankAccountNo?: string;
  Notes?: string;
  LandNote?: string;
  Unit?: string;
  NoOfOccurrences: number;
  ForestArea: string;
  MountainArea: string;
  AgricultureArea: string;
  LandOwnerForestShare: string;
  LandOwnerMountainShare: string;
  LandOwnerAgricultureShare: string;
  LandOwnerTotalShare: string;
  Owners: OwnerInfo[];
  LandsCount: number;
  TotalArea: string;
  HasSubRows: boolean;
  SubRows?: LandInfo[];
}

export type OwnerDetailReq = {
  SystemUserId: number;
  LandId: number;
};
