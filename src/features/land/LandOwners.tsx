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
} from "@tanstack/react-table";

import LoadingModal from "../../ui/LoadingModal";
import { useTranslation } from "react-i18next";
import { setLoadingState } from "../../slices/loadingSlice";
import IconButton, { IconClasses } from "../../ui/IconButton";
import { OwnerDetailReq, OwnerInfo } from "../../slices/landOwnersSlice";
import { OwnedLand } from "../../lib/types";
import { landOwners } from "../../thunk/landOwnersThunk";
import landApi from "../../services/landApi";
import { LandInfo, LandObj } from "../../slices/landSummarySlice";
import SubSubRow from "./SubSubRow";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import SpinnerMini from "../../ui/SpinnerMini";
import { debounce } from "lodash";
import {
  LiaSortAmountDownAltSolid,
  LiaSortAmountDownSolid,
  LiaSortSolid,
} from "react-icons/lia";
import { MdOutlineDeleteForever } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { setGlobalFilter } from "../../slices/filterSlice";
import { useNavigate } from "react-router-dom";
import { FaRegMap } from "react-icons/fa6";
import Pagination from "../../ui/Pagination";
import Owner from "./Owner";
import { LocaleKey, localeFormats } from "../../lib/helpFunction";
import { useTranslation as useCustomTranslation } from "../../context/TranslationContext";

