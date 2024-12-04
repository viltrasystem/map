import React from "react";
// import { FaSpinner } from "react-icons/fa";
import { useAppSelector } from "../app/hook";
import { RootState } from "../app/store";

const LoadingModal: React.FC = () => {
  const { isLoading } = useAppSelector((state: RootState) => state.loading);
  //if (isLoading || isLoading === undefined) return null;
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 border-gray-200 rounded-lg p-4 flex flex-col items-center md:w-40 sm:w-28">
            <p className="text-lg text-gray-800  dark:text-gray-200">
              Loading ...
            </p>
            {/* <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" /> */}
            <BarLoader />
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingModal;

export const BarLoader: React.FC = () => {
  return (
    <div className="w-full flex flex-col space-y-3 mt-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className={`h-[3px] overflow-hidden`}>
          <div
            className="animate-progress w-full h-full bg-hoverBlue dark:bg-sky-400 origin-left-right rounded-xl"
            style={{ animationDelay: `${index * 0.1}s` }}
          ></div>
        </div>
      ))}
    </div>
  );
};

// const BarLoader: React.FC = () => {
//   return (
//     <div className="flex space-x-2">
//       {[...Array(5)].map((_, index) => (
//         <div
//           key={index}
//           className="w-3 h-12 bg-blue-500 animate-bounce"
//           style={{ animationDelay: `${index * 0.1}s` }}
//         ></div>
//       ))}
//     </div>
//   );
// };
