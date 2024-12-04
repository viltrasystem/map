import { FaMagnifyingGlassMinus } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { RootState } from "../app/store";
import { setZoomLevel } from "../slices/mapFeatureSlice";
interface ZoomOutProp {
  setZoom: () => void;
}

const ZoomOut: React.FC<ZoomOutProp> = ({ setZoom }: ZoomOutProp) => {
  const mapZoom = useAppSelector(
    (state: RootState) => state.mapFeature.mapZoom
  );

  const dispatch = useAppDispatch();

  const handleZoomOut = () => {
    // Dispatch an action to increase the zoom level
    dispatch(setZoomLevel(mapZoom - 1));
    setZoom();
  };

  return (
    <button
      onClick={handleZoomOut}
      className="rounded-full p-[4px] w-8 h-8 flex items-center justify-center text-gray-800  hover:text-gray-100 hover:bg-gray-400  hover:ring-gray-600
        dark:text-tblColora  dark:hover:text-gray-800 dark:hover:bg-gray-400 dark:focus:ring-gray-800  dark:hover:ring-gray-600  transition duration-300"
    >
      <FaMagnifyingGlassMinus size={25} />
    </button>
  );
};

export default ZoomOut;
