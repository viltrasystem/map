import { FaLocationCrosshairs } from "react-icons/fa6";
import { useAppDispatch } from "../app/hook";
import { setCenter, setUserCoordinate } from "../slices/mapFeatureSlice";
import { toast } from "react-toastify";
import { getToastOptions } from "../lib/helpFunction";
import { transform } from "ol/proj";

interface UserLocateProp {
  setUserLocation: () => void;
}

const UserLocate: React.FC<UserLocateProp> = ({
  setUserLocation,
}: UserLocateProp) => {
  const dispatch = useAppDispatch();

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setUserCoordinate([latitude, longitude]));
          const transformedCoords = transform(
            [latitude, longitude],
            "EPSG:3857",
            "EPSG:25832"
          );
          dispatch(setCenter([latitude, longitude]));
          const formattedCoords = `Ø: ${Math.round(
            transformedCoords[0]!
          )}, N: ${Math.round(transformedCoords[1]!)}`;
          setUserLocation();
          console.log([latitude, longitude], "first");
          console.log(
            transform([latitude, longitude], "EPSG:3857", "EPSG:25832"),
            "second"
          );
          console.log(
            transform([latitude, longitude], "EPSG:4326", "EPSG:3857"),
            "third"
          );
          toast.success(`${formattedCoords}`, {
            ...getToastOptions(),
            position: "top-center",
          });
        },
        (error) => {
          toast.success(`Error getting user location:, ${error}`, {
            ...getToastOptions(),
            position: "top-center",
          });
        }
      );
    } else {
      toast.success("Geolocation is not supported by this browser", {
        ...getToastOptions(),
        position: "top-center",
      });
    }
  };
  return (
    <button
      onClick={getUserLocation}
      className="rounded-full p-[4px] w-8 h-8 flex items-center justify-center text-gray-800  hover:text-gray-100 hover:bg-gray-400  hover:ring-gray-600
        dark:text-tblColora  dark:hover:text-gray-800 dark:hover:bg-gray-400 dark:focus:ring-gray-800  dark:hover:ring-gray-600  transition duration-300"
    >
      <FaLocationCrosshairs size={25} />
    </button>
  );
};

export default UserLocate;
