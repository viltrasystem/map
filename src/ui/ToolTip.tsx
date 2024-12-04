import React from "react";

interface ToolTipProps {
  message: string;
  children: React.ReactNode;
}

const ToolTip: React.FC<ToolTipProps> = ({ message, children }) => {
  return (
    <div className="group relative flex">
      {children}
      <span className="absolute min-w-max text-white dark:text-slate-100 text-xs rounded py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2 scale-0 transition-all bg-gray-600 bg-opacity-90 dark:bg-sky-600 dark:bg-opacity-90 group-hover:scale-100">
        {message}
      </span>
    </div>
  );
};

export default ToolTip;
