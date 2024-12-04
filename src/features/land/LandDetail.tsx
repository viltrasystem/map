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
import { toast } from "react-toastify";
//import { rankItem } from "@tanstack/match-sorter-utils";
//import { matchSorter } from "match-sorter";
import { ArchiveInfo, LandInfo } from "../../slices/landSummarySlice";
import { archiveLand, landSummary } from "../../thunk/landSummaryThunk";
import { setLoadingState } from "../../slices/loadingSlice";
import {
  LiaSortAmountDownAltSolid,
  LiaSortAmountDownSolid,
  LiaSortSolid,
} from "react-icons/lia";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import IconButton, { IconClasses } from "../../ui/IconButton";
import SubSubRow from "./SubSubRow";
import { debounce } from "lodash";
import { TbEdit } from "react-icons/tb";
import { MdOutlineDeleteForever } from "react-icons/md";
import { setGlobalFilter } from "../../slices/filterSlice";
import { OwnedLand } from "../../slices/landOwnersSlice";
import { FaRegMap } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingModal from "../../ui/LoadingModal";
import { useTranslation as useCustomTranslation } from "../../context/TranslationContext";
import { useTranslation } from "react-i18next";
import Pagination from "../../ui/Pagination";
import ConfirmToast from "../../ui/ConfirmToast";
import { useDarkMode } from "../../context/DarkModeContext";
import Land from "./Land";
import { LocaleKey, localeFormats } from "../../lib/helpFunction";

type ToggleStateProps = {
  toggleState: boolean;
  landWindowOpen: boolean | undefined;
  landWindowClose: () => void;
};

export type LandDetailReq = {
  LandId: number;
};

