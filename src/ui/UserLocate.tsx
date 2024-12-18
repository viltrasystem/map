import { useState, useEffect } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useAppDispatch } from "../app/hook";
import {
  setAccuracy,
  setCenter,
  setUserCoordinate,
  setZoomLevel,
} from "../slices/mapFeatureSlice";
import { toast } from "react-toastify";
import { getToastOptions } from "../lib/helpFunction";

interface UserLocateProp {
  setUserLocation: (tracking: boolean) => void;
}

const UserLocate: React.FC<UserLocateProp> = ({ setUserLocation }) => {
  const dispatch = useAppDispatch();
  const [isTracking, setIsTracking] = useState(false);

  const toggleTracking = () => {
    const tracking = !isTracking;
    setIsTracking(tracking);
    setUserLocation(tracking);
  };

  useEffect(() => {
    if (!isTracking) return;

    let intervalId: NodeJS.Timeout;

    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude, accuracy } = position.coords;

            // Update the state and dispatch actions
            dispatch(setUserCoordinate([longitude, latitude]));
            dispatch(setCenter([longitude, latitude]));
            dispatch(setZoomLevel(18));
            dispatch(setAccuracy(accuracy));
            setUserLocation(true);
          },
          (error) => {
            toast.error(`Error getting user location: ${error.message}`, {
              ...getToastOptions(),
              position: "top-center",
            });
          },
          { enableHighAccuracy: true }
        );
      } else {
        toast.error("Geolocation is not supported by your browser.", {
          ...getToastOptions(),
          position: "top-center",
        });
      }
    };

    // Fetch location immediately and then set interval
    fetchUserLocation();
    intervalId = setInterval(fetchUserLocation, 5000);

    return () => {
      clearInterval(intervalId);
      setUserLocation(false);
    };
  }, [isTracking, setUserLocation, dispatch]);
  return (
    <button
      onClick={toggleTracking}
      className={`rounded-full p-[4px] w-8 h-8 flex items-center justify-center ${
        isTracking
          ? "text-green-600 hover:text-green-300 dark:text-green-600 dark:hover:text-green-300 bg-gray-300"
          : "text-gray-800 hover:text-gray-100 dark:text-tblColora dark:hover:text-gray-800"
      } hover:bg-gray-400 hover:ring-gray-600
          dark:hover:bg-gray-400 
        dark:focus:ring-gray-800 dark:hover:ring-gray-600 transition duration-300`}
    >
      <FaLocationCrosshairs size={25} />
    </button>
  );
};

export default UserLocate;

// import { useState, useEffect } from "react";
// import { FaLocationCrosshairs } from "react-icons/fa6";
// import { useAppDispatch } from "../app/hook";
// import {
//   setAccuracy,
//   setCenter,
//   setUserCoordinate,
//   setZoomLevel,
// } from "../slices/mapFeatureSlice";
// import { toast } from "react-toastify";
// import { getToastOptions } from "../lib/helpFunction"; //addMetersToCoordinates,

// interface UserLocateProp {
//   setUserLocation: (tracking: boolean) => void;
// }

// const UserLocate: React.FC<UserLocateProp> = ({ setUserLocation }) => {
//   const dispatch = useAppDispatch();
//   const [isTracking, setIsTracking] = useState(false);

//   const toggleTracking = () => {
//     const tracking = !isTracking; // Toggle the tracking state
//     setIsTracking(tracking);
//     setUserLocation(tracking);
//   };

//   useEffect(() => {
//     if (!isTracking) return;
//     // let latitude = 59.8817826;
//     // let longitude = 10.7779668;
//     const updateUserPosition = (position: GeolocationPosition) => {
//       const { longitude, latitude, accuracy } = position.coords;
//       //const { latitude, longitude, accuracy } = position.coords;

//       // const { newLon, newLat } = addMetersToCoordinates(
//       //   latitude,
//       //   longitude,
//       //   5,
//       //   1
//       // );
//       // latitude = newLat;
//       // longitude = newLon;
//       //console.log({ newLon, newLat, accuracy }, "Live Tracking Data");
//       dispatch(setUserCoordinate([longitude, latitude]));
//       dispatch(setCenter([longitude, latitude]));
//       dispatch(setZoomLevel(18));
//       dispatch(setAccuracy(accuracy));
//       setUserLocation(isTracking);
//     };

//     const errorHandler = (error: GeolocationPositionError) => {
//       toast.error(`Error getting user location: ${error.message}`, {
//         ...getToastOptions(),
//         position: "top-center",
//       });
//     };

//     const watchId = navigator.geolocation.watchPosition(
//       updateUserPosition,
//       errorHandler,
//       { enableHighAccuracy: true }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, [isTracking, setUserLocation, dispatch]);
//   console.log(isTracking, "UserLocate...................");
//   return (
//     <button
//       onClick={toggleTracking}
//       className={`rounded-full p-[4px] w-8 h-8 flex items-center justify-center ${
//         isTracking
//           ? "text-green-600 hover:text-green-300 dark:text-green-600 dark:hover:text-green-300 bg-gray-300"
//           : "text-gray-800   hover:text-gray-100 dark:text-tblColora dark:hover:text-gray-800"
//       }  hover:bg-gray-400 hover:ring-gray-600
//           dark:hover:bg-gray-400
//         dark:focus:ring-gray-800 dark:hover:ring-gray-600 transition duration-300`}
//     >
//       <FaLocationCrosshairs size={25} />
//     </button>
//   );
// };

// export default UserLocate;
