import TreeNode from "./TreeNode";
import { useAppSelector } from "../../app/hook";

const TreeView = () => {
  const { rootNode } = useAppSelector((state) => state.tree);
  console.log("run root TreeView right panel", rootNode);
  return <TreeNode node={rootNode} />;
};

export default TreeView;
