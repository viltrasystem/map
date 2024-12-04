import { useDarkMode } from "../context/DarkModeContext";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import IconButton from "./IconButton";

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleDarkMode();
  };

  return (
    <IconButton onClick={handleClick}>
      {isDarkMode ? <HiOutlineSun size={30} /> : <HiOutlineMoon size={30} />}
    </IconButton>
  );
};

export default DarkModeToggle;

// <div className="flex flex-1 flex-grow flex-row justify-center items-center bg-slate-200">
//   <div className="flex flex-1 flex-grow"></div>
//   <div className="flex">
//     <ButtonIcon onClick={handleClick}>
//       {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
//     </ButtonIcon>
//   </div>
// </div>;
