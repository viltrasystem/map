import { setRootNode } from "../slices/unitTreeSlice";
import { UserUnit } from "../slices/userUnitSlice";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { NodeData } from "../lib/types";
import { RootState } from "../app/store";

const useUserUnit = () => {
  const dispatch = useAppDispatch();
  const { userUnitList } = useAppSelector((state) => state.userUnit);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const rootNodeSelect = (unitId: number) => {
    const selectedUnit: UserUnit = userUnitList.find(
      (obj) => obj.UnitID === unitId
    )!;

    const isOnlyMunicipality: boolean = // check the selected root unit have user acess only for manucipility user
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
      Children: [],
    };
    dispatch(setRootNode(rootNodeState));
    console.log("selector run after root set");
  };
  return { rootNodeSelect };
};

export default useUserUnit;
