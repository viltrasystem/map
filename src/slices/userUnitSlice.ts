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

const initialState: UserUnit[] = [];

const userUnitSlice = createSlice({
  name: "userUnit",
  initialState: initialState,
  reducers: {
    setUserUnitList: (state, action: PayloadAction<UserUnit[]>) => {
      console.log(state.values, action.payload, "userlist set");
      return action.payload;
    },
  },
});

export const { setUserUnitList } = userUnitSlice.actions;

export default userUnitSlice.reducer;
