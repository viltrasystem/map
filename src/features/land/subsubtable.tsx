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
  const [subExpanded, setSubExpanded] = useState<Record<string, boolean>>({});

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
    getSubRows: (row) => (row.subRows as Row[]) ?? [],
  });

  const handleRowExpand = (rowId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [rowId]: !prevExpanded[rowId],
    }));
  };

  const handleSubRowExpand = (subRowId: string) => {
    setSubExpanded((prevExpanded) => ({
      ...prevExpanded,
      [subRowId]: !prevExpanded[subRowId],
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
                        <th>Expand</th>
                      </tr>
                    </thead>
                    <tbody>
                      {row.original.subRows?.map((subRow) => (
                        <React.Fragment key={subRow.id}>
                          <tr>
                            <td>{subRow.id}</td>
                            <td>{subRow.subValue}</td>
                            <td>
                              <span
                                {...{
                                  onClick: () =>
                                    handleSubRowExpand(
                                      `${row.id}-${subRow.id}`
                                    ),
                                  style: { cursor: "pointer" },
                                }}
                              >
                                {subExpanded[`${row.id}-${subRow.id}`]
                                  ? "👇"
                                  : "👉"}
                              </span>
                            </td>
                          </tr>
                          {subExpanded[`${row.id}-${subRow.id}`] && (
                            <tr>
                              <td colSpan={3}>
                                <table className="min-w-full bg-gray-200">
                                  <thead>
                                    <tr>
                                      <th>ID</th>
                                      <th>Sub Sub Value</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {subRow.subSubRows?.map((subSubRow) => (
                                      <tr key={subSubRow.id}>
                                        <td>{subSubRow.id}</td>
                                        <td>{subSubRow.subSubValue}</td>
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
