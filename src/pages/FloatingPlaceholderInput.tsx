import { useState } from "react";

const FloatingPlaceholderInput = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="group relative">
      <input
        id="myInput"
        type="text"
        placeholder="Add border to this text"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(true)}
        className={`p-5 ${
          isFocused ? "border-2 border-dodgerblue rounded-3" : ""
        }`}
      />
      <label
        id="myInput-label"
        className={`hidden text-dodgerblue text-xs font-sans bg-white px-3 py-0 absolute left-12 top-${
          isFocused ? "-5" : "0"
        }`}
      >
        Add border to this text
      </label>
    </div>
  );
};

export default FloatingPlaceholderInput;
// import React, { useState } from "react";

// const FloatingPlaceholderInput = () => {
//   const [inputValue, setInputValue] = useState("");
//   const [isFocused, setIsFocused] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const handleInputFocus = () => {
//     setIsFocused(true);
//   };

//   const handleInputBlur = () => {
//     setIsFocused(false);
//   };

//   return (
//     <div className="relative">
//       <input
//         type="text"
//         id="placeholderInsideBorder"
//         name="placeholderInsideBorder"
//         value={inputValue}
//         onChange={handleInputChange}
//         onFocus={handleInputFocus}
//         onBlur={handleInputBlur}
//         className={`w-full px-3 py-2 border-2 border-gray-300 focus:outline-none ${
//           isFocused ? "focus:border-blue-500" : "border-transparent"
//         } relative z-10`}
//         placeholder="Input Label"
//       />
//       <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
//         <div
//           className={`border-2 border-gray-300 h-full w-full transition-all ${
//             isFocused ? "border-transparent" : "border-gray-300"
//           }`}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default FloatingPlaceholderInput;

// import React, { useState } from "react";

// const FloatingPlaceholderInput = () => {
//   const [inputValue, setInputValue] = useState("");

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   return (
//     <div className="relative">
//       <input
//         type="text"
//         id="placeholderInsideBorder"
//         name="placeholderInsideBorder"
//         value={inputValue}
//         onChange={handleInputChange}
//         className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-500 relative z-10"
//         placeholder="Input Label"
//       />
//       <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
//         <div className="border-2 border-gray-300 h-full w-full"></div>
//       </div>
//     </div>
//   );
// };

// export default FloatingPlaceholderInput;

// import React, { useState } from "react";

// const FloatingPlaceholderInput = () => {
//   const [inputValue, setInputValue] = useState("");
//   const [isFocused, setIsFocused] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const handleInputFocus = () => {
//     setIsFocused(true);
//   };

//   const handleInputBlur = () => {
//     setIsFocused(false);
//   };

//   return (
//     <div className="relative">
//       <input
//         type="text"
//         id="floatingInput"
//         name="floatingInput"
//         value={inputValue}
//         onChange={handleInputChange}
//         onFocus={handleInputFocus}
//         onBlur={handleInputBlur}
//         className="w-full px-2 py-2 border-gray-300 focus:border-blue-500"
//       />
//       <label
//         htmlFor="floatingInput"
//         className={`absolute left-3 transition-all ${
//           isFocused || inputValue ? "text-sm top-0" : "text-base top-2/4"
//         } text-gray-500 cursor-text`}
//       >
//         Input Label
//       </label>
//     </div>
//   );
// };

// export default FloatingPlaceholderInput;
