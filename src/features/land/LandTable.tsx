import { useMemo, useRef } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { setSelectedLayerState } from "../../slices/selectedLayerSlice";
import { useTranslation } from "react-i18next";
import { LandInformation } from "../../lib/types";
type LandTableProps = {
  onLayerChanged: () => void;
};

const LandTable: React.FC<LandTableProps> = ({ onLayerChanged }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { landInfo } = useAppSelector((state: RootState) => state.selectland);

  const columnHelper = createColumnHelper<LandInformation>();
  const selectedRowRef = useRef<HTMLTableRowElement | null>(null);
  //const currentSelectedRowId = useRef<number | null>(null);

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
    ],
    [columnHelper, t]
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

  const handleRowClick = (row: any, rowElement: HTMLTableRowElement) => {
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

  const handleMouseEnter = (row: any) => {
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

  const handleMouseLeave = (row: any) => {
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
          {table.getRowModel().rows.map((row) => {
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LandTable;
