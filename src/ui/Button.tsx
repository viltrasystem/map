import React, { ReactNode } from "react";
interface ButtonProps {
  type?: "submit" | "reset" | "button" | undefined;
  disabled: boolean;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type, disabled, children }) => {
  //border-2 border-gray-300 dark:border-gray-400
  return (
    <button
      type={type}
      disabled={disabled}
      className="inline-block w-full justify-center rounded-lg px-6 py-2 text-xs font-medium uppercase bg-btn dark:bg-btn opacity-80 dark:opacity-90 text-white
             shadow-md transition-all duration-200 ease-in-out transform hover:scale-100 hover:shadow-lg active:scale-98 hover:opacity-70 active:opacity-60  dark:hover:opacity-80 dark:active:opacity-90
             focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 dark:focus:ring-offset-slate-300"
    >
      {children}
    </button>
  );
};

export default Button;
//background-gradient
