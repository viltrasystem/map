import useUserUnitSelect from "../../hooks/useUserUnitSelect";
import { useEffect } from "react";
import TreeView from "./TreeView";
import React from "react";
import { useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";

const Tree = () => {
  const { rootNode, selectedRootUnitId } = useAppSelector(
    (state: RootState) => state.tree
  );
  const { selectRootNode } = useUserUnitSelect();

  useEffect(() => {
    if (selectedRootUnitId > 0 && rootNode.UnitID !== selectedRootUnitId) {
      selectRootNode(selectedRootUnitId);
    }
  }, []);

  return (
    <div className="mt-2">
      <TreeView />
    </div>
  );
};

//export default Tree;
export const MemorizedTree = React.memo(Tree);
