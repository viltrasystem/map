import { createAsyncThunk } from "@reduxjs/toolkit";
import { GeoJSON } from "ol/format";
import mapDrawnFeaturesApi from "../services/mapDrawnFeaturesApi";
import { RootState } from "../app/store";
import { v4 as uuidv4 } from "uuid";
import { extractStyle } from "../lib/helpFunction";
import { setSavedDrawnFeatures } from "../slices/mapSavedFeatureSlice";
// import { extractStyle } from "../lib/helpFunction";
// import { transform } from "proj4";
const SAVEFEATURES = "SAVEFEATURES";

export const saveUserDrawnFeatures = createAsyncThunk(
  SAVEFEATURES,
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as RootState;
    const drawnFeatures = state.mapDrawnFeature.drawnFeatures;

    if (drawnFeatures.length === 0) {
      return rejectWithValue("No features to save");
    } else {
      const geojsonFormat = new GeoJSON();
      const featuresGeoJSON = geojsonFormat.writeFeaturesObject(
        drawnFeatures.map((feature) => {
          const styleData = extractStyle(feature.geometry);
          const clonedFeature = feature.geometry.clone();
          clonedFeature.getGeometry()?.transform("EPSG:3857", "EPSG:4326");
          // Add style data to the feature's properties
          clonedFeature.setProperties({
            ...clonedFeature.getProperties(),
            style: styleData,
            id: feature.id ?? uuidv4(),
            iconType: feature.iconType,
            iconColor: feature.iconColor,
            iconSize: feature.iconSize,
          });
          return clonedFeature;
        })
      );

      const geojsonString = JSON.stringify(featuresGeoJSON);

      const response = await mapDrawnFeaturesApi.saveDrawnFeatures(
        geojsonString
      );
      //return response.data;
      dispatch(setSavedDrawnFeatures(response.data));
    }
  }
);

// export const saveUserDrawnFeatures = createAsyncThunk(
//   SAVEFEATURES,
//   async (_, { getState, rejectWithValue }) => {
//     const state = getState() as RootState;
//     const features = state.mapDrawnFeature.drawnFeatures;

//     if (features.length === 0) {
//       return rejectWithValue("No features to save");
//     } else {
//       const geojsonFormat = new GeoJSON();
//       const featuresGeoJSON = geojsonFormat.writeFeaturesObject(
//         features.map((feature) => {
//           const styleData = extractStyle(feature);
//           const clonedFeature = feature.clone();
//           clonedFeature.getGeometry()?.transform("EPSG:3857", "EPSG:4326");
//           // Add style data to the feature's properties
//           clonedFeature.setProperties({
//             ...clonedFeature.getProperties(),
//             style: styleData,
//           });
//           return clonedFeature;
//         })
//       );

//       const geojsonString = JSON.stringify(featuresGeoJSON);

//       const response = await mapDrawnFeaturesApi.saveDrawnFeatures(
//         geojsonString
//       );
//       return response.data;
//     }
//   }
// );
