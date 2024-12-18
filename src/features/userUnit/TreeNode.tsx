import Node from "./Node";
import { NodeData } from "../../lib/types";

interface TreeNodeProps {
  node: NodeData;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
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
