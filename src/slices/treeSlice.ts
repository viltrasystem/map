import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  findObjectById,
  updateChildren,
  updateExpandStatus,
} from "../hooks/customFunctions";
import { NodeData } from "../lib/types";

const treeRootUnit: NodeData = {
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
  IsLandOwner: false, ////
  IsGuest: false,
  IsExpanded: false,
  Children: undefined,
};

interface TreeState {
  selectedRootUnitId: number;
  rootNode: NodeData;
  selectedNode: NodeData | undefined;
  loading: boolean;
  error: string | null;
}

const initialState: TreeState = {
  selectedRootUnitId: 0,
  rootNode: treeRootUnit,
  selectedNode: treeRootUnit,
  loading: false,
  error: null,
};

const treeSlice = createSlice({
  name: "tree",
  initialState: initialState,
  reducers: {
    setSelectedRootUnitId: (state, action: PayloadAction<number>) => {
      state.selectedRootUnitId = action.payload;
    },
    setSelectedRootNode(state, action: PayloadAction<NodeData>) {
      state.rootNode = action.payload;
      state.selectedNode = undefined;
    },
    setSelectedNode(state, action: PayloadAction<number>) {
      const unitId = Number(action.payload);

      state.selectedNode = findObjectById(state.rootNode, unitId);
    },
    setNodeExpandStatus(
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
    setChildNodes(state, action: PayloadAction<NodeData[]>) {
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
  },
});

export const {
  setSelectedRootUnitId,
  setSelectedRootNode,
  setSelectedNode,
  setNodeExpandStatus,
  setChildNodes,
} = treeSlice.actions;

export default treeSlice.reducer;
