import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  ExpandedState,
  Updater,
} from "@tanstack/react-table";
import apiClient from "../../services/apiClient";

interface SubRowData {
  id: number;
  detail: string;
}

interface MainRowData {
  id: number;
  name: string;
  hasSubRows: boolean;
  subRows?: SubRowData[];
}

const fetchSubTableData = async (id: number): Promise<SubRowData[]> => {
  const response = await apiClient.get(`/api/subtable/${id}`);
  return response.data;
};

const columns: ColumnDef<MainRowData>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <span {...row.getToggleExpandedHandler()}>
          {row.getIsExpanded() ? "👇" : "👉"}
        </span>
      ) : null,
  },
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
];

const ExampleTable: React.FC = () => {
  const [data, setData] = useState<MainRowData[]>([
    { id: 1, name: "Row 1", hasSubRows: true },
    { id: 2, name: "Row 2", hasSubRows: false },
    { id: 3, name: "Row 3", hasSubRows: true },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    //getSubRows: (row) => row.subRows ?? [],
    onExpandedChange: (expanded) => handleRowToggle(expanded),
  });

  const handleRowToggle = async (expanded: Updater<ExpandedState>) => {
    const expandedRowIds = Object.keys(expanded).map(Number);

    for (const rowId of expandedRowIds) {
      const rowIndex = data.findIndex((row) => row.id === rowId);
      const row = data[rowIndex];

      if (!row.subRows && row.hasSubRows) {
        const subRows = await fetchSubTableData(rowId);
        setData((prevData) => {
          const updatedData = [...prevData];
          updatedData[rowIndex].subRows = subRows;
          return updatedData;
        });
      }
    }
  };

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}></th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <React.Fragment key={row.id}>
            <tr>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}></td>
              ))}
            </tr>
            {row.getIsExpanded() && row.original.subRows && (
              <tr>
                <td colSpan={columns.length}>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {row.original.subRows.map((subRow) => (
                        <tr key={subRow.id}>
                          <td>{subRow.id}</td>
                          <td>{subRow.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default ExampleTable;
