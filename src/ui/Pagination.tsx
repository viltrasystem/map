import { Table } from "@tanstack/react-table";
import { useState } from "react";
import IconButton from "./IconButton";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";
import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";

interface PaginationProps<T> {
  table: Table<T>;
}

const Pagination = <T,>({ table }: PaginationProps<T>): JSX.Element => {
  const [goToPageInput, setGoToPageInput] = useState<number>(
    table.getState().pagination.pageIndex + 1
  );

  return (
    <div className="flex justify-end items-center gap-2 mt-2 px-2">
      <IconButton
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <HiOutlineChevronDoubleLeft
          className="text-sky-600 hover:text-sky-900 dark:text-sky-500 dark:hover:text-sky-700"
          size={20}
        />
      </IconButton>
      <IconButton
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <IoChevronBackSharp
          className="text-sky-600 hover:text-sky-900  dark:text-sky-500 dark:hover:text-sky-700"
          size={20}
        />
      </IconButton>
      <IconButton
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <IoChevronForwardSharp
          className="text-sky-600 hover:text-sky-900  dark:text-sky-500 dark:hover:text-sky-700"
          size={20}
        />
      </IconButton>
      <IconButton
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <HiOutlineChevronDoubleRight
          className="text-sky-600 hover:text-sky-900  dark:text-sky-500 dark:hover:text-sky-700"
          size={20}
        />
      </IconButton>
      <span className="flex items-center gap-1 text-sky-600 dark:text-sky-500">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount().toLocaleString()}
        </strong>
      </span>
      <span className="flex items-center gap-1 text-sky-600 dark:text-sky-500">
        | Go to page:
        <input
          type="number"
          min={1}
          max={table.getPageCount()}
          value={goToPageInput}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) : 1;
            setGoToPageInput(page);
            table.setPageIndex(page - 1);
          }}
          onBlur={() => {
            table.setPageIndex(goToPageInput - 1);
          }}
          className="w-12 p-[2px] h-full text-center rounded-md border-2 border-gray-300 dark:border-sky-500  bg-transparent font-sans text-sm font-normal outline outline-0 transition-all focus:placeholder-opacity-0 focus:border-customBlue focus:outline-0 text-slate-800 bg-slate-100 dark:text-gray-100"
        />
      </span>
      <select
        className="w-24 p-[3px] h-full rounded-md border-2 border-gray-300 dark:border-sky-500 bg-transparent font-sans text-sm font-normal outline outline-0 transition-all focus:placeholder-opacity-0 focus:border-customBlue focus:outline-0 text-slate-800 bg-slate-100 dark:text-gray-100 dark:bg-sky-700"
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[15, 25, 50, 100].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;

// import { Table } from "@tanstack/react-table";
// import React from "react";
// import IconButton from "./IconButton";
// import {
//   HiOutlineChevronDoubleLeft,
//   HiOutlineChevronDoubleRight,
// } from "react-icons/hi2";
// import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";

// interface PaginationProps {
//   table: Table<T>;
// }
// const Pagination: React.FC<PaginationProps> = ({ table }: PaginationProps) => {
//   return (
//     <div className="flex justify-end items-center gap-2 mt-2 px-2">
//       <IconButton
//         onClick={() => table.firstPage()}
//         disabled={!table.getCanPreviousPage()}
//       >
//         <HiOutlineChevronDoubleLeft
//           className="text-blue-600 hover:text-blue-900"
//           size={20}
//         />
//       </IconButton>
//       <IconButton
//         onClick={() => table.previousPage()}
//         disabled={!table.getCanPreviousPage()}
//       >
//         <IoChevronBackSharp
//           className="text-blue-600 hover:text-blue-900"
//           size={20}
//         />
//       </IconButton>
//       <IconButton
//         onClick={() => table.nextPage()}
//         disabled={!table.getCanNextPage()}
//       >
//         <IoChevronForwardSharp
//           className="text-blue-600 hover:text-blue-900"
//           size={20}
//         />
//       </IconButton>
//       <IconButton
//         onClick={() => table.lastPage()}
//         disabled={!table.getCanNextPage()}
//       >
//         <HiOutlineChevronDoubleRight
//           className="text-blue-600 hover:text-blue-900"
//           size={20}
//         />
//       </IconButton>
//       <span className="flex items-center gap-1 text-blue-600">
//         <div>Page</div>
//         <strong>
//           {table.getState().pagination.pageIndex + 1} of{" "}
//           {table.getPageCount().toLocaleString()}
//         </strong>
//       </span>
//       <span className="flex items-center gap-1 text-blue-600">
//         | Go to page:
//         <input
//           type="number"
//           min={1}
//           //max={}
//           defaultValue={table.getState().pagination.pageIndex + 1}
//           onChange={(e) => {
//             const page = e.target.value ? Number(e.target.value) - 1 : 0;
//             table.setPageIndex(page);
//           }}
//           className="w-12 p-[2px] h-full text-center rounded-md border-2 border-gray-300 bg-transparent font-sans text-sm font-normal outline outline-0 transition-all focus:placeholder-opacity-0 focus:border-customBlue  focus:outline-0 text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-slate-800"
//         />
//       </span>
//       <select
//         className="w-24 p-[3px] h-full rounded-md border-2 border-gray-300 bg-transparent font-sans text-sm font-normal outline outline-0 transition-all focus:placeholder-opacity-0 focus:border-customBlue  focus:outline-0 text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-slate-800"
//         value={table.getState().pagination.pageSize}
//         onChange={(e) => {
//           table.setPageSize(Number(e.target.value));
//         }}
//       >
//         {[15, 25, 50, 100].map((pageSize) => (
//           <option key={pageSize} value={pageSize}>
//             Show {pageSize}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default Pagination;
