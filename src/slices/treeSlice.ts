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
    setRootNodeAndRootId(state, action: PayloadAction<NodeData>) {
      return {
        ...state,
        rootNode: action.payload,
        selectedRootUnitId: action.payload.UnitID,
        selectedNode: action.payload,
      };
    },
    setSelectedNode(state, action: PayloadAction<number>) {
      const unitId = Number(action.payload);
      const selectedNode = findObjectById(state.rootNode, unitId);

      return {
        ...state,
        selectedNode,
      };
    },
    setNodeExpandStatus(
      state,
      action: PayloadAction<{ unitId: number; isExpand: boolean }>
    ) {
      const { unitId, isExpand } = action.payload;
      if (state.rootNode.Children === undefined) {
        return {
          ...state,
          rootNode: {
            ...state.rootNode,
            IsExpanded: isExpand,
          },
        };
      } else {
        return {
          ...state,
          rootNode: updateExpandStatus(state.rootNode, unitId, isExpand),
        };
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
        return {
          ...state,
          rootNode: {
            ...state.rootNode,
            Children: newState,
          },
        };
      } else {
        return {
          ...state,
          rootNode: {
            ...state.rootNode,
            Children: newChildren,
            IsExpanded: true,
          },
        };
      }
    },
  },
});

export const {
  setRootNodeAndRootId,
  setSelectedNode,
  setNodeExpandStatus,
  setChildNodes,
} = treeSlice.actions;

export default treeSlice.reducer;
