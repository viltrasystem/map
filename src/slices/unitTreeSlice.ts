import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  findObjectById,
  updateChildren,
  updateExpandStatus,
} from "../hooks/customFunctions";
import { NodeData } from "../lib/types";
// common tree slice
const rootUnit: NodeData = {
  UnitID: 0,
  Unit: "",
  UnitTypeID: 0,
  ParentID: 0,
  ReferenceID: "",
  ImgUrl: "",
  ParentUnit: "",
  ChildCount: 0,
  ChildTeamsCount: 0,
  IsActiveForHunting: false,
  IsHuntingComplete: false,
  IsArchived: false,
  IsAllowedToRegisterLands: false,
  IsUserOnlyOnMunicipality: false,
  IsHead: false,
  IsExporter: true,
  IsPriceUser: false,
  IsLandAssignableUser: false,
  IsLandOwner: false,
  IsGuest: false,
  IsExpanded: false,
  Children: [],
};

interface UnitTreeState {
  rootUnitId: number;
  rootNode: NodeData;
  selectedNode: NodeData | undefined;
  checkedNode: CheckedNode[];
  loading: boolean;
  error: string | null;
}

export type CheckedNode = {
  UnitId: number;
  ParentId: number;
  Unit: string;
  LandTypeId: number;
  IsChecked: boolean;
};

const initialState: UnitTreeState = {
  rootUnitId: 0,
  rootNode: rootUnit,
  selectedNode: rootUnit,
  loading: false,
  error: null,
  checkedNode: [],
};

const treeSlice = createSlice({
  name: "unitTree",
  initialState: initialState,
  reducers: {
    setRootUnitId: (state, action: PayloadAction<number>) => {
      state.rootUnitId = action.payload;
      console.log(state.rootUnitId, "userid set/unitTree");
    },
    setRootNode(state, action: PayloadAction<NodeData>) {
      console.log(action.payload), "root node set slice/unitTree";
      state.rootNode = action.payload;
      state.selectedNode = undefined;
    },
    setNode(state, action: PayloadAction<number>) {
      const unitId = Number(action.payload);

      state.selectedNode = findObjectById(state.rootNode, unitId);
    },
    setTreeNodeExpandStatus(
      state,
      action: PayloadAction<{ unitId: number; isExpand: boolean }>
    ) {
      const { unitId, isExpand } = action.payload;
      if (state.rootNode.Children === undefined) {
        state.rootNode.IsExpanded = isExpand;
      } else {
        state.rootNode = updateExpandStatus(state.rootNode, unitId, isExpand);
      }
    },
    setUnitChildNodes(state, action: PayloadAction<NodeData[]>) {
      const newChildren = action.payload;
      const parentId = action.payload[0]?.ParentID;
      if (state.rootNode.Children && state.rootNode.Children.length > 0) {
        const newState = updateChildren(
          state.rootNode.Children,
          parentId,
          newChildren
        );
        state.rootNode.Children = newState;
      } else {
        state.rootNode.Children = newChildren;
        state.rootNode.IsExpanded = true;
      }
    },
    setCheckedUnits(state, action: PayloadAction<CheckedNode[]>) {
      state.checkedNode = action.payload;
    },
    setCheckedUnit(state, action: PayloadAction<CheckedNode>) {
      state.checkedNode = state.checkedNode.filter(
        (checkedUnit) =>
          !(
            checkedUnit.UnitId === action.payload.UnitId &&
            checkedUnit.LandTypeId === action.payload.LandTypeId
          )
      );
      state.checkedNode.push(action.payload);
    },
    setUnCheckedUnit(state, action: PayloadAction<CheckedNode>) {
      state.checkedNode = state.checkedNode.filter(
        (checkedUnit) =>
          !(
            checkedUnit.UnitId === action.payload.UnitId &&
            checkedUnit.LandTypeId === action.payload.LandTypeId
          )
      );

      state.checkedNode.push({
        ...action.payload,
      });
    },
  },
});

export const {
  setRootUnitId,
  setRootNode,
  setNode,
  setTreeNodeExpandStatus,
  setUnitChildNodes,
  setCheckedUnit,
  setCheckedUnits,
  setUnCheckedUnit,
} = treeSlice.actions;

export default treeSlice.reducer;
