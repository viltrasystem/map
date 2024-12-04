import React from "react";
import {
  FieldPath,
  FieldValues,
  // FieldPathValue,
  // FieldValues,
  // FieldPathValue,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

interface LocaleInputProps<T extends FieldValues> {
  type: string;
  id: string;
  name: FieldPath<T>;
  placeholder?: string;
  className: string;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  disabled: boolean;
  onFocused?: React.FocusEventHandler<HTMLInputElement>;
  required?: boolean;
  locale: string;
}

const LocaleInput = <T extends FieldValues>({
  type,
  id,
  name,
  placeholder,
  className,
  register,
  setValue,
  disabled,
  onFocused,
  required,
  locale,
}: LocaleInputProps<T>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Replace '.' with ',' if locale is 'de-DE'
    if (locale === "nb-NO") {
      inputValue = inputValue.replace(".", ",");
    }
    if (!disabled) {
      setValue(name, inputValue as any, { shouldValidate: true });
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
      {...register(name, {
        required,
        onChange: handleChange, // Override the default `onChange` with your custom handler
      })}
    />
  );
};

export default LocaleInput;
