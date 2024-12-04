import { useState } from "react";
import topoThumbnail from "../assets/images/base-topo.png";
import topograatoneThumbnail from "../assets/images/base-topograatone.png";
import sjokartrasterThumbnail from "../assets/images/base-sjokartraster.png";
import toporasterThumbnail from "../assets/images/base-toporaster.png";
import { useAppSelector } from "../app/hook";
import { RootState } from "../app/store";

type ChildProps = {
  toggleBaseLayer: (value: string) => void;
};

const LayerSelection: React.FC<ChildProps> = ({ toggleBaseLayer }) => {
  const [selectedLayer, setSelectedLayer] = useState("topo");
  const [selectedLayerImageSource, setSelectedLayerImageSource] =
    useState(topoThumbnail);
  const [isListVisible, setIsListVisible] = useState(false);
  const { bottomPaneHeight } = useAppSelector(
    (state: RootState) => state.resize
  );

  const onLayerSelect = (layerName: string) => {
    setSelectedLayer(layerName);
    switch (layerName.toLowerCase()) {
      case "topo":
        setSelectedLayerImageSource(topoThumbnail);
        break;
      case "topograatone":
        setSelectedLayerImageSource(topograatoneThumbnail);
        break;
      case "toporaster":
        setSelectedLayerImageSource(toporasterThumbnail);
        break;
      case "sjokartraster":
        setSelectedLayerImageSource(sjokartrasterThumbnail);
        break;
      default:
        setSelectedLayerImageSource(topoThumbnail);
    }
    toggleBaseLayer(layerName);
    setIsListVisible(false);
  };

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsListVisible(false);
    }, 1000);
  };

  return (
    <>
      {!isListVisible ? (
        <img
          src={selectedLayerImageSource}
          alt="Show Layers"
          className="w-16 h-16 cursor-pointer border-2 hover:border-orange-300 hover:border-3 focus:border-orange-400 transition-transform duration-500 transform hover:scale-110"
          onClick={toggleListVisibility}
        />
      ) : (
        <ul
          className={`flex space-x-2 transition-transform duration-700 ${
            bottomPaneHeight < 75 ? "" : "hidden"
          } ${
            isListVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-5 scale-95"
          } ${isListVisible ? "ease-out" : "ease-in"}`}
          onMouseLeave={handleMouseLeave}
        >
          <li>
            <img
              src={topoThumbnail}
              alt="Terrain Layer"
              className={`${
                selectedLayer === "kartdata3"
                  ? "border-blue-400 border-3 shadow-2xl"
                  : "border-gray-300"
              } w-16 h-16 cursor-pointer border-2 hover:border-orange-300 hover:border-3 focus:border-orange-400 transition-transform duration-500 transform hover:scale-110`}
              onClick={() => onLayerSelect("topo")}
            />
          </li>
          <li>
            <img
              src={topograatoneThumbnail}
              alt="Terrain Layer"
              className={`${
                selectedLayer === "topograatone"
                  ? "border-blue-400 border-3 shadow-2xl"
                  : "border-gray-300"
              } w-16 h-16 cursor-pointer border-2 hover:border-orange-300 hover:border-3 focus:border-orange-400 transition-transform duration-500 transform hover:scale-110`}
              onClick={() => onLayerSelect("topograatone")}
            />
          </li>
          <li>
            <img
              src={toporasterThumbnail}
              alt="Satellite Layer"
              className={`${
                selectedLayer === "europa_forenklet"
                  ? "border-blue-400 border-3 shadow-2xl"
                  : "border-gray-300"
              } w-16 h-16 cursor-pointer border-2 hover:border-orange-300 hover:border-3 focus:border-orange-400 transition-transform duration-500 transform hover:scale-110`}
              onClick={() => onLayerSelect("toporaster")}
            />
          </li>
          <li>
            <img
              src={sjokartrasterThumbnail}
              alt="Street Layer"
              className={`${
                selectedLayer === "havbunn_grunnkart"
                  ? "border-blue-400 border-3 shadow-2xl"
                  : "border-gray-300"
              } w-16 h-16 cursor-pointer border-2 hover:border-orange-300 hover:border-3 focus:border-orange-400 transition-transform duration-500 transform hover:scale-110`}
              onClick={() => onLayerSelect("sjokartraster")}
            />
          </li>
        </ul>
      )}
    </>
  );
};

export default LayerSelection;
