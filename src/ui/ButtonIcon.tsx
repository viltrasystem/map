import { ReactNode, MouseEvent } from "react";

interface IButtonIconProp {
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
}

const ButtonIcon = ({ children, onClick, disabled }: IButtonIconProp) => {
  return (
    <button
      className="bg-none border-none p-3 rounded-sm transition-all duration-200 hover:bg-zinc-300 w-9 h-9 text-slate-200"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ButtonIcon;
