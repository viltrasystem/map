import React, { useState } from "react";

interface SlideToggleProps {
  onValue: string;
  offValue: string;
  onToggle: (value: boolean) => void;
}

const SlideToggle: React.FC<SlideToggleProps> = ({
  //   onValue,
  //   offValue,
  onToggle,
}) => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
    onToggle(!isOn);
  };

  return (
    <div
      className={`flex items-center cursor-pointer w-[60px] p-0.5 rounded-full transition-all border-1 border-slate-400 dark:border-slate-400
        ${
          isOn ? "bg-sky-600 dark:bg-sky-500" : "bg-slate-400 dark:bg-slate-500"
        }`}
      onClick={handleToggle}
    >
      {/* Off Value */}
      {/* <div
        className={`flex-1 text-center text-xs ${
          !isOn
            ? "text-black dark:text-gray-200"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {offValue}
      </div> */}

      {/* Toggle Circle */}
      <div
        className={`w-4 h-4 p-2 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out
        ${isOn ? "translate-x-10" : "translate-x-0"}`}
      />

      {/* On Value */}
      {/* <div
        className={`flex-1 text-center text-xs ${
          isOn
            ? "text-black dark:text-gray-200"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {onValue}
      </div> */}
    </div>
  );
};

export default SlideToggle;
