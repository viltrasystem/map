import React, { useEffect, useState } from "react";

interface ErrorToggleProps {
  errors: (string | undefined)[];
  showError: boolean;
  submit: number;
}

const ErrorToggle: React.FC<ErrorToggleProps> = ({ errors, showError }) => {
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (showErrors) {
      const timer = setTimeout(() => {
        setShowErrors(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrors]);

  useEffect(() => {
    setShowErrors(showError);
  }, [showError]);

  const toggleVisibility = () => {
    setShowErrors((prev) => !prev);
  };

  return (
    <div className="relative w-full  px-6  h-4 -mt-2">
      {errors.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="border-b border-red-500 flex-grow mr-2" />
            <button className="flex items-center" onClick={toggleVisibility}>
              <span className="text-red-600 dark:text-red-600">
                {showErrors ? (
                  <svg
                    className="w-6 h-6 text-red-600 dark:text-red-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m5 15 7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-red-600 dark:text-red-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 9-7 7-7-7"
                    />
                  </svg>
                )}
              </span>
            </button>
          </div>
          {showErrors && (
            <div className="absolute left-0 right-0 bg-red-100 dark:bg-red-400 rounded w-[93%] m-auto z-10 p-6 -mt-1 ">
              <h4 className="text-red-600 dark:text-slate-50 font-semibold  text-sm pb-3">
                Please fixed following Error/s,{" "}
              </h4>
              <ul className="list-disc pl-6">
                {errors.map((error, index) => (
                  <li
                    key={index}
                    className="text-red-600 dark:text-slate-50  text-xs"
                  >
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ErrorToggle;

// import React, { useEffect, useState } from "react";

// interface ErrorToggleProps {
//   errors: string[]; // List of errors to display
// }

// const ErrorToggle: React.FC<ErrorToggleProps> = ({ errors }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [showErrors, setShowErrors] = useState(false);

//   // Automatically hide the error area after 4 seconds if it becomes visible
//   useEffect(() => {
//     if (showErrors) {
//       const timer = setTimeout(() => {
//         setShowErrors(false);
//       }, 4000);
//       return () => clearTimeout(timer);
//     }
//   }, [showErrors]);

//   const toggleVisibility = () => {
//     setShowErrors(!showErrors);
//   };

//   return (
//     <div className="relative w-full">
//       {errors.length > 0 && (
//         <>
//           <div className="flex items-center justify-between">
//             <div className="border-b border-gray-400 flex-grow mr-2" />
//             <button onClick={toggleVisibility} className="flex items-center">
//               <span className="text-gray-600">▼</span>
//             </button>
//           </div>
//           {showErrors && (
//             <div className="absolute left-0 right-0 mt-2 bg-red-100 border border-red-400 rounded z-10">
//               <h4 className="font-bold text-red-600">Errors:</h4>
//               <ul className="list-disc pl-5">
//                 {errors.map((error, index) => (
//                   <li key={index} className="text-red-600">
//                     {error}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ErrorToggle;

// import React, { useEffect, useState } from "react";

// interface ErrorToggleProps {
//   errors: string[]; // List of errors to display
// }

// const ErrorToggle: React.FC<ErrorToggleProps> = ({ errors }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [showErrors, setShowErrors] = useState(false);

//   // Automatically hide the error area after 4 seconds if it becomes visible
//   useEffect(() => {
//     if (showErrors) {
//       const timer = setTimeout(() => {
//         setShowErrors(false);
//       }, 4000);
//       return () => clearTimeout(timer);
//     }
//   }, [showErrors]);

//   const toggleVisibility = () => {
//     setShowErrors(!showErrors);
//   };

//   return (
//     <div className="w-full">
//       {errors.length > 0 && (
//         <div className="flex items-center justify-between">
//           <div className="border-b border-gray-400 flex-grow mr-2" />
//           <button onClick={toggleVisibility} className="flex items-center">
//             <span className="text-gray-600">▼</span>
//           </button>
//         </div>
//       )}
//       {showErrors && (
//         <div className="mt-2 p-4 bg-red-100 border border-red-400 rounded">
//           <h4 className="font-bold text-red-600">Errors:</h4>
//           <ul className="list-disc pl-5">
//             {errors.map((error, index) => (
//               <li key={index} className="text-red-600">
//                 {error}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ErrorToggle;
