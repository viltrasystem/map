import React, { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { findObjectById } from "../hooks/customFunctions";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { GrMapLocation } from "react-icons/gr";
import { MdOutlinePersonPinCircle } from "react-icons/md";
import { setSelectedTab } from "../slices/tabSelectionSlice";
import { setSelectedNode } from "../slices/treeSlice";

interface ContextMenuProp {
  // x: number;
  // y: number;
  unitId: number;
  userId: number;
  onContextMenuClose: () => void;
  styles: {
    [key: string]: React.CSSProperties;
  };
  attributes: {
    [key: string]:
      | {
          [key: string]: string;
        }
      | undefined;
  };
  // setMenuElement: React.Dispatch<React.SetStateAction<null>>;
}

const ContextMenu: React.FC<ContextMenuProp> = ({
  // x,
  // y,
  unitId,
  // userId,
  // styles,
  // attributes,
  onContextMenuClose,
  //setMenuElement,
}) => {
  const { rootNode } = useAppSelector((state) => state.tree);
  // const panelRectX: number | null = useReadLocalStorage("panelRectX");
  // const panelRectY: number | null = useReadLocalStorage("panelRectY");
  const dispatch = useAppDispatch();
  const contextMenuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(contextMenuRef, onContextMenuClose);
  const nodeData = findObjectById(rootNode, unitId);
  const navigate = useNavigate();

  // Handle the menu item click
  const handleMenuItemClick = (item: string) => {
    // Navigate to a different path based on the item
    switch (item) {
      case "land":
        dispatch(setSelectedNode(unitId));
        dispatch(setSelectedTab("land"));
        navigate(`/land`);
        break;
      case "landowner":
        dispatch(setSelectedNode(unitId));
        dispatch(setSelectedTab("landowner"));
        navigate(`/land`);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={contextMenuRef}
      onClick={onContextMenuClose}
      className="absolute z-50"
      // style={{ ...styles.popper }}
      // {...attributes.popper}
      // style={{
      //   left: `${
      //     x - (panelRectX ? panelRectX : 0) < 90
      //       ? x - (panelRectX ? panelRectX : 0)
      //       : 90
      //   }px`,
      //   top: `${y - (panelRectY ? panelRectY : 0)}px`,
      // }}
    >
      <ul className="w-48 flex flex-col shadow-md rounded-md overflow-hidden divide-y text-[13px] divide-gray-200 text-blue-500 bg-white dark:bg-gray-900 absolute z-50  border border-gray-200">
        {nodeData?.UnitTypeID != 6 && rootNode?.UnitTypeID != 0 && (
          <li
            onClick={() => handleMenuItemClick("land")}
            className="flex context-menu-item py-1 px-2 gap-5 items-center hover:bg-gray-100 cursor-pointer"
          >
            <span className="">
              <GrMapLocation />
            </span>
            <span>Land Details</span>
          </li>
        )}
        {nodeData?.UnitTypeID != 6 && rootNode?.UnitTypeID != 0 && (
          <li
            onClick={() => handleMenuItemClick("landowner")}
            className="flex context-menu-item py-1 px-1 gap-5 items-center hover:bg-gray-100 cursor-pointer"
          >
            <span className="">
              <MdOutlinePersonPinCircle size={20} />
            </span>
            <span>Land Owner</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ContextMenu;
//text-gray-900 dark:text-gray-100  dark:hover:text-gray-900

/* React Tooltip Example -  chatgpt;*/
// import React, { useState } from "react";
// import { createPopper } from "@popperjs/core";
// import { usePopper } from "react-popper";

// const ContextMenu = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [referenceElement, setReferenceElement] = useState(null);
//   const [menuElement, setMenuElement] = useState(null);
//   const { styles, attributes } = usePopper(referenceElement, menuElement, {
//     placement: "right-start", // Adjust the placement of the context menu
//     modifiers: [
//       {
//         name: "offset",
//         options: {
//           offset: [5, 5], // Adjust the offset of the context menu
//         },
//       },
//     ],
//   });

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const closeMenu = () => {
//     setIsOpen(false);
//   };

//   const handleContextMenu = (event) => {
//     event.preventDefault();
//     toggleMenu();
//   };

//   return (
//     <div>
//       <div
//         ref={setReferenceElement}
//         onContextMenu={handleContextMenu}
//         style={{
//           width: "100px",
//           height: "100px",
//           backgroundColor: "lightblue",
//           textAlign: "center",
//           lineHeight: "100px",
//         }}
//       >
//         Right click me
//       </div>
//       {isOpen && (
//         <div
//           ref={setMenuElement}
//           style={{
//             ...styles.popper,
//             visibility: isOpen ? "visible" : "hidden",
//             backgroundColor: "white",
//             border: "1px solid #ccc",
//             padding: "5px",
//           }}
//           {...attributes.popper}
//         >
//           <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//             <li onClick={closeMenu}>Menu Item 1</li>
//             <li onClick={closeMenu}>Menu Item 2</li>
//             <li onClick={closeMenu}>Menu Item 3</li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// const Example = () => {
//   return (
//     <div style={{ textAlign: "center", marginTop: "100px" }}>
//       <ContextMenu />
//     </div>
//   );
// };

// export default Example;
