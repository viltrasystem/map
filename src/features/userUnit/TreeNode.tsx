import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import { setSelectedNode } from "../../slices/treeSlice";
import Node from "./Node";
import { NodeData } from "../../lib/types";

interface TreeNodeProps {
  node: NodeData;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
  const dispatch = useAppDispatch();

  const { unitId: unitSelected } = useAppSelector(
    (state: RootState) => state.mapping
  );

  useEffect(() => {
    if (node.UnitID === unitSelected) {
      dispatch(setSelectedNode(unitSelected));
    }
  }, [node, unitSelected]);

  return (
    <div>
      <Node label={node.Unit} unitId={node.UnitID}></Node>
      {node.IsExpanded && node.Children && node.Children.length > 0 && (
        <div className="ml-2">
          {node.Children.map((child) => (
            <TreeNode key={child.UnitID} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
