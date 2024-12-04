// ListComponent.tsx
import React from "react";

interface ListProps {
  options: string[] | number[];
  // listNumber: number;
  handleListSelect: (option: string) => void;
  selectedValue: string | number;
}

const ListComponent: React.FC<ListProps> = ({
  options,
  handleListSelect,
  selectedValue,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption: string | number = e.target.value;
    handleListSelect(selectedOption);
  };

  return (
    <div className="min-w-[100px]">
      <select
        onChange={handleChange}
        value={selectedValue}
        className="h-full w-full rounded-md  border-2  border-gray-400 bg-transparent  px-3 py-2 font-sans text-sm font-normal outline outline-0 transition-all focus:placeholder-opacity-0 focus:border-customBlue  focus:outline-0 text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-gray-800 dark:bg-opacity-40"
      >
        {options.map((option) => (
          <option
            key={option}
            value={`${
              typeof option === "string" ? option.toLowerCase() : option
            }`}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ListComponent;
