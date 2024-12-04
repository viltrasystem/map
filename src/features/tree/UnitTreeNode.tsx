import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";

import { setNode } from "../../slices/unitTreeSlice";
import UnitNode from "./UnitNode";
import { NodeData } from "../../lib/types";

interface TreeNodeProps {
  node: NodeData;
  selectionType: number;
}

const UnitTreeNode: React.FC<TreeNodeProps> = ({ node, selectionType }) => {
  const dispatch = useAppDispatch();

  const { rootUnitId } = useAppSelector(
    /////////////// edit according to root from realted to current requirement
    (state: RootState) => state.unitTree
  );

  useEffect(() => {
    if (node.UnitID === rootUnitId) {
      dispatch(setNode(rootUnitId));
    }
  }, [node, rootUnitId]);

  return (
    <div>
      <UnitNode
        label={node.Unit}
        unitId={node.UnitID}
        selectionType={selectionType}
      ></UnitNode>
      {node.IsExpanded && node.Children && node.Children.length > 0 && (
        <div className="ml-2">
          {node.Children.map((child) => (
            <UnitTreeNode
              key={child.UnitID}
              node={child}
              selectionType={selectionType}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UnitTreeNode;
