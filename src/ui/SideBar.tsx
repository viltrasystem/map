// import { RootState } from "../app/store";
// import { useAppSelector } from "../app/hook";
import { BsPrinter } from "react-icons/bs";
import { BsFiletypePdf } from "react-icons/bs";
import IconButton from "./IconButton";
import { MouseEventHandler, useRef } from "react";
import { FaDownload } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export type PrintInfo = {
  title: string;
};
interface SideBarProps {
  printMap: (arg: PrintInfo) => void;
  downloadMap: (arg: PrintInfo) => void;
  cancelDownloadMap: () => void;
}
const SideBar: React.FC<SideBarProps> = ({
  printMap,
  downloadMap,
  cancelDownloadMap,
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);
  const downloadRef = useRef<HTMLDivElement | null>(null);
  // const legendUrl = useAppSelector(
  //   (state: RootState) => state.mapLegend.legendUrl
  // );

  // const isSidebarVisible: boolean = useAppSelector(
  //   (state: RootState) => state.sideBar.isSidebarVisible
  // );
  const isSidebarVisible = true;

  const printBtnclickHandler: MouseEventHandler<
    HTMLButtonElement
  > = (): void => {
    const data: PrintInfo = {
      title: " print_title_print",
    };
    printMap(data);
    if (printRef.current && downloadRef.current) {
      printRef.current.style.display = "none";
      downloadRef.current.style.display = "flex";
    }
  };

  const downloadClickHandler: MouseEventHandler<HTMLDivElement> = (): void => {
    const data: PrintInfo = {
      title: " print_title_download",
    };
    downloadMap(data);
  };

  const downloadCancelClickHandler: MouseEventHandler<
    HTMLDivElement
  > = (): void => {
    // const data: PrintInfo = {
    //   title: " print_cancel_title",
    // };

    cancelDownloadMap();
    if (printRef.current && downloadRef.current) {
      downloadRef.current.style.display = "none";
      printRef.current.style.display = "";
    }
  };

  return (
    <aside
      id="Main"
      className={`transform ${
        isSidebarVisible ? "translate-x-0" : "-translate-x-full"
      } transition-transform ease-in-out flex flex-col justify-start items-start h-full overflow-y-auto bg-slate-400 dark:bg-gray-900 relative`}
      // style={{ width: "18rem" }}
    >
      {/* <img id="legend" src={legendUrl} alt="Legend" /> */}
      <div className="flex-shrink-0 p-4">
        {/* Top div content */}
        Top Content
      </div>
      <div className="flex-grow p-4 overflow-auto">
        {/* Middle div content */}
        Middle Content
      </div>
      <div className="flex-shrink-0 p-1 h-15 w-full border-t-[1px] border-gray-100 text-gray-100">
        <div
          ref={printRef}
          className="flex flex-col items-center gap-2 pt-[5px] p-2 border-collapse border-2 rounded-md  hover:border-2 hover:border-gray-100  shadow-xl"
        >
          <div className="flex items-center justify-center gap-1">
            <IconButton onClick={printBtnclickHandler}>
              <BsPrinter size={30} />
            </IconButton>
            <div className="w-[2px] h-7 bg-gray-400 mx-4"></div>
            <IconButton onClick={printBtnclickHandler}>
              <BsFiletypePdf size={30} />
            </IconButton>
          </div>
          <div>
            <span className="text-xs pt-5">Print/Pdf map extent</span>
          </div>
        </div>
        <div
          ref={downloadRef}
          className="hidden flex-col items-center gap-2 pt-1 p-2 border-collapse border-2 rounded-md  hover:border-2 hover:border-gray-100  shadow-xl"
        >
          <div className="flex justify-center gap-2">
            <div
              className="me-1 px-3 py-1 inline-flex items-center font-normal text-sm text-gray-900 bg-slate-400   dark:text-gray-900 dark:hover:text-gray-900  hover:text-gray-900 rounded-md hover:bg-slate-300 active:bg-slate-200 hover:ring-0 hover:ring-slate-100 cursor-pointer"
              onClick={downloadClickHandler}
            >
              <span className="pr-4"> Download</span>
              <FaDownload size={20} />
            </div>
            <div
              className="me-1 px-3 py-1 inline-flex items-center font-normal text-sm text-gray-900 bg-slate-400   dark:text-gray-900 dark:hover:text-gray-900  hover:text-gray-900 rounded-md hover:bg-slate-300 active:bg-slate-200 hover:ring-0 hover:ring-slate-100 cursor-pointer"
              onClick={downloadCancelClickHandler}
            >
              <span className="pr-4"> Cancel</span>
              <MdCancel size={25} />
            </div>
          </div>
          <div>
            <span className="text-xs pt-5">download seleted map</span>
          </div>
        </div>
      </div>
      {/* <div className="flex-shrink-0 p-4" style={{ height: "100px" }}>
        <IconButton onClick={printBtnclickHandler}>
          <BsPrinter size={35} />
        </IconButton>
        <IconButton onClick={printBtnclickHandler}>
          <BsFiletypePdf size={35} />
        </IconButton>
      </div> */}
    </aside>
  );
};

export default SideBar;
