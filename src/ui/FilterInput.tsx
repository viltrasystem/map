import React, { useState } from "react";
import { useAppDispatch } from "../app/hook";
import { setGlobalFilter } from "../slices/filterSlice";

const FilterInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    dispatch(setGlobalFilter(e.target.value));
  };
  const handleBlurEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setGlobalFilter(e.target.value));
  };

  const inputClasses: string =
    "h-6 w-full rounded-md border  border-1  border-slate-400 dark:border-slate-200 bg-transparent px-2 py-1 font-sans text-sm font-normal text-slate-700 dark:text-slate-100 outline outline-0 transition-all focus:placeholder-opacity-0 focus:border-customBlue  focus:outline-0";
  return (
    <input
      type="text"
      id="text_input"
      placeholder="filter"
      className={`${inputClasses} ${
        inputValue.length > 0 ? "border-sky-600 dark:border-sky-500" : ""
      }`}
      onChange={handleInputChange}
      onBlur={handleBlurEvent}
    />
  );
};

export default FilterInput;
