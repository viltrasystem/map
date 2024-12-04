import React, { ReactNode } from "react";
import ErrorTxt from "./ErrorTxt";
import { FaInfoCircle } from "react-icons/fa";
import ToolTip from "./ToolTip";

interface FormRowHorizontalProps {
  label: string;
  error?:
    | string
    //  | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
  children: ReactNode;
  name: string;
  message?: string;
  width?: string;
  labelClasses: string;
  errorClasses: string;
}

const FormRowHorizontal: React.FC<FormRowHorizontalProps> = ({
  label,
  name,
  message,
  labelClasses,
  width,
  errorClasses,
  error,
  children,
}) => {
  return (
    <div className="relative flex flex-row items-start justify-around space-x-4 text-sm group">
      <div className={`${width || "w-28"} flex-shrink-0`}>
        <label htmlFor={name} className={`${labelClasses} flex items-center`}>
          {label}
          {message && (
            <ToolTip message={message}>
              <FaInfoCircle className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700" />
            </ToolTip>
          )}
        </label>
      </div>
      <div className="flex flex-1 flex-col justify-center h-8">
        {children}
        <div className="min-h-[0.8rem] text-xs">
          {error && <ErrorTxt classes={`${errorClasses}`}>{error}</ErrorTxt>}
        </div>
      </div>
    </div>
  );
};

export default FormRowHorizontal;
