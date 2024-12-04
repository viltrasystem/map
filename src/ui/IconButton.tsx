import React, { MouseEventHandler, ReactNode } from "react";

export type IconClasses = {
  padding_x?: string;
  background_color?: string;
  opacity?: string;
};

interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  disabled?: boolean;
  classes?: IconClasses;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  disabled,
  classes,
}) => {
  const baseClasses = `
    flex items-center justify-center ${classes?.opacity}
    ${classes?.padding_x ?? "px-1"} py-0 
    border-none bg-none rounded-sm 
    transition-all transform duration-300
    text-gray-600 dark:text-gray-200
    ${disabled ? "cursor-not-allowed opacity-50" : ""}
  `;

  const hoverClasses = disabled
    ? ""
    : `
      hover:text-gray-900 dark:hover:text-gray-900
      ${classes?.background_color ?? "hover:bg-slate-200"}
      active:bg-slate-300 
      hover:ring ${
        classes?.background_color?.includes("ring")
          ? ""
          : "hover:ring-slate-200"
      }
    `;

  return (
    <button
      className={`${baseClasses} ${hoverClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default IconButton;

// import React, { MouseEventHandler, ReactNode } from "react";

// export type IconClasses = {
//   padding_x: string;
//   background_color: string;
// };
// interface IconButtonProps {
//   onClick?: MouseEventHandler<HTMLButtonElement>;
//   children: ReactNode;
//   disabled?: boolean;
//   classes?: IconClasses;
// }

// const IconButton: React.FC<IconButtonProps> = ({
//   children,
//   onClick,
//   disabled,
//   classes,
// }) => {
//   return (
//     <button
//       className={`flex items-center justify-center ${
//         classes?.padding_x || "px-1"
//       }
// py-0 text-gray-600 dark:text-gray-200
//     ${
//       disabled
//         ? "cursor-not-allowed opacity-50"
//         : "hover:text-gray-900 dark:hover:text-gray-900"
//     }
//     bg-none border-none transform transition-all duration-900 border rounded-sm
//     ${
//       disabled
//         ? ""
//         : `hover:${
//             classes?.background_color || "bg-slate-200 hover:ring-slate-200"
//           } active:bg-slate-300 hover:ring`
//     }
//   `}
//       onClick={onClick}
//       disabled={disabled}
//     >
//       {children}
//     </button>
//   );
// };

// export default IconButton;
