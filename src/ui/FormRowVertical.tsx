import React, { ReactNode } from "react";
import Label from "./Label";
//import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import ErrorTxt from "./ErrorTxt";

interface FormRowVerticalProps {
  label: string;
  error:
    | string
    //  | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
  children: ReactNode;
  name: string;
  labelClasses: string;
  errorClasses: string;
}

const FormRowVertical: React.FC<FormRowVerticalProps> = ({
  label,
  name,
  labelClasses,
  errorClasses,
  error,
  children,
}) => {
  return (
    <div className="relative grid gap-1 mb-4">
      <Label name={name} classes={labelClasses}>
        {label}
      </Label>
      {children}
      {error && <ErrorTxt classes={errorClasses}>{error}</ErrorTxt>}
    </div>
  );
};

export default FormRowVertical;
