import UnitTreeNode from "./UnitTreeNode";
import { useAppSelector } from "../../app/hook";

interface UnitTreeViewPops {
  selectionType: number;
}

const UnitTreeView = ({ selectionType }: UnitTreeViewPops) => {
  const { rootNode } = useAppSelector((state) => state.unitTree);
  console.log(
    "run root TreeView run root TreeView run root TreeView ",
    rootNode
  );
  return <UnitTreeNode node={rootNode} selectionType={selectionType} />;
};

export default UnitTreeView;
