import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserUnit = {
  UnitID: number;
  Unit: string;
  UnitTypeID: number;
  ReferenceID: string;
  ImgUrl: string;
  ParentUnit: string;
  ChildCount: number;
  ChildTeamsCount: number;
  IsActiveForHunting: boolean;
  IsHuntingComplete: boolean;
  IsArchived: boolean;
  IsAllowedToRegisterLands: boolean;
  IsMainUnit: boolean;
  IsMunicipalityUser: boolean;
  IsExporter: boolean;
  IsPriceUser: boolean;
  IsLandAssignableUser: boolean;
  IsLandOwner: boolean;
  IsReporter: boolean;
  IsHead: boolean;
  IsGuest: boolean;
  IsHuntingPolice: boolean;
};

interface UserUnitState {
  userUnitList: UserUnit[];
}
const initialState: UserUnitState = {
  userUnitList: [],
};

const userUnitSlice = createSlice({
  name: "userUnit",
  initialState: initialState,
  reducers: {
    setUserUnitList: (state, action: PayloadAction<UserUnit[]>) => {
      // Replace the entire array immutably

      state.userUnitList = action.payload.map((userUnit) => ({
        ChildCount: userUnit.ChildCount,
        ChildTeamsCount: userUnit.ChildTeamsCount,
        ImgUrl: userUnit.ImgUrl,
        IsActiveForHunting: userUnit.IsActiveForHunting,
        IsAllowedToRegisterLands: userUnit.IsAllowedToRegisterLands,
        IsArchived: userUnit.IsArchived,
        IsExporter: userUnit.IsExporter,
        IsGuest: userUnit.IsGuest,
        IsHead: userUnit.IsHead,
        IsHuntingComplete: userUnit.IsHuntingComplete,
        IsHuntingPolice: userUnit.IsHuntingPolice,
        IsLandAssignableUser: userUnit.IsLandAssignableUser,
        IsLandOwner: userUnit.IsLandOwner,
        IsMainUnit: userUnit.IsMainUnit,
        IsMunicipalityUser: userUnit.IsMunicipalityUser,
        IsPriceUser: userUnit.IsPriceUser,
        IsReporter: userUnit.IsReporter,
        ParentUnit: userUnit.ParentUnit,
        ReferenceID: userUnit.ReferenceID,
        Unit: userUnit.Unit,
        UnitID: userUnit.UnitID,
        UnitTypeID: userUnit.UnitTypeID,
      }));
    },
  },
});

export const { setUserUnitList } = userUnitSlice.actions;

export default userUnitSlice.reducer;
