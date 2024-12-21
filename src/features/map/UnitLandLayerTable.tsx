import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import {
  createColumnHelper,
  flexRender,
  getExpandedRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  OnChangeFn,
  ExpandedState,
  FilterFn,
  Row,
} from "@tanstack/react-table";

import { LandInfo } from "../../slices/landSummarySlice";
import {
  LiaSortAmountDownAltSolid,
  LiaSortAmountDownSolid,
  LiaSortSolid,
} from "react-icons/lia";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import IconButton, { IconClasses } from "../../ui/IconButton";
import { debounce } from "lodash";
import { setGlobalFilter } from "../../slices/filterSlice";
import LoadingModal from "../../ui/LoadingModal";
import { useTranslation } from "react-i18next";
import Pagination from "../../ui/Pagination";
import SubSubRow from "../land/SubSubRow";
import { setSelectedLayerState } from "../../slices/selectedLayerSlice";
type UnitLandTableProps = {
  onUnitLayerChanged: () => void;
  toggleState: boolean;
};

const UnitLandLayerTable: React.FC<UnitLandTableProps> = ({
  onUnitLayerChanged,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });
  const selectedRowRef = useRef<HTMLTableRowElement | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<LandInfo[] | undefined>([]);
  const globalFilter = useAppSelector(
    (state: RootState) => state.filter.globalFilter
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { selectedNode } = useAppSelector(
    (state: RootState) => ({
      selectedNode: state.tree.selectedNode,
    }),
    (prev, next) => prev.selectedNode === next.selectedNode
  );

  const { landDetails, status } = useAppSelector(
    (state: RootState) => ({
      landDetails: state.unitLandLayer.landDetails,
      status: state.unitLandLayer.status,
    }),
    (prev, next) =>
      prev.landDetails === next.landDetails && prev.status === next.status
  );

  const pageIndexRef = useRef(pagination.pageIndex);
  const { isLoading } = useAppSelector((state: RootState) => state.loading);

  const iconClasses: IconClasses = {
    padding_x: "xs:px-[1px] sm:px-[2px]",
    background_color:
      "hover:bg-slate-50 active:bg-slate-50 ring-slate-50 dark:hover:bg-slate-50 dark:hover:ring-slate-50 dark:active:bg-slate-50 dark:active:ring-slate-50",
  };

  useEffect(() => {
    if (landDetails) {
      setData(landDetails.Lands);
    } else {
      setData([]);
    }
  }, [landDetails]);

  const columnHelper = createColumnHelper<LandInfo>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("LandId", {
        header: () => null,
        id: "LandId",
        enableSorting: false,
      }),
      columnHelper.accessor("Municipality", {
        header: () => t("landSummaryTable:municipality"),
        cell: (info) => info.renderValue(),
        enableSorting: true,
      }),
      columnHelper.accessor("MainNo", {
        header: () => t("landSummaryTable:main_no"),
        enableSorting: true,
      }),
      columnHelper.accessor("SubNo", {
        id: "SubNo",
        header: () => t("landSummaryTable:sub_no"),
        enableSorting: true,
      }),
      columnHelper.accessor(
        (row) =>
          row.LandOwners
            ? row.LandOwners?.length > 1
              ? row.LandOwners[0]?.FullName + "..."
              : row.LandOwners[0]?.FullName
            : "",
        {
          id: "landOwners",
          header: () => t("landSummaryTable:land_owner_names"),
          enableSorting: true,
        }
      ),
      //   columnHelper.accessor(
      //     (row) =>
      //       row.LandUnits
      //         ? row.LandUnits?.length > 1
      //           ? row.LandOwners[0]?.FullName + "..."
      //           : row.LandUnits[0]?.Unit
      //         : "",
      //     {
      //       id: "landUnits",
      //       header: () => t("landSummaryTable:land_owned_units"),
      //       enableSorting: true,
      //     }
      //   ),
      columnHelper.accessor("AreaInForest", {
        id: "AreaInForest",
        header: () => t("landSummaryTable:area_in_forest"),
        cell: (info) => info.renderValue() || 0,
        footer: () => landDetails?.TotalForestArea || 0,
        enableSorting: true,
      }),
      columnHelper.accessor("AreaInAgriculture", {
        id: "AreaInAgriculture",
        header: () => t("landSummaryTable:area_in_agriculture"),
        cell: (info) => info.renderValue() || 0,
        footer: () => landDetails?.TotalAgricultureArea || 0,
        enableSorting: true,
      }),
      columnHelper.accessor("AreaInMountain", {
        id: "AreaInMountain",
        header: () => t("landSummaryTable:area_in_mountain"),
        cell: (info) => info.renderValue() || 0,
        footer: () => landDetails?.TotalMountainArea || 0,
        enableSorting: true,
      }),
      columnHelper.accessor("TotalArea", {
        id: "TotalArea",
        header: () => t("landSummaryTable:total_area"),
        cell: (info) => info.renderValue() || 0,
        footer: () => landDetails?.TotalArea || 0,
        enableSorting: true,
      }),
    ],
    []
  );
  console.log("unit land table land re render................");
  type headerColorMappingType =
    | "AreaInForest"
    | "AreaInAgriculture"
    | "AreaInMountain";

  const headerColorMapping = {
    AreaInForest:
      "bg-green-200  bg-opacity-50  dark:bg-opacity-80 text-opacity-100 dark:text-gray-600",
    AreaInAgriculture:
      "bg-teal-200 bg-opacity-50 dark:bg-opacity-80 text-opacity-100 dark:text-gray-600",
    AreaInMountain: "bg-blue-200  dark:bg-opacity-80 dark:text-gray-600",
  };

  const customGlobalFilter: FilterFn<LandInfo> = (
    row,
    columnId,
    filterValue
  ) => {
    if (!filterValue) return true; // show all rows if filterValue is empty
    const cellValue = row.getValue(columnId);
    return (
      typeof cellValue === "string" &&
      cellValue.toLowerCase().includes(filterValue.toString().toLowerCase())
    );
  };

  //https://tanstack.com/table/v8/docs/framework/react/examples/pagination
  const table = useReactTable({
    data: data || [],
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination, //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
      expanded,
      sorting,
      globalFilter,
    },
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded as OnChangeFn<ExpandedState>,
    onSortingChange: setSorting, // Handle sorting state
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: customGlobalFilter,
  });

  const handleRowExpand = (rowId: string) => {
    pageIndexRef.current = table.getState().pagination.pageIndex;
    setData((prevData) => {
      const updatedData = prevData?.map((item, index) => {
        if (index == Number(rowId)) {
          return {
            ...item,
            HasSubRows: item.HasSubRows ? true : false,
          };
        }
        return item;
      });

      return updatedData;
    });

    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [rowId]: !prevExpanded[rowId],
    }));
    // setExpanded((prevExpanded) =>
    //   prevExpanded[rowId] !== !prevExpanded[rowId]
    //     ? { ...prevExpanded, [rowId]: !prevExpanded[rowId] }
    //     : prevExpanded
    // );
  };

  useEffect(() => {
    const updatePagination = debounce(() => {
      if (pageIndexRef.current > 0) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: pageIndexRef.current,
        }));
      }
    }, 500);

    updatePagination();

    return () => {
      updatePagination.cancel();
    };
  }, [expanded]);

  useEffect(() => {
    dispatch(setGlobalFilter(""));

    // Cleanup logic for unmount
    return () => {
      dispatch(setGlobalFilter(""));
    };
  }, [dispatch]);

  const handleRowClick = (
    row: Row<LandInfo>,
    rowElement: HTMLTableRowElement
  ) => {
    const rowData = row.original as LandInfo;
    const layerString = `${rowData.LandId}`;
    // console.log(layerString);
    dispatch(
      setSelectedLayerState({
        isClicked: true,
        isMouseEnter: false,
        layerName: layerString,
      })
    );
    onUnitLayerChanged();
    if (selectedRowRef.current) {
      selectedRowRef.current.classList.remove("bg-red-400");
    }
    rowElement.classList.add("bg-red-400");
    selectedRowRef.current = rowElement;
    //  currentSelectedRowId.current = rowData.LandId;
  };

  const handleMouseEnter = (row: Row<LandInfo>) => {
    const rowData = row.original as LandInfo;
    const layerString = `${rowData.LandId}`;
    dispatch(
      setSelectedLayerState({
        isClicked: false,
        isMouseEnter: true,
        layerName: layerString,
      })
    );
    onUnitLayerChanged();
    // if (selectedRowRef.current) {
    //   selectedRowRef.current.classList.remove("bg-red-400");
    // }
    // rowElement.classList.add("bg-red-400");
    // selectedRowRef.current = rowElement;
    // currentSelectedRowId.current = rowData.LandId;
  };

  const handleMouseLeave = (row: Row<LandInfo>) => {
    const rowData = row.original as LandInfo;
    const layerString = `${rowData.LandId}`;
    dispatch(
      setSelectedLayerState({
        isClicked: false,
        isMouseEnter: false,
        layerName: layerString,
      })
    );
    onUnitLayerChanged();
  };

  if (isLoading) return <LoadingModal />;
  return (
    <>
      {selectedNode && status === "succeeded" && (
        // <div className="overflow-x-auto w-full  min-w-full">
        //   <table className="border-collapse table-auto w-full">
        <div className="w-full h-full overflow-auto border rounded-md shadow-md">
          <table className="border-collapse min-w-full min-h-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`xs:py-[2px] xs:px-[2px] md:px-3 md:py-2 font-sans xs:font-extralight md:font-medium xs:text-[9px] sx:text-[0.75rem] md:text-sm lg:text-base xs:text-center md:text-left border-[0.5px] border-slate-300 dark:border-slate-500 text-gray-800 dark:text-gray-200 ${
                        headerColorMapping[
                          header.column.id as headerColorMappingType
                        ] || "bg-slate-200 dark:bg-slate-600"
                      }`}
                    >
                      {!header.isPlaceholder && (
                        <div className="flex items-center justify-between">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() ? (
                            header.column.getIsSorted() ? (
                              <span className="ml-1">
                                {header.column.getIsSorted() === "desc" ? (
                                  <IconButton classes={iconClasses}>
                                    <LiaSortAmountDownSolid
                                      // size={20}
                                      className={`${
                                        headerColorMapping[
                                          header.column
                                            .id as headerColorMappingType
                                        ]
                                          ? "dark:text-gray-600"
                                          : ""
                                      }`}
                                    />
                                  </IconButton>
                                ) : (
                                  <IconButton classes={iconClasses}>
                                    <LiaSortAmountDownAltSolid
                                      // size={20}
                                      className={`${
                                        headerColorMapping[
                                          header.column
                                            .id as headerColorMappingType
                                        ]
                                          ? "dark:text-gray-600"
                                          : ""
                                      }`}
                                    />
                                  </IconButton>
                                )}
                              </span>
                            ) : (
                              <span className="ml-1">
                                <IconButton classes={iconClasses}>
                                  <LiaSortSolid
                                    // size={20}
                                    className={`${
                                      headerColorMapping[
                                        header.column
                                          .id as headerColorMappingType
                                      ]
                                        ? "dark:text-gray-600"
                                        : ""
                                    }`}
                                  />
                                </IconButton>
                              </span>
                            )
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <tr
                      key={row.id}
                      className={`${
                        row.original.LandLayer != null
                          ? "bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-600 hover:bg-red-300 hover:dark:bg-red-300"
                          : "bg-gray-200 dark:bg-gray-600 border-b dark:border-gray-400 hover:bg-sky-100 dark:hover:bg-sky-400"
                      } xs:py-[2px] xs:px-[2px] md:px-3 md:py-2 font-sans xs:font-extralight md:font-medium xs:text-[9px] sx:text-[0.75rem] md:text-sm xs:text-center md:text-left`}
                      onClick={(e) => handleRowClick(row, e.currentTarget)}
                      onMouseEnter={() => handleMouseEnter(row)}
                      onMouseLeave={() => handleMouseLeave(row)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`py-1 ${
                            cell.column.id === "LandId" ? "px-1" : "px-2"
                          }  text-gray-700 dark:text-gray-300`}
                        >
                          {cell.column.id === "LandId" ? (
                            <span
                              {...{
                                onClick: () => handleRowExpand(row.id),
                                style: { cursor: "pointer" },
                              }}
                            >
                              {expanded[row.id] ? (
                                <IconButton classes={iconClasses}>
                                  <IoIosArrowUp size={20} />
                                </IconButton>
                              ) : (
                                <IconButton classes={iconClasses}>
                                  <IoIosArrowDown size={20} />
                                </IconButton>
                              )}
                            </span>
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          )}
                        </td>
                      ))}
                    </tr>
                    {expanded[row.id] && row.original.HasSubRows && (
                      <tr>
                        <td colSpan={columns.length}>
                          <SubSubRow land={row.original.SubContent[0]} />
                          {/* need to check here *** */}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td
                    colSpan={columns.length}
                    className="text-left py-3 px-6 xs:font-extralight md:font-medium xs:text-[10px] sx:text-[0.75rem] md:text-sm text-gray-700 dark:text-gray-300"
                  >
                    {t("landSummaryTable:no_data")}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <td
                      key={header.id}
                      className="py-1 px-3 xs:font-extralight md:font-medium xs:text-[10px] sx:text-[0.80rem] md:text-sm lg:text-base xs:text-center md:text-left text-slate-950 dark:text-blue-400 font-sans font-extralight text-sm bg-gray-400 dark:bg-gray-600"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </td>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
          <Pagination table={table} />
        </div>
      )}
    </>
  );
};

export default UnitLandLayerTable;
