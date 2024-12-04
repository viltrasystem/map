import React, { useEffect, useMemo, useState } from "react";
import {
  findChildCheckedNodeExist,
  findObjectById,
  findParentCheckedNodeExist,
} from "../../hooks/customFunctions";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  CheckedNode,
  setCheckedUnit,
  setNode,
  setTreeNodeExpandStatus,
  setUnCheckedUnit,
  setUnitChildNodes,
} from "../../slices/unitTreeSlice";
import { UnitChildQueryParams } from "../../services/unitTreeApi";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NodeData } from "../../lib/types";
import treeUnitApi from "../../services/unitTreeApi";
import store from "../../app/store";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getToastOptions } from "../../lib/helpFunction";
import { useDarkMode } from "../../context/DarkModeContext";

type NodeProps = {
  label: string;
  unitId: number;
  selectionType?: number;
};

const UnitNode: React.FC<NodeProps> = ({ label, unitId, selectionType }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { selectedNode, rootNode, checkedNode } = useAppSelector(
    (state) => state.unitTree
  );
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [CurUnitID, setCurUnitID] = useState(0);

  console.log(
    "checkedNode re render",
    !selectedNode?.IsActiveForHunting || selectedNode?.IsArchived,
    !selectedNode?.IsActiveForHunting,
    selectedNode?.IsArchived,
    selectedNode
  );

  const initialNode: UnitChildQueryParams = {
    parentId: CurUnitID,
    isUserOnlyOnMunicipality: rootNode.IsUserOnlyOnMunicipality,
    isGuest: rootNode.IsGuest,
  };

  const {
    data: fetchedChildUnits,
    isLoading,
    isError,
    error,
  }: UseQueryResult<NodeData[], AxiosError> = useQuery({
    queryKey: ["child", initialNode.parentId],
    queryFn: () => treeUnitApi.unitChildNode(initialNode),
    enabled: !!initialNode.parentId,
    select: (data) => {
      return data.filter((node) => {
        return node.UnitTypeID !== 6;
      });
    },
  });

  const node = findObjectById(rootNode, Number(unitId));

  const handleExpand = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const nodeData = findObjectById(rootNode, Number(event.currentTarget.id));
    if (nodeData) {
      if (!nodeData.IsExpanded) {
        if (nodeData.Children && nodeData.Children.length > 0) {
          dispatch(
            setTreeNodeExpandStatus({ unitId: nodeData.UnitID, isExpand: true })
          );
        } else {
          if (
            ((nodeData.Children && nodeData.Children.length === 0) ||
              nodeData.Children === undefined) &&
            nodeData.ChildCount > 0
          ) {
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
        dispatch(
          setTreeNodeExpandStatus({ unitId: nodeData.UnitID, isExpand: false })
        );
      }
    }
  };

  useEffect(() => {
    if (fetchedChildUnits && !isLoading && !error) {
      if (
        fetchedChildUnits.length > 0 &&
        CurUnitID &&
        CurUnitID !== 0 &&
        fetchedChildUnits[0].ParentID === CurUnitID
      ) {
        dispatch(setUnitChildNodes(fetchedChildUnits));
      }
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
      dispatch(setNode(Number(id)));
      console.log("unit selected:", id);
    } else {
      console.log("error occured");
    }
  };

  // const handleCheckboxChange = () => {
  //   if (node && selectionType) {
  //     let isChildCheckedNodeExist = false;
  //     const checkedUnit = checkedNode?.find(
  //       (unit: CheckedNode) =>
  //         unit.UnitId === node.UnitID && unit.LandTypeId === selectionType
  //     );
  //     if (checkedNode) {
  //       isChildCheckedNodeExist = findChildCheckedNodeExist(
  //         node,
  //         store.getState().unitTree.checkedNode
  //       );
  //     }
  //     if (!isChildCheckedNodeExist) {
  //       let isParentCheckedNodeExist = false;
  //       if (checkedNode) {
  //         isParentCheckedNodeExist = findParentCheckedNodeExist(
  //           node,
  //           store.getState().unitTree.checkedNode
  //         );
  //       }
  //       if (!isParentCheckedNodeExist) {
  //         const isChecked = !checkedUnit?.IsChecked; // if no checkedUnit found, treat it as unchecked

  //         const updatedCheckedUnit: CheckedNode = {
  //           UnitId: node.UnitID,
  //           ParentId: node.ParentID,
  //           Unit: node.Unit,
  //           LandTypeId: Number(selectionType),
  //           IsChecked: isChecked, // Toggle based on existence of checkedUnit
  //         };

  //         // Dispatch action based on whether it's being checked or unchecked
  //         dispatch(
  //           isChecked
  //             ? setCheckedUnit(updatedCheckedUnit)
  //             : setUnCheckedUnit(updatedCheckedUnit)
  //         );

  //         console.log(
  //           `Checkbox state changed for UnitID: ${node?.UnitID} - IsChecked: ${isChecked}`,
  //           updatedCheckedUnit
  //         );
  //       } else {
  //         const updatedCheckedUnit: CheckedNode = {
  //           UnitId: node.UnitID,
  //           ParentId: node.ParentID,
  //           Unit: node.Unit,
  //           LandTypeId: Number(selectionType),
  //           IsChecked: false, // Toggle based on existence of checkedUnit
  //         };
  //         dispatch(setUnCheckedUnit(updatedCheckedUnit));
  //         toast.error(t("land:parent_already_selected_msg"), {
  //           ...getToastOptions,
  //           position: "top-center",
  //           theme: isDarkMode ? "dark" : "light",
  //           style: {
  //             backgroundColor: isDarkMode ? "#111827" : "#f1f5f9",
  //             color: isDarkMode ? "#e5e7eb" : "#334155",
  //           },
  //         });
  //       }
  //     } else {
  //       const updatedCheckedUnit: CheckedNode = {
  //         UnitId: node.UnitID,
  //         ParentId: node.ParentID,
  //         Unit: node.Unit,
  //         LandTypeId: Number(selectionType),
  //         IsChecked: false, // Toggle based on existence of checkedUnit
  //       };
  //       dispatch(setUnCheckedUnit(updatedCheckedUnit));
  //       toast.error(t("land:child_already_selected_msg"), {
  //         ...getToastOptions,
  //         position: "top-center",
  //         theme: isDarkMode ? "dark" : "light",
  //         style: {
  //           backgroundColor: isDarkMode ? "#111827" : "#f1f5f9",
  //           color: isDarkMode ? "#e5e7eb" : "#334155",
  //         },
  //       });
  //     }
  //   }
  // };

  const handleCheckboxChange = () => {
    if (!node || !selectionType) return;

    const checkedNodes = store.getState().unitTree.checkedNode;
    const checkedUnit = checkedNode?.find(
      (unit: CheckedNode) =>
        unit.UnitId === node.UnitID && unit.LandTypeId === selectionType
    );

    const isChildCheckedNodeExist = findChildCheckedNodeExist(
      node,
      checkedNodes,
      selectionType
    );
    if (isChildCheckedNodeExist) {
      handleUncheckNode("land:child_already_selected_msg");
      return;
    }

    const isParentCheckedNodeExist = findParentCheckedNodeExist(
      node,
      checkedNodes,
      selectionType
    );
    if (isParentCheckedNodeExist) {
      handleUncheckNode("land:parent_already_selected_msg");
      return;
    }

    toggleCheckNode(checkedUnit);
  };

  const toggleCheckNode = (checkedUnit: CheckedNode | undefined) => {
    if (node) {
      const isChecked = !checkedUnit?.IsChecked;
      const updatedCheckedUnit: CheckedNode = {
        UnitId: node.UnitID,
        ParentId: node.ParentID,
        Unit: node.Unit,
        LandTypeId: Number(selectionType),
        IsChecked: isChecked,
      };

      dispatch(
        isChecked
          ? setCheckedUnit(updatedCheckedUnit)
          : setUnCheckedUnit(updatedCheckedUnit)
      );
    }
  };

  const handleUncheckNode = (errorMessageKey: string) => {
    if (node) {
      const updatedCheckedUnit: CheckedNode = {
        UnitId: node.UnitID,
        ParentId: node.ParentID,
        Unit: node.Unit,
        LandTypeId: Number(selectionType),
        IsChecked: false,
      };

      dispatch(setUnCheckedUnit(updatedCheckedUnit)); // to clear check state on checkbox

      toast.error(t(errorMessageKey), {
        ...getToastOptions,
        position: "top-center",
        theme: isDarkMode ? "dark" : "light",
        style: {
          backgroundColor: isDarkMode ? "#111827" : "#f1f5f9",
          color: isDarkMode ? "#e5e7eb" : "#334155",
        },
      });
    }
  };

  const CurrentCheckedUnit = useMemo(() => {
    return checkedNode.find(
      (checkedUnit) =>
        checkedUnit.UnitId === node?.UnitID &&
        checkedUnit.LandTypeId === selectionType
    );
  }, [checkedNode]);

  return (
    <>
      <div
        className={`${
          // no usage of color, since selection not matter here for land unit select
          selectedNode?.UnitID === node?.UnitID
            ? "text-sky-500 dark:text-hoverBlue"
            : ""
        } flex gap-1 h-6 ${
          !node?.IsActiveForHunting || node?.IsArchived ? "opacity-60" : ""
        }`}
      >
        <div>
          {node && node.ChildCount > 0 && node.UnitTypeID < 5 && (
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
          {node && (node.ChildCount === 0 || node.UnitTypeID >= 5) && (
            <button>
              <span className="text-[12px]">{`\u2014`}</span>
            </button>
          )}
        </div>
        <div className="relative  w-full">
          {node && node?.UnitTypeID >= 4 && (
            <div className="">
              <input
                type="checkbox"
                id={`checkbox-${node?.UnitID}`}
                name={`checkbox-${node?.UnitID}`}
                className="absolute opacity-0 h-0 w-0"
                checked={
                  (CurrentCheckedUnit?.IsChecked &&
                    CurrentCheckedUnit.LandTypeId === selectionType) ||
                  false
                }
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor={`checkbox-${node?.UnitID}`}
                className={`cursor-pointer flex items-center justify-center w-3 h-3 border-2 absolute  top-2 rounded ${
                  CurrentCheckedUnit?.IsChecked &&
                  CurrentCheckedUnit.LandTypeId === selectionType
                    ? "bg-sky-500 border-sky-500 dark:bg-hoverBlue dark:border-hoverBlue"
                    : "border-gray-400"
                }`}
              >
                {CurrentCheckedUnit &&
                  CurrentCheckedUnit.IsChecked &&
                  CurrentCheckedUnit.LandTypeId === selectionType && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
              </label>
            </div>
          )}
          <div
            id={unitId.toString()}
            className={`inline-block cursor-pointer text-[13px] mt-[4px] absolute ${
              node && node?.UnitTypeID >= 4 ? " left-5" : ""
            }`}
            onClick={selectUnit}
          >
            <span className="cursor-pointer">{label}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnitNode;

// const handleCheckboxChange = () => {
//   //setIsChecked(!isChecked);
//   if (checkedNode) {
//     const checkedUnit = checkedNode.find((checkedUnit) => {
//       return checkedUnit.UnitId === unitId;
//     });
//     if (checkedUnit) {
//       // SetCurrentCheckedUnit(checkedUnit);
//       if (node && selectionType) {
//         const unCheckedUnit: CheckedNode = {
//           UnitId: node.UnitID,
//           Unit: node.Unit,
//           LandTypeId: Number(selectionType),
//           IsChecked: !CurrentCheckedUnit?.IsChecked,
//         };

//         dispatch(setUnCheckedUnit(unCheckedUnit));
//         console.log(
//           `un Checkbox state changed for UnitID: ${node?.UnitID}`,
//           checkedUnit
//         );
//       }
//     } else {
//       if (node && selectionType) {
//         const checkedUnit: CheckedNode = {
//           UnitId: node.UnitID,
//           Unit: node.Unit,
//           LandTypeId: Number(selectionType),
//           IsChecked: true,
//         };

//         dispatch(setCheckedUnit(checkedUnit));
//         console.log(
//           `Checkbox state changed for UnitID: ${node?.UnitID}`,
//           checkedUnit
//         );
//       }
//     }
//   } else {
//     if (node && selectionType) {
//       const checkedUnit: CheckedNode = {
//         UnitId: node.UnitID,
//         Unit: node.Unit,
//         LandTypeId: Number(selectionType),
//         IsChecked: true,
//       };

//       dispatch(setCheckedUnit(checkedUnit));
//       console.log(`newly added: ${node?.UnitID}`, checkedUnit);
//     }
//   }
//   if (node && selectionType) {
//     const checkedUnit: CheckedNode = {
//       UnitId: node.UnitID,
//       Unit: node.Unit,
//       LandTypeId: Number(selectionType),
//       IsChecked: true,
//     };

//     dispatch(setCheckedUnit(checkedUnit));
//     console.log(
//       `Checkbox state changed for UnitID: ${node?.UnitID}`,
//       checkedUnit
//     );
//   }
// };

// useEffect(() => {
//   if (checkedNode) {
//     const checkedUnit = checkedNode.find((checkedUnit) => {
//       return checkedUnit.UnitId === unitId && checkedUnit.IsChecked === true;
//     });
//     if (checkedUnit) {
//       SetCurrentCheckedUnit(checkedUnit);
//     }
//   }
// }, [checkedNode]);
