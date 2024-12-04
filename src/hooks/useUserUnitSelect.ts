import { setSelectedRootNode } from "../slices/treeSlice";
import { UserUnit } from "../slices/userUnitSlice";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { NodeData } from "../lib/types";
import { RootState } from "../app/store";
import { setSummaryUnit } from "../slices/summarySlice";

const useUserUnitSelect = () => {
  const dispatch = useAppDispatch();
  const userUnit = useAppSelector((state) => state.userUnit);
  const { user } = useAppSelector((state: RootState) => state.auth);

  const selectRootNode = (unitId: number) => {
    const selectedUnit: UserUnit = userUnit.find(
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
      Children: undefined,
    };
    dispatch(setSelectedRootNode(rootNodeState));
    dispatch(
      // to load land according to root unit selected
      setSummaryUnit({
        unitId: selectedUnit.UnitID,
        summaryType: "land", //but select according to land tab selected state(only load)
      })
    );
  };
  return { selectRootNode };
};

export default useUserUnitSelect;
