import React from "react";
import { useAppSelector } from "../app/hook";
import { RootState } from "../app/store";
import { transform } from "ol/proj";

const CoordinateDisplay: React.FC = () => {
  const coordinates = useAppSelector(
    (state: RootState) => state.mapFeature.coordinates
  );

  const transformedCoords = transform(coordinates, "EPSG:3857", "EPSG:25832");
  const formattedCoords = `Ø: ${Math.round(
    transformedCoords[0]!
  )}, N: ${Math.round(transformedCoords[1]!)}`;

  return (
    <div className={`p-2 rounded shadow-md text-xs`}>
      Coordinates: UTM 32, {formattedCoords}
    </div>
  );
};

export default CoordinateDisplay;
