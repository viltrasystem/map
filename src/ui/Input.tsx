import React from "react";
import {
  FieldPath,
  // FieldPathValue,
  // FieldValues,
  // FieldPathValue,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

interface InputProps<T extends FieldValues> {
  type: string;
  id: string;
  name: FieldPath<T>;
  placeholder?: string;
  className: string;
  register: UseFormRegister<T>;
  disabled: boolean;
  isNumber?: boolean;
  onFocused?: React.FocusEventHandler<HTMLInputElement>;
  required?: boolean;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = <T extends FieldValues>({
  type,
  id,
  name,
  placeholder,
  className,
  register,
  disabled,
  onFocused,
  onBlur,
  isNumber,
  required,
}: InputProps<T>) => {
  // const { onChange, ...rest } = register;
  // // Create a custom onChange handler
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   // Call the custom onChanged handler if it exists
  //   if (onChanged) {
  //     onChanged(event);
  //     console.log("fired");
  //   }
  //   // Call the register's onChange function
  //   onChange(event); // Call register's onChange handler
  // };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if (!isNumber) {
      return;
    }

    if (
      event.key === "Backspace" ||
      event.key === "Delete" ||
      event.key === "Tab" ||
      event.key === "Escape" ||
      event.key === "Enter"
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (event.key < "0" || event.key > "9") &&
      event.key !== "." &&
      event.key !== ","
    ) {
      event.preventDefault();
    }
  };

  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      onFocus={onFocused}
      onKeyDown={handleKeyDown}
      {...register(name, {
        required,
        onBlur: (event) => {
          if (onBlur) {
            onBlur(event);
          }
        },
      })}
    />
  );
};
export default Input;
