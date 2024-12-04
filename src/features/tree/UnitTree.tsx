import { useEffect } from "react";

import React from "react";
import { useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";

import useUserUnit from "../../hooks/useUserUnit";
import UnitTreeView from "./UnitTreeView";

interface UnitTreePops {
  selectionType: number;
}

const UnitTree = ({ selectionType }: UnitTreePops) => {
  const { rootNode, rootUnitId } = useAppSelector(
    (state: RootState) => state.unitTree
  );
  const { rootNodeSelect } = useUserUnit();

  useEffect(() => {
    if (rootUnitId > 0 && rootNode.UnitID !== rootUnitId) {
      rootNodeSelect(rootUnitId);
    }
  }, []);

  return (
    <>
      {rootUnitId > 0 && (
        <div className="h-full">
          <UnitTreeView selectionType={selectionType} />
        </div>
      )}
    </>
  );
};

//export default Tree;
export const MemorizedUnitTree = React.memo(UnitTree);
