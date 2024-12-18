import { useMemo, useRef } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { setSelectedLayerState } from "../../slices/selectedLayerSlice";
import { useTranslation } from "react-i18next";
import { LandInformation } from "../../lib/types";
import { MdOutlineClear } from "react-icons/md";
import { removeSelectedLandLayer } from "../../slices/selectedlandSlice";
type LandTableProps = {
  onLayerChanged: () => void;
  mapMarkerRemoved: () => void;
};

const LandTable: React.FC<LandTableProps> = ({
  onLayerChanged,
  mapMarkerRemoved,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { landInfo } = useAppSelector((state: RootState) => state.selectland);

  const columnHelper = createColumnHelper<LandInformation>();
  const selectedRowRef = useRef<HTMLTableRowElement | null>(null);

  const removeLandLayer = (row: LandInformation) => {
    const land = {
      municipality: row.Municipality,
      mainNo: Number(row.MainNo),
      subNo: Number(row.SubNo),
      plotNo: row.PlotNo ? Number(row.PlotNo) : undefined,
    };
    const layerString = `${row.MainNo}/${row.SubNo}`;
    dispatch(
      setSelectedLayerState({
        isClicked: false,
        isMouseEnter: false,
        layerName: layerString,
      })
    );
    dispatch(removeSelectedLandLayer(land));
    mapMarkerRemoved();
  };

  console.log("table land re render");
  const columns = useMemo(
    () => [
      columnHelper.accessor("Municipality", {
        header: () => t("landTable:municipality"),
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("MainNo", {
        header: () => t("landTable:main_no"),
      }),
      columnHelper.accessor("SubNo", {
        id: "SubNo",
        header: () => t("landTable:sub_no"),
      }),
      columnHelper.accessor("PlotNo", {
        id: "PlotNo",
        header: () => t("landTable:plot_no"),
        cell: (info) => info.renderValue() || 0,
      }),
      columnHelper.accessor("AreaInForest", {
        id: "AreaInForest",
        header: () => t("landTable:area_in_forest"),
        cell: (info) => info.renderValue() || 0,
      }),
      columnHelper.accessor("AreaInAgriculture", {
        id: "AreaInAgriculture",
        header: () => t("landTable:area_in_agriculture"),
        cell: (info) => info.renderValue() || 0,
      }),
      columnHelper.accessor("AreaInMountain", {
        id: "AreaInMountain",
        header: () => t("landTable:area_in_mountain"),
        cell: (info) => info.renderValue() || 0,
      }),
      columnHelper.accessor("TotalArea", {
        id: "TotalArea",
        header: () => t("landTable:total_area"),
        cell: (info) => info.renderValue() || 0,
      }),
      columnHelper.display({
        id: "delete",
        header: () => t("landOwnersTable:delete"),
        cell: ({ row }) => (
          <button
            onClick={() => removeLandLayer(row.original)}
            className="
              flex items-center justify-center px-2 py-1
              rounded-lg font-medium text-sm transition-all
              focus:outline-none
              focus:ring-red-400
              text-white bg-red-500 hover:bg-red-600 active:bg-red-600
              dark:text-gray-200 dark:bg-red-600 dark:hover:bg-red-500 dark:active:bg-red-600
            "
          >
            <MdOutlineClear />
          </button>
        ),
        enableSorting: false,
      }),
    ],
    []
  );

  const headerColorMapping = {
    // Municipality: "dark:bg-gray-900",
    // MainNo: "dark:bg-gray-900",
    // SubNo: "dark:bg-gray-900",
    // PlotNo: "dark:bg-gray-900",
    AreaInForest: "bg-green-200  bg-opacity-50 text-opacity-100",
    AreaInAgriculture: "bg-teal-200 bg-opacity-50 text-opacity-100",
    AreaInMountain: "bg-blue-200",
    TotalArea: "bg-gray-500",
  };

  const table = useReactTable({
    data: landInfo || [],
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (
    row: Row<LandInformation>,
    rowElement: HTMLTableRowElement
  ) => {
    const rowData = row.original as LandInformation;
    const layerString = `${rowData.MainNo}/${rowData.SubNo}`;
    // console.log(layerString);
    dispatch(
      setSelectedLayerState({
        isClicked: true,
        isMouseEnter: false,
        layerName: layerString,
      })
    );
    onLayerChanged();
    if (selectedRowRef.current) {
      selectedRowRef.current.classList.remove("bg-red-400");
    }
    rowElement.classList.add("bg-red-400");
    selectedRowRef.current = rowElement;
    //  currentSelectedRowId.current = rowData.LandId;
  };

  const handleMouseEnter = (row: Row<LandInformation>) => {
    const rowData = row.original as LandInformation;
    const layerString = `${rowData.MainNo}/${rowData.SubNo}`;
    dispatch(
      setSelectedLayerState({
        isClicked: false,
        isMouseEnter: true,
        layerName: layerString,
      })
    );
    onLayerChanged();
    // if (selectedRowRef.current) {
    //   selectedRowRef.current.classList.remove("bg-red-400");
    // }
    // rowElement.classList.add("bg-red-400");
    // selectedRowRef.current = rowElement;
    // currentSelectedRowId.current = rowData.LandId;
  };

  const handleMouseLeave = (row: Row<LandInformation>) => {
    const rowData = row.original as LandInformation;
    const layerString = `${rowData.MainNo}/${rowData.SubNo}`;
    dispatch(
      setSelectedLayerState({
        isClicked: false,
        isMouseEnter: false,
        layerName: layerString,
      })
    );
    onLayerChanged();
    // if (selectedRowRef.current) {
    //   selectedRowRef.current.classList.remove("bg-red-400");
    // }
    // rowElement.classList.add("bg-red-400");
    // selectedRowRef.current = rowElement;
    // currentSelectedRowId.current = rowData.LandId;
  };

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`py-1 px-3 text-left text-slate-950 dark:text-blue-400 font-sans font-extralight text-sm  ${
                    headerColorMapping[
                      header.column.id as keyof typeof headerColorMapping
                    ] || "dark:bg-gray-900 bg-gray-300"
                  }`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => {
              const rowData = row.original as LandInformation;
              return (
                <tr
                  key={rowData.LandId}
                  className="border-b-[1px] border-solid border-slate-400 cursor-pointer text-slate-950 hover:bg-red-300 bg-gray-200 dark:border-slate-300 text-sm"
                  onClick={(e) => handleRowClick(row, e.currentTarget)}
                  onMouseEnter={() => handleMouseEnter(row)}
                  onMouseLeave={() => handleMouseLeave(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-1 px-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })
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
      </table>
    </div>
  );
};

export default LandTable;
