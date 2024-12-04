import React, { useEffect, useRef, useState } from "react";
import ContextMenu from "../../ui/ContextMenu";
import { findObjectById } from "../../hooks/customFunctions";
import {
  setChildNodes,
  setNodeExpandStatus,
  setSelectedNode,
} from "../../slices/treeSlice";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { useGetChildUnitsQuery } from "../../services/treeApi";
//import { createPopper } from "@popperjs/core";
import { usePopper } from "react-popper";
import { RootState } from "../../app/store";
import { setSummaryUnit } from "../../slices/summarySlice";

const initialContextMenu = {
  isOpen: false,
  // x: 0,
  // y: 0,
  unitId: 0,
  userId: 0,
};

type NodeProps = {
  label: string;
  unitId: number;
};

const Node: React.FC<NodeProps> = ({ label, unitId }) => {
  const dispatch = useAppDispatch();
  const { selectedNode, rootNode } = useAppSelector((state) => state.tree);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [contextMenu, setContextMenu] = useState(initialContextMenu);

  const [shouldFetchData, setShouldFetchData] = useState(false);

  const [CurUnitID, setCurUnitID] = useState(0);

  const referenceElement = useRef<HTMLDivElement | null>(null);
  const [menuElement] = useState(null);
  const { styles, attributes } = usePopper(
    referenceElement.current,
    menuElement,
    {
      placement: "left-start", // Adjust the placement of the context menu
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [-50, -50], // Adjust the offset of the context menu
          },
        },
      ],
    }
  );

  const initialNode = {
    parentId: CurUnitID,
    isUserOnlyOnMunicipality: rootNode.IsUserOnlyOnMunicipality,
    isGuest: rootNode.IsGuest,
  };
  const {
    data: fetchedChildUnits,
    isLoading,
    isError,
    error,
  } = useGetChildUnitsQuery(initialNode, {
    skip: shouldFetchData, // Set skip based on the state
  });

  const node = findObjectById(rootNode, Number(unitId));
  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    //const { clientX, clientY } = event;
    setContextMenu({
      isOpen: true,
      // x: clientX,
      // y: clientY,
      unitId: Number(event.currentTarget.id),
      userId: user.UserId,
    });
    //alert(`${clientX}, ${clientY}`);
  };

  const contextMenuClose = () => setContextMenu(initialContextMenu);

  const handleExpand = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const nodeData = findObjectById(rootNode, Number(event.currentTarget.id));
    if (nodeData) {
      if (!nodeData.IsExpanded) {
        if (nodeData.Children && nodeData.Children.length > 0) {
          // if already expanded
          dispatch(
            setNodeExpandStatus({ unitId: nodeData.UnitID, isExpand: true })
          );
        } else {
          if (
            ((nodeData.Children && nodeData.Children.length === 0) ||
              nodeData.Children === undefined) && // in root element child is empty array
            nodeData.ChildCount > 0
          ) {
            // need to get data, since no children loaded yet
            setShouldFetchData(true);
            setCurUnitID(nodeData.UnitID);
          } else {
            // should not reach here
            console.log(
              "child available.....................................................................................................",
              nodeData.Children
            );
          }
        }
      } else {
        // set expand status to false for respective node(which already expanded)
        dispatch(
          setNodeExpandStatus({ unitId: nodeData.UnitID, isExpand: false })
        );
      }
    }
  };

  useEffect(() => {
    console.log("node.tsx:", shouldFetchData);
    if (fetchedChildUnits && !isLoading && !error) {
      // console.log("Dispatching setChildNodes", fetchedChildUnits);
      if (
        fetchedChildUnits.length > 0 &&
        CurUnitID &&
        CurUnitID !== 0 &&
        fetchedChildUnits[0].ParentID === CurUnitID
      ) {
        // console.log("Dispatching setChildNodes run", fetchedChildUnits);
        dispatch(setChildNodes(fetchedChildUnits)); //after fetching set child nodes
      }
      // Reset shouldFetchData after fetching data
      setShouldFetchData(false);
    }
  }, [
    CurUnitID,
    shouldFetchData,
    fetchedChildUnits,
    isLoading,
    error,
    isError,
    dispatch,
  ]);

  const selectUnit = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const id = event.currentTarget.id;
    if (id) {
      dispatch(setSelectedNode(Number(id)));
      dispatch(
        setSummaryUnit({
          unitId: Number(id),
          summaryType: "land", //but select according to land tab selected state
        })
      );
      console.log("unit selected:", id);
    } else {
      console.log("error occured");
    }
  };

  return (
    <>
      <div
        className={`${
          selectedNode?.UnitID === node?.UnitID
            ? "text-sky-500 dark:text-hoverBlue"
            : ""
        } flex gap-1 h-5`}
      >
        <div>
          {node && node.ChildCount > 0 && (
            <button
              id={node.UnitID.toString()}
              // data-node={JSON.stringify(node)}
              onClick={handleExpand}
            >
              <span className="text-[12px] cursor-pointer">
                {node.IsExpanded ? "\u25BC" : "\u25BA"}
              </span>
            </button>
          )}
          {node && node.ChildCount == 0 && (
            <button>
              <span className="text-[12px]">{`\u2014`}</span>
            </button>
          )}
        </div>
        <div
          id={unitId.toString()}
          className="inline-block cursor-pointer text-[13px] mt-[4px]"
          ref={referenceElement}
          onContextMenu={handleContextMenu}
          onClick={(e) => selectUnit(e)}
        >
          <span className="cursor-pointer">{label}</span>
        </div>
      </div>
      {/* {isOpen && (
        <div
          style={{
            visibility: isOpen ? "visible" : "hidden",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "5px",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li onClick={closeMenu}>Menu Item 1</li>
            <li onClick={closeMenu}>Menu Item 2</li>
            <li onClick={closeMenu}>Menu Item 3</li>
          </ul>
        </div>
      )} */}
      {node?.UnitTypeID != 6 &&
        rootNode?.UnitTypeID != 0 &&
        contextMenu.isOpen && (
          <ContextMenu
            styles={styles}
            attributes={attributes}
            //setMenuElement={setMenuElement}
            // x={contextMenu.x}
            // y={contextMenu.y}
            unitId={contextMenu.unitId}
            userId={contextMenu.userId}
            onContextMenuClose={contextMenuClose}
          />
        )}
    </>
  );
};

export default Node;
