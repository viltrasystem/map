import { BiLoaderAlt } from "react-icons/bi";

interface SpinnerMiniProps {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
}

const SpinnerMini = ({ width, height, padding, margin }: SpinnerMiniProps) => (
  <BiLoaderAlt
    className={`${width ?? "w-5"} ${height ?? "h-5"} ${padding ?? ""} ${
      padding ?? ""
    } ${
      margin ?? ""
    }  dark:text-slate-50 animate-spin duration-1500 infinite linear`}
  />
);

export default SpinnerMini;
