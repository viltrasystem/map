import { setRootNodeAndRootId } from "../slices/treeSlice";
import { UserUnit } from "../slices/userUnitSlice";
import { NodeData } from "../lib/types";
//import { setSummaryUnit } from "../slices/summarySlice";
import { RootState } from "../app/store";
import { Dispatch } from "@reduxjs/toolkit";

export const selectRootNode = (
  unitId: number,
  userUnitList: UserUnit[],
  user: RootState["auth"]["user"],
  dispatch: Dispatch
) => {
  if (!userUnitList || userUnitList.length === 0) {
    console.error(
      "Cannot select root node because userUnitList is unavailable"
    );
    return;
  }

  const selectedUnit: UserUnit | undefined = userUnitList.find(
    (obj) => obj.UnitID === unitId
  );

  if (!selectedUnit) {
    console.error(`Unit with ID ${unitId} not found in userUnitList`);
    return;
  }

  console.log(userUnitList, unitId, "selectRootNode function");

  const isOnlyMunicipality: boolean =
    !user.IsAdmin &&
    !selectedUnit.IsHead &&
    !selectedUnit.IsReporter &&
    !selectedUnit.IsExporter &&
    !selectedUnit.IsPriceUser &&
    selectedUnit.IsMunicipalityUser;

  const rootNodeState: NodeData = {
    UnitID: selectedUnit.UnitID,
    Unit: selectedUnit.Unit,
    UnitTypeID: selectedUnit.UnitTypeID,
    ReferenceID: selectedUnit.ReferenceID,
    ImgUrl: selectedUnit.ImgUrl,
    ParentUnit: selectedUnit.ParentUnit,
    ParentID: -1,
    ChildCount: selectedUnit.ChildCount,
    ChildTeamsCount: selectedUnit.ChildTeamsCount,
    IsActiveForHunting: selectedUnit.IsActiveForHunting,
    IsHuntingComplete: selectedUnit.IsHuntingComplete,
    IsArchived: selectedUnit.IsArchived,
    IsAllowedToRegisterLands: selectedUnit.IsAllowedToRegisterLands,
    IsUserOnlyOnMunicipality: isOnlyMunicipality,
    IsHead: selectedUnit.IsHead,
    IsExporter: selectedUnit.IsExporter,
    IsPriceUser: selectedUnit.IsPriceUser,
    IsLandAssignableUser: selectedUnit.IsLandAssignableUser,
    IsLandOwner: selectedUnit.IsLandOwner,
    IsGuest: selectedUnit.IsGuest,
    IsExpanded: false,
    Children: undefined,
  };

  // Dispatch actions to update the store
  dispatch(setRootNodeAndRootId(rootNodeState));
  // dispatch(
  //   setSummaryUnit({
  //     unitId: selectedUnit.UnitID,
  //     summaryType: "land", // Customize this as needed based on tab state
  //   })
  // );
};