const LandDetail: React.FC<ToggleStateProps> = ({
  toggleState,
  landWindowOpen,
  landWindowClose,
}) => {
  const { isDarkMode } = useDarkMode();
  const location = useLocation();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<LandInfo[] | undefined>(undefined);
  const globalFilter = useAppSelector(
    (state: RootState) => state.filter.globalFilter
  );
  const { summaryInfo } = useAppSelector((state: RootState) => state.summary);
  const { landDetails } = useAppSelector(
    (state: RootState) => state.landSummary
  );
  const { rootNode } = useAppSelector((state: RootState) => state.tree);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isLandWindowOpen, setIsLandWindowOpen] = useState<boolean>(false);
  const [landDetailReq, setLandDetailReq] = useState<LandDetailReq | undefined>(
    undefined
  );
  console.log(
    toggleState,
    isLandWindowOpen,
    "isLandWindowOpen",
    "land details slide toggle"
  );
  const pageIndexRef = useRef(pagination.pageIndex);
  const { isLoading } = useAppSelector((state: RootState) => state.loading);

  const dispatch = useAppDispatch();
  const { language } = useCustomTranslation();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const iconClasses: IconClasses = {
    padding_x: "px-[2px]",
    background_color:
      "hover:bg-slate-50 active:bg-slate-50 ring-slate-50 dark:hover:bg-slate-50 dark:hover:ring-slate-50 dark:active:bg-slate-50 dark:active:ring-slate-50",
  };

  useEffect(() => {
    if (landWindowOpen && landWindowOpen !== undefined) {
      const landDetailReq: LandDetailReq = {
        LandId: 0,
      };
      setLandDetailReq(landDetailReq);
      setIsLandWindowOpen(true);
    }
  }, [landWindowOpen]);

  useEffect(() => {
    if (summaryInfo.unitId > 0 && !isLandWindowOpen) {
      const landReq: OwnedLand = {
        unitId: summaryInfo.unitId,
        userId: user.UserId,
        isDnnId: true,
        isLandTab: toggleState,
        locale: localeFormats[language as LocaleKey].locale,
      };
      dispatch(setLoadingState(true));
      dispatch(landSummary(landReq));
    }
  }, [summaryInfo.unitId, isLandWindowOpen, toggleState, language]);

  useEffect(() => {
    if (landDetails) {
      setData(landDetails.Lands);
    }
  }, [landDetails]);

  const columnHelper = createColumnHelper<LandInfo>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("LandId", {
        header: () => null,
        //cell: ({ row }) => (
        // <span
        //   {...{
        //     onClick: row.getToggleExpandedHandler(),
        //     style: { cursor: "pointer" },
        //   }}
        // >
        //   {row.getIsExpanded() ? "▼" : "▶"}
        // </span>
        // ),
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
      columnHelper.accessor(
        (row) =>
          row.LandUnits
            ? row.LandUnits?.length > 1
              ? row.LandOwners[0]?.FullName + "..."
              : row.LandUnits[0]?.Unit
            : "",
        {
          id: "landUnits",
          header: () => t("landSummaryTable:land_owned_units"),
          enableSorting: true,
        }
      ),
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
      columnHelper.display({
        id: "Map",
        header: () => t("landOwnersTable:map"),
        cell: ({ row }) => (
          <button
            onClick={() => handleMapView(row.original)}
            className="
        flex items-center justify-center px-2 py-1
        rounded-lg font-medium text-sm transition-all
        focus:outline-none
          focus:ring-sky-400
        text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-600
        dark:text-gray-200 dark:bg-sky-600 dark:hover:bg-sky-500 dark:active:bg-sky-600
      "
          >
            <FaRegMap />
          </button>
        ),
        enableSorting: false,
      }),
      columnHelper.display({
        id: "edit",
        header: () => t("landOwnersTable:edit"),
        cell: ({ row }) => (
          <button
            onClick={() => handleEdit(row.original.LandId)}
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
            onClick={() => showConfirmationToast(row.original)}
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
    [columnHelper, t, landDetails]
  );
  console.log("land summery table land re render");
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
    // onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: customGlobalFilter,
    // getSubRows: (row) => row.SubTableContant ?? [],
    //paginateExpandedRows: false,
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  const handleRowExpand = (rowId: any) => {
    pageIndexRef.current = table.getState().pagination.pageIndex;
    setData((prevData) => {
      const updatedData = prevData?.map((item, index) => {
        if (index == rowId) {
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

  // const handleDelete = (original: LandInfo): void => {
  //   console.log(original.LandId);
  // };

  // open land register view
  const handleEdit = (landId: number): void => {
    setIsLandWindowOpen(true);
    const landDetailReq: LandDetailReq = {
      LandId: landId,
    };
    setLandDetailReq(landDetailReq);
  };

  const landModalClose = () => {
    setLandDetailReq(undefined);
    setIsLandWindowOpen(false);
    landWindowClose();
  };

  const handleMapView = (original: LandInfo): void => {
    const mapUrl = `/land_mapping/${summaryInfo.unitId}/${rootNode.UnitID}/${user.UserId}/${original.LandId}/${original.Municipality}/${original.MainNo}/${original.SubNo}`;
    navigate(mapUrl, { state: { from: location } });
  };

  useEffect(() => {
    dispatch(setGlobalFilter(""));

    // Cleanup logic for unmount
    return () => {
      dispatch(setGlobalFilter(""));
    };
  }, []);

  const showConfirmationToast = (original: LandInfo) => {
    toast(
      ({ closeToast }) => (
        <ConfirmToast
          onConfirm={() => {
            console.log(original.Municipality, "Confirmed!");
            const archiveInfo: ArchiveInfo = {
              unitId: summaryInfo.unitId,
              landId: original.LandId,
              deletedBy: user.UserId,
              locale: language,
            };
            console.log(archiveInfo, "archive land");

            dispatch(setLoadingState(true));
            dispatch(archiveLand(archiveInfo));
            closeToast();
          }}
          onCancel={() => {
            closeToast();
          }}
          message={t("landSummaryTable:land_archive_confirm")}
          confirm={t("common:btn_confirm")}
          cancel={t("common:btn_cancel")}
        />
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: true,
        position: "top-center",
        theme: isDarkMode ? "dark" : "colored",
        style: {
          fontSize: "14px",
          padding: "4px 4px",
          fontWeight: "700",
          minHeight: "40px",
          lineHeight: "1",
          // backgroundColor: "#0ea5e9",
          color: "white",
        },
      }
    );
  };

  if (isLoading) return <LoadingModal />;
  return (
    <>
      {summaryInfo.unitId > 0 && (
        <div className="overflow-x-auto w-full  min-w-full">
          <table className="border-collapse table-auto w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`py-1 px-1 border-[0.5px] border-slate-300 dark:border-slate-500 text-left text-gray-800 dark:text-gray-200 font-sans text-sm  ${
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
                                      size={20}
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
                                      size={20}
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
                                    size={20}
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
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-600 hover:bg-sky-100 dark:hover:bg-sky-800">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`py-1 ${
                            cell.column.id === "LandId" ? "px-1" : "px-2"
                          }  font-extralight text-sm text-gray-700 dark:text-gray-300`}
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
                    className="text-left text-sm py-3 px-6 text-gray-700 dark:text-gray-300"
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
                      className="py-1 px-3 text-left text-slate-950 dark:text-blue-400 font-sans font-extralight text-sm bg-gray-400 dark:bg-gray-600"
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
          <Pagination table={table} />{" "}
          {isLandWindowOpen && landDetailReq && (
            <Land
              landDetailReq={landDetailReq}
              landModalClose={landModalClose}
            />
          )}
          {isLandWindowOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-10"
              // onClick={landModalClose} away click close
            ></div>
          )}
        </div>
      )}
    </>
  );
};

export default LandDetail;
