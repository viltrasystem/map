import { FaMagnifyingGlassPlus } from "react-icons/fa6";
import { setZoomLevel } from "../slices/mapFeatureSlice";
import { useAppSelector, useAppDispatch } from "../app/hook";
import { RootState } from "../app/store";
interface ZoomInProp {
  setZoom: () => void;
}

const ZoomIn: React.FC<ZoomInProp> = ({ setZoom }: ZoomInProp) => {
  const mapZoom = useAppSelector(
    (state: RootState) => state.mapFeature.mapZoom
  );

  const dispatch = useAppDispatch();

  const handleZoomIn = () => {
    dispatch(setZoomLevel(mapZoom + 1));
    setZoom();
  };

  return (
    <button
      onClick={handleZoomIn}
      className="rounded-full p-[4px] w-8 h-8 flex items-center justify-center text-gray-800  hover:text-gray-100 hover:bg-gray-400  hover:ring-gray-600
        dark:text-tblColora  dark:hover:text-gray-800 dark:hover:bg-gray-400 dark:focus:ring-gray-800  dark:hover:ring-gray-600  transition duration-300"
    >
      <FaMagnifyingGlassPlus size={25} />
    </button>
  );
};

export default ZoomIn;
