// TableComponent.tsx
import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  ColumnDef,
  OnChangeFn,
  ExpandedState,
} from "@tanstack/react-table";
import { generateData } from "../../lib/helpFunction";
import { Row } from "../../lib/types";

const TableComponent: React.FC = () => {
  const [data] = useState(() => generateData(10));
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      {
        id: "expander",
        header: () => null,
        cell: ({ row }) => (
          <span
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: "pointer" },
            }}
          >
            {row.getIsExpanded() ? "👇" : "👉"}
          </span>
        ),
      },
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "value",
        header: "Value",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded as OnChangeFn<ExpandedState>,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.subRows ?? [],
  });

  const handleRowExpand = (rowId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [rowId]: !prevExpanded[rowId],
    }));
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
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
        {table.getRowModel().rows.map((row) => (
          <React.Fragment key={row.id}>
            <tr>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {cell.column.id === "expander" ? (
                    <span
                      {...{
                        onClick: () => handleRowExpand(row.id),
                        style: { cursor: "pointer" },
                      }}
                    >
                      {expanded[row.id] ? "👇" : "👉"}
                    </span>
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </td>
              ))}
            </tr>
            {expanded[row.id] && (
              <tr>
                <td colSpan={row.getVisibleCells().length}>
                  <table className="min-w-full bg-gray-100">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Sub Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {row.original.subRows?.map((subRow) => (
                        <tr key={subRow.id}>
                          <td>{subRow.id}</td>
                          <td>{subRow.subValue}</td>
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

export default TableComponent;

// data.ts
// export interface SubRow {
//   id: number;
//   subValue: string;
// }

// export interface Row {
//   id: number;
//   value: string;
//   subRows?: SubRow[];
// }

// export const generateData = (numRows: number): Row[] => {
//   return Array.from({ length: numRows }, (_, i) => ({
//     id: i + 1,
//     value: `Row ${i + 1}`,
//     subRows: Array.from({ length: 3 }, (_, j) => ({
//       id: j + 1,
//       subValue: `SubRow ${i + 1}.${j + 1}`,
//     })),
//   }));
// };
