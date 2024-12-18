import TreeView from "./TreeView";
import React from "react";

const Tree = () => {
  return (
    <div className="mt-2">
      <TreeView />
    </div>
  );
};

//export default Tree;
export const MemorizedTree = React.memo(Tree);