const LandOwners = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<OwnerInfo[] | undefined>(undefined);
  const pageIndexRef = useRef(pagination.pageIndex);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [isOwnerWindowOpen, setIsOwnerWindowOpen] = useState<boolean>(false);
  const [ownerDetailReq, setOwnerDetailReq] = useState<OwnerDetailReq>();

  const { ownerDetails } = useAppSelector(
    (state: RootState) => state.landOwners
  );
  const { isLoading } = useAppSelector((state: RootState) => state.loading);
  const globalFilter = useAppSelector(
    (state: RootState) => state.filter.globalFilter
  );
  const { rootNode, selectedNode } = useAppSelector(
    (state: RootState) => state.tree
  );
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const { t } = useTranslation();
  const { language } = useCustomTranslation();
  const navigate = useNavigate();

  const iconClasses: IconClasses = {
    padding_x: "px-[2px]",
    background_color:
      "hover:bg-slate-50 active:bg-slate-50 ring-slate-50 dark:hover:bg-slate-50 dark:hover:ring-slate-50 dark:active:bg-slate-50 dark:active:ring-slate-50",
  };

  useEffect(() => {
    if (selectedNode) {
      const landReq: OwnedLand = {
        unitId: selectedNode.UnitID,
        locale: localeFormats[language as LocaleKey].locale,
        isDnnId: false,
        isLandTab: false,
        userId: 0,
      };

      if (selectedNode.UnitID > 0) {
        dispatch(setLoadingState(true));
        dispatch(landOwners(landReq));
      }
    }
  }, [selectedNode, dispatch, language]);

  useEffect(() => {
    if (ownerDetails) {
      setData(ownerDetails.LandOwner);
    }
  }, [ownerDetails]);

  const columnHelper = createColumnHelper<OwnerInfo>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("LandId", {
        header: () => null,
        cell: ({ row }) => (
          <span
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: "pointer" },
            }}
          >
            {row.getIsExpanded() ? "▼" : "▶"}
          </span>
        ),
        id: "LandId",
        enableSorting: false,
      }),
      columnHelper.accessor("FullName", {
        header: () => t("landOwnersTable:full_name"),
        cell: (info) => info.renderValue(),
        sortingFn: "alphanumeric",
        enableSorting: true,
      }),
      columnHelper.accessor("Email", {
        header: () => t("landOwnersTable:email"),
        enableSorting: true,
      }),
      columnHelper.accessor("ContactNumber", {
        header: () => t("landOwnersTable:contact_number"),
        enableSorting: true,
      }),
      columnHelper.accessor("ForestArea", {
        id: "ForestArea",
        header: () => t("landOwnersTable:forest_area"),
        cell: (info) => info.renderValue() || 0.0,
        footer: () => ownerDetails?.ForestArea || 0.0,
        enableSorting: true,
      }),
      columnHelper.accessor("LandOwnerForestShare", {
        id: "ForestAreaShare",
        header: () => t("landOwnersTable:land_owner_forest_share"),
        enableSorting: true,
      }),
      columnHelper.accessor("AgricultureArea", {
        id: "AgricultureArea",
        header: () => t("landOwnersTable:agriculture_area"),
        cell: (info) => info.renderValue() || 0.0,
        footer: () => ownerDetails?.AgricultureArea || 0.0,
        enableSorting: true,
      }),
      columnHelper.accessor("LandOwnerAgricultureShare", {
        id: "AgricultureAreaShare",
        header: () => t("landOwnersTable:land_owner_agriculture_share"),
        enableSorting: true,
      }),
      columnHelper.accessor("MountainArea", {
        id: "MountainArea",
        header: () => t("landOwnersTable:mountain_area"),
        cell: (info) => info.renderValue() || 0.0,
        footer: () => ownerDetails?.MountainArea || 0.0,
        enableSorting: true,
      }),
      columnHelper.accessor("LandOwnerMountainShare", {
        id: "MountainAreaShare",
        header: () => t("landOwnersTable:land_owner_mountain_share"),
      }),
      columnHelper.accessor("TotalArea", {
        id: "TotalArea",
        header: () => t("landOwnersTable:total_area"),
        cell: (info) => info.renderValue() || 0.0,
        footer: () => ownerDetails?.UnitTotalArea || 0.0,
        enableSorting: true,
      }),
      columnHelper.accessor("LandOwnerTotalShare", {
        id: "TotalAreaShare",
        header: () => t("landOwnersTable:land_owner_total_share"),
        enableSorting: true,
      }),
      columnHelper.accessor("NoOfOccurrences", {
        header: () => t("landOwnersTable:no_of_occurrences"),
        cell: (info) => info.renderValue() || 0,
        footer: () => ownerDetails?.LandsCount || 0,
        enableSorting: true,
      }),
      columnHelper.display({
        id: "edit",
        header: () => t("landOwnersTable:edit"),
        cell: ({ row }) => (
          <button
            onClick={() =>
              handleEdit(row.original.LandId, row.original.SystemUserId)
            }
            className="
        flex items-center justify-center px-2 py-1
        rounded-lg font-medium text-sm transition-all
        focus:outline-none
        focus:ring-green-400
        text-white bg-green-500 hover:bg-green-600 active:bg-green-600
        dark:text-gray-200 dark:bg-green-600 dark:hover:bg-green-500 dark:active:bg-green-600
      "
          >
            <TbEdit />
          </button>
        ),
        enableSorting: false,
      }),
      columnHelper.display({
        id: "delete",
        header: () => t("landOwnersTable:delete"),
        cell: ({ row }) => (
          <button
            onClick={() => handleDelete(row.original)}
            className="
        flex items-center justify-center px-2 py-1
        rounded-lg font-medium text-sm transition-all
        focus:outline-none
        focus:ring-red-400
        text-white bg-red-500 hover:bg-red-600 active:bg-red-600
        dark:text-gray-200 dark:bg-red-600 dark:hover:bg-red-500 dark:active:bg-red-600
      "
          >
            <MdOutlineDeleteForever />
          </button>
        ),
        enableSorting: false,
      }),
    ],
    [columnHelper, t, ownerDetails]
  );
  console.log("land summery table land re render");
  type headerType =
    | "ForestArea"
    | "ForestAreaShare"
    | "AgricultureArea"
    | "AgricultureAreaShare"
    | "MountainArea"
    | "MountainAreaShare";
  const headerColorMapping = {
    ForestArea:
      "bg-green-200  bg-opacity-50 dark:bg-opacity-80 text-opacity-100 dark:text-gray-600",
    ForestAreaShare:
      "bg-green-200  bg-opacity-50 dark:bg-opacity-80 text-opacity-100 dark:text-gray-600",
    AgricultureArea:
      "bg-teal-200 bg-opacity-50 dark:bg-opacity-80 text-opacity-100 dark:text-gray-600",
    AgricultureAreaShare:
      "bg-teal-200 bg-opacity-50 dark:bg-opacity-80 text-opacity-100 dark:text-gray-600",
    MountainArea:
      "bg-blue-200 bg-opacity-50 dark:bg-opacity-80 dark:text-gray-600",
    MountainAreaShare:
      "bg-blue-200 bg-opacity-50 dark:bg-opacity-80 dark:text-gray-600",
    // TotalArea: "bg-gray-400 dark:text-gray-600",
    // TotalAreaShare: "bg-gray-400 dark:text-gray-600",
  };

  const customGlobalFilter: FilterFn<OwnerInfo> = (
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
    // getSubRows: (row) => row.SubTableContant ?? [],
    //paginateExpandedRows: false,
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  const handleRowExpand = async (rowId: string, rowData: OwnerInfo) => {
    pageIndexRef.current = table.getState().pagination.pageIndex;
    if (!rowData.HasSubRows) {
      try {
        setLoading((prevLoading) => ({ ...prevLoading, [rowId]: true }));
        let response: LandObj | null = null;

        if (rowData.IsSharedLand) {
          response = await landApi.sharedOwnersLand({
            unitId: Number(selectedNode?.UnitID),
            landIdListStr: rowData.LandIdListStr,
          });
        } else {
          const ownedLand: OwnedLand = {
            unitId: Number(selectedNode?.UnitID),
            userId: rowData.SystemUserId,
            isDnnId: false,
            isLandTab: false,
            locale: localeFormats[language as LocaleKey].locale,
          };
          response = await landApi.ownersLand(ownedLand);
        }

        if (response) {
          setData((prevData) => {
            if (!prevData) return prevData;

            return prevData.map((item, index) => {
              if (index === parseInt(rowId)) {
                return {
                  ...item,
                  HasSubRows: true,
                  SubRows: response?.Lands.map((land) => ({
                    LandId: land.LandId,
                    Municipality: land.Municipality,
                    MainNo: land.MainNo,
                    SubNo: land.SubNo,
                    PlotNo: land.PlotNo,
                    NoOfReferencedLands: land.NoOfReferencedLands,
                    AreaInForest: land.AreaInForest,
                    AreaInMountain: land.AreaInMountain,
                    AreaInAgriculture: land.AreaInAgriculture,
                    TotalArea: land.TotalArea,
                    Notes: land.Notes,
                    OwnershipTypeId: land.OwnershipTypeId,
                    OwnershipType: land.OwnershipType,
                    LandOwnerId: land.LandOwnerId,
                    LandUnit:
                      land.LandUnits.length > 0
                        ? land.LandUnits.length > 1
                          ? `${land.LandUnits[0].Unit} ..`
                          : land.LandUnits[0].Unit
                        : "",
                    HasSubSubRows: false,
                    LandOwners: land.LandOwners,
                    LandUnits: land.LandUnits,
                    // assigned some default values ***
                    DisplayName: "",
                    SubTableContant: "",
                    HasSubRows: false,
                    SubContent: [],
                    SubSubRows: "",
                    availableNames: [],
                    selectedNames: [],
                    MapGeoJson: "",
                    LandLayer: null,
                  })),
                };
              }
              return item;
            });
          });
        }
      } catch (error) {
        console.error("Error handling row expansion:", error); ////////////////////////
      } finally {
        setLoading((prevLoading) => ({ ...prevLoading, [rowId]: false }));
      }
    }
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [rowId]: !prevExpanded[rowId],
    }));
  };

  // useEffect(() => {
  //   if (pageIndexRef.current > 0) {
  //     setPagination((prev) => ({
  //       ...prev,
  //       pageIndex: pageIndexRef.current,
  //     }));
  //   }
  // }, [expanded]);

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

  const handleSubRowExpand = async (rowId: string, subRowData: LandInfo) => {
    pageIndexRef.current = table.getState().pagination.pageIndex;
    setData((prevData) => {
      return prevData?.map((item) => {
        return {
          ...item,
          SubRows: item.SubRows?.map((subRow) => {
            if (subRow.LandId === subRowData.LandId) {
              return {
                ...subRow,
                HasSubSubRows: !subRowData.HasSubSubRows,
              };
            }
            return subRow;
          }),
        };
      });
    });

    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [rowId]: !prevExpanded[rowId],
    }));
    setPagination((prev) => ({
      ...prev,
      pageIndex: pageIndexRef.current,
    }));
  };

  const handleDelete = (original: OwnerInfo): void => {
    console.log(original.LandId);
  };

  const handleEdit = (landId: number, systemUserId: number): void => {
    setIsOwnerWindowOpen(true);
    const ownerDetailReq: OwnerDetailReq = {
      LandId: landId,
      SystemUserId: systemUserId,
    };
    setOwnerDetailReq(ownerDetailReq);
  };

  const handleMapView = (original: LandInfo): void => {
    ///////////////// rootNode.UnitID check*
    const mapUrl = `/land_mapping/${rootNode.UnitID}/${selectedNode?.UnitID}/${user.UserId}/${original.LandId}/${original.Municipality}/${original.MainNo}/${original.SubNo}`;
    navigate(mapUrl);
  };

  const landOwnerModalClose = () => {
    setIsOwnerWindowOpen(false);
  };

  useEffect(() => {
    dispatch(setGlobalFilter(""));

    // Cleanup logic for unmount
    return () => {
      dispatch(setGlobalFilter(""));
    };
  }, []);

  if (isLoading) return <LoadingModal />;
  return (
    <>
      {selectedNode !== undefined &&
        selectedNode.UnitID > 0 &&
        ownerDetails && (
          <div className="overflow-x-auto w-full min-w-full">
            <table className="border-collapse w-full ">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`xs:py-[2px] xs:px-[2px] md:px-3 md:py-2 font-sans xs:font-extralight md:font-medium xs:text-[9px] sx:text-[0.75rem] md:text-sm lg:text-base xs:text-center md:text-left text-gray-800 dark:text-gray-200 border-[0.5px] border-slate-300 dark:border-slate-500   ${
                          headerColorMapping[header.column.id as headerType] ||
                          "bg-slate-200 dark:bg-slate-600"
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
                                        size={20}
                                        className={`${
                                          headerColorMapping[
                                            header.column.id as headerType
                                          ]
                                            ? "dark:text-gray-600"
                                            : ""
                                        }`}
                                      />
                                    </IconButton>
                                  ) : (
                                    <IconButton classes={iconClasses}>
                                      <LiaSortAmountDownAltSolid
                                        size={20}
                                        className={`${
                                          headerColorMapping[
                                            header.column.id as headerType
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
                                      size={20}
                                      className={`${
                                        headerColorMapping[
                                          header.column.id as headerType
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
                      <tr className="xs:py-[2px] xs:px-[2px] md:px-3 md:py-2 font-sans xs:font-extralight md:font-medium xs:text-[9px] sx:text-[0.75rem] md:text-sm xs:text-center md:text-left bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-600 hover:bg-sky-100 dark:hover:bg-sky-800">
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
                                  onClick: () =>
                                    handleRowExpand(row.id, row.original),
                                  style: { cursor: "pointer" },
                                }}
                              >
                                {loading[row.id] ? (
                                  <IconButton classes={iconClasses}>
                                    <SpinnerMini />
                                  </IconButton>
                                ) : expanded[row.id] ? (
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
                      {expanded[row.id] && row.original.SubRows && (
                        <tr>
                          <td
                            className="overflow-x-hidden"
                            colSpan={columns.length}
                          >
                            <table className="border-collapse  w-full">
                              <thead
                                className="xs:py-[2px] xs:px-[2px] md:px-3 md:py-2 font-sans xs:font-extralight md:font-medium xs:text-[9px] sx:text-[0.75rem] md:text-sm md:text-left text-slate-950 dark:text-blue-400
                                 bg-gray-400 dark:bg-gray-600"
                              >
                                <tr>
                                  <th className="py-1 px-1 text-left  text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700"></th>
                                  <th className="py-1 px-1 text-left  text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700">
                                    {t("landOwnersTable:municipality")}
                                  </th>
                                  <th className="py-1 px-1 text-left  text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700">
                                    {t("landOwnersTable:main_no")}
                                  </th>
                                  <th className="py-1 px-1 text-left  text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700">
                                    {" "}
                                    {t("landOwnersTable:sub_no")}
                                  </th>
                                  <th className="py-1 px-1 text-left  text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700">
                                    {t("landOwnersTable:unit")}
                                  </th>
                                  <th className="py-1 px-1 text-left  text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700">
                                    {" "}
                                    {t("landOwnersTable:area_in_forest")}
                                  </th>
                                  <th className="py-1 px-1 text-left  text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700">
                                    {t("landOwnersTable:area_in_mountain")}
                                  </th>
                                  <th className="py-1 px-1 text-left  text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700">
                                    {t("landOwnersTable:area_in_agriculture")}
                                  </th>
                                  <th className="py-1 px-1 text-left  text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700">
                                    {t("landOwnersTable:total_area")}
                                  </th>
                                  <th className="py-1 px-1 text-left  text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700">
                                    {t("landOwnersTable:map")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.original.SubRows?.map(
                                  (subRow, subRowIndex) => (
                                    <React.Fragment key={subRow.LandId}>
                                      <tr className="xs:py-[2px] xs:px-[2px] md:px-3 md:py-2 font-sans xs:font-extralight md:font-medium xs:text-[9px] sx:text-[0.75rem] md:text-sm md:text-left bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-600 hover:bg-sky-200 dark:hover:bg-sky-600">
                                        <td className="py-1 px-1 text-gray-700 dark:text-gray-300 max-w-min">
                                          <span
                                            onClick={() =>
                                              handleSubRowExpand(
                                                `${row.id}-${subRowIndex}`,
                                                subRow
                                              )
                                            }
                                            style={{ cursor: "pointer" }}
                                          >
                                            {expanded[
                                              `${row.id}-${subRowIndex}`
                                            ] ? (
                                              <IconButton classes={iconClasses}>
                                                <IoIosArrowUp size={15} />
                                              </IconButton>
                                            ) : (
                                              <IconButton classes={iconClasses}>
                                                <IoIosArrowDown size={15} />
                                              </IconButton>
                                            )}
                                          </span>
                                        </td>
                                        <td className="py-1 px-1 text-gray-700 dark:text-gray-300">
                                          {subRow.Municipality}
                                        </td>
                                        <td className="py-1 px-1 text-gray-700 dark:text-gray-300">
                                          {subRow.MainNo}
                                        </td>
                                        <td className="py-1 px-1 text-gray-700 dark:text-gray-300">
                                          {subRow.SubNo}
                                        </td>
                                        <td className="py-1 px-1 text-gray-700 dark:text-gray-300">
                                          {subRow.LandUnit}
                                        </td>
                                        <td className="py-1 px-1 text-gray-700 dark:text-gray-300">
                                          {subRow.AreaInForest}
                                        </td>
                                        <td className="py-1 px-1 text-gray-700 dark:text-gray-300">
                                          {subRow.AreaInMountain}
                                        </td>
                                        <td className="py-1 px-1 text-gray-700 dark:text-gray-300">
                                          {subRow.AreaInAgriculture}
                                        </td>
                                        <td className="py-1 px-1 text-gray-700 dark:text-gray-300">
                                          {subRow.TotalArea}
                                        </td>
                                        <td className="py-1 px-1 text-gray-700 dark:text-gray-300">
                                          <button
                                            onClick={() =>
                                              handleMapView(subRow)
                                            }
                                            className="flex items-center justify-center px-2 py-1 rounded-lg font-medium text-sm transition-all focus:outline-none focus:ring-sky-400 text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-600
                                                         dark:text-gray-200 dark:bg-sky-600 dark:hover:bg-sky-500 dark:active:bg-sky-600"
                                          >
                                            <FaRegMap />
                                          </button>
                                        </td>
                                      </tr>
                                      {subRow.HasSubSubRows && (
                                        <tr>
                                          <td colSpan={columns.length}>
                                            <SubSubRow land={subRow} />
                                          </td>
                                        </tr>
                                      )}
                                    </React.Fragment>
                                  )
                                )}
                              </tbody>
                            </table>
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
                      {t("landOwnersTable:no_data")}
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
            {isOwnerWindowOpen && ownerDetailReq && (
              <Owner
                ownerDetailReq={ownerDetailReq}
                landOwnerModalClose={landOwnerModalClose}
              />
            )}
            {isOwnerWindowOpen && (
              <div
                className="fixed inset-0 bg-black opacity-50 z-10"
                // onClick={landOwnerModalClose}
              ></div>
            )}
          </div>
        )}
    </>
  );
};
export default LandOwners;
