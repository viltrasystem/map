import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadLand } from "../thunk/selectedlandThunk";
import { getToastOptions } from "../lib/helpFunction";
import { toast } from "react-toastify";
import { LandInformation } from "../lib/types";

export interface SelectedLand {
  municipality: string;
  mainNo: number;
  subNo: number;
  plotNo?: string | number | undefined;
}

type existingLandState = {
  isCurrentRequest: boolean;
  identificationStr: string;
};

interface SelectedLandState {
  status: string;
  isLoading: boolean;
  isloaded: boolean;
  noContent: boolean;
  notFound: boolean;
  // isLandAvailable: boolean;
  isLandExist: boolean;
  landList: SelectedLand[];
  existingLandList: existingLandState[];
  land: any[];
  isError: boolean;
  error: {
    errorMsg: string | null | undefined;
    statusCode: number | null | undefined;
  };
  landInfo: LandInformation[];
  layerInfo: {
    layerName: string | undefined;
    isClicked: false;
    isMouseEnter: false;
    version: number;
  };
}

const initialState: SelectedLandState = {
  isLoading: false,
  status: "idle",
  isloaded: false,
  isLandExist: false,
  noContent: false,
  notFound: false,
  // land: {
  //   Objid: 0,
  //   Objtype: null,
  //   Teigid: 0,
  //   Navnerom: "",
  //   Versjonid: null,
  //   Datafangstdato: null,
  //   Oppdateringsdato: new Date(),
  //   Datauttaksdato: null,
  //   Malemetode: null,
  //   Noyaktighet: null,
  //   Representasjonspunkt: null,
  //   Omrade: new Geometry(),
  //   Kommunenummer: "",
  //   Kommunenavn: "",
  //   Matrikkelnummertekst: "",
  //   Teigmedflerematrikkelenheter: false,
  //   Tvist: false,
  //   Uregistrertjordsameie: false,
  //   Avklarteiere: null,
  //   Lagretberegnetareal: null,
  //   Arealmerknadtekst: null,
  //   Noyaktighetsklasseteig: null,
  //   Uuidteig: "",
  // },
  landList: [],
  existingLandList: [],
  land: [],
  isError: false,
  error: {
    errorMsg: null,
    statusCode: null,
  },
  landInfo: [],
  layerInfo: {
    isClicked: false,
    isMouseEnter: false,
    layerName: undefined,
    version: 0,
  },
};

const selectedlandSlice = createSlice({
  name: "selectedland",
  initialState: initialState,
  reducers: {
    setselectedLandState: (state, action: PayloadAction<SelectedLand>) => {
      // const land = {
      //   ...action.payload,
      //   municipality: action.payload.municipality.substring(
      //     action.payload.municipality.length - 4
      //   ),
      // };
      state.landList.push(action.payload);
    },
    removeSelectedLandLayer: (state, action: PayloadAction<SelectedLand>) => {
      const { municipality, mainNo, subNo, plotNo } = action.payload;

      state.landInfo = state.landInfo.filter((land) => {
        const isMatch =
          land.Municipality === municipality &&
          land.MainNo === mainNo.toString() &&
          land.SubNo === subNo.toString();

        // If plotNo is provided, include it in the matching criteria
        if (plotNo !== undefined) {
          return !(isMatch && land.PlotNo === plotNo);
        }

        return !isMatch;
      });

      state.landList = state.landList.filter((land) => {
        const isMatch =
          land.municipality === municipality &&
          land.mainNo === mainNo &&
          land.subNo === subNo;

        if (plotNo !== undefined) {
          return !(isMatch && land.plotNo === plotNo);
        }

        return !isMatch;
      });

      state.land = state.land.filter((featureCollection) => {
        const feature = featureCollection.features[0];
        const { Kommunenummer, Matrikkelnummertekst } = feature.properties;

        return !(
          Kommunenummer === municipality &&
          Matrikkelnummertekst === `${mainNo}/${subNo}`
        );
      });

      state.existingLandList = state.existingLandList.filter(
        (existingFeature) =>
          existingFeature.identificationStr !== `${mainNo}/${subNo}`
      );
    },
    // setSelectedLayerState: (state, action: PayloadAction<any>) => {
    //   state.layerInfo.layerName = action.payload.layerName;
    //   state.layerInfo.isClicked = action.payload.isClicked;
    //   state.layerInfo.isMouseEnter = action.payload.isMouseEnter;
    //   state.layerInfo.version += 1;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLand.pending, (state) => {
        state.status = "loading";
        state.noContent = false;
        state.notFound = false;
        state.isLoading = true;
        state.isloaded = false;
        // state.isLandAvailable = false;
        state.isError = false;
        state.error = {
          statusCode: null,
          errorMsg: null,
        };
        state.layerInfo = {
          layerName: undefined,
          isClicked: false,
          version: 0,
          isMouseEnter: false,
        };

        // state.land = []/////
        // state.land = {
        //   Objid: 0,
        //   Objtype: null,
        //   Teigid: 0,
        //   Navnerom: "",
        //   Versjonid: null,
        //   Datafangstdato: null,
        //   Oppdateringsdato: new Date(),
        //   Datauttaksdato: null,
        //   Malemetode: null,
        //   Noyaktighet: null,
        //   Representasjonspunkt: null,
        //   Omrade: new Geometry(),
        //   Kommunenummer: "",
        //   Kommunenavn: "",
        //   Matrikkelnummertekst: "",
        //   Teigmedflerematrikkelenheter: false,
        //   Tvist: false,
        //   Uregistrertjordsameie: false,
        //   Avklarteiere: null,
        //   Lagretberegnetareal: null,
        //   Arealmerknadtekst: null,
        //   Noyaktighetsklasseteig: null,
        //   Uuidteig: "",
        // };
      })
      .addCase(loadLand.fulfilled, (state, action: PayloadAction<any>) => {
        // const {
        //   Objid,
        //   Objtype,
        //   Teigid,
        //   Navnerom,
        //   Versjonid,
        //   Datafangstdato,
        //   Oppdateringsdato,
        //   Datauttaksdato,
        //   Malemetode,
        //   Noyaktighet,
        //   Representasjonspunkt,
        //   Omrade,
        //   Kommunenummer,
        //   Kommunenavn,
        //   Matrikkelnummertekst,
        //   Teigmedflerematrikkelenheter,
        //   Tvist,
        //   Uregistrertjordsameie,
        //   Avklarteiere,
        //   Lagretberegnetareal,
        //   Arealmerknadtekst,
        //   Noyaktighetsklasseteig,
        //   Uuidteig,
        // } = action.payload;
        state.isLoading = false;
        state.isloaded = true;
        //   state.isLandAvailable = action.payload.MapGeoJson !== "";
        state.status = "succeeded";
        if (action.payload.noContent) {
          state.noContent = true;
          state.landList.pop();
        } else {
          //    if (state.isLandAvailable) {
          JSON.parse(action.payload.MapGeoJson).features.forEach(
            (landFeature: any) => {
              const exists = state.existingLandList.some(
                (existingFeature) =>
                  // JSON.parse(existingFeature).features[0].properties
                  //   .Matrikkelnummertekst ===
                  existingFeature.identificationStr ===
                    landFeature.properties.Matrikkelnummertekst &&
                  !existingFeature.isCurrentRequest
              );
              // const exists = state.land.some(
              //   (existingFeature) =>
              //     // JSON.parse(existingFeature).features[0].properties
              //     //   .Matrikkelnummertekst ===
              //     existingFeature.features[0].properties
              //       .Matrikkelnummertekst ===
              //     landFeature.properties.Matrikkelnummertekst
              // );

              if (!exists) {
                const feature = {
                  features: [landFeature],
                  type: "FeatureCollection",
                };

                state.land.push(feature);
                state.existingLandList.push({
                  // existing previous requested land removing
                  identificationStr:
                    landFeature.properties.Matrikkelnummertekst,
                  isCurrentRequest: true,
                });
              }
            }
          );

          state.existingLandList = state.existingLandList.map((land) => ({
            ...land,
            isCurrentRequest: false,
          }));

          if (action.payload.LandInformations != null) {
            const landsInfo = action.payload.LandInformations;
            landsInfo.forEach((land: LandInformation) => {
              const landInfo: LandInformation = {
                LandId: land.LandId,
                AreaInAgriculture: land.AreaInAgriculture,
                AreaInMountain: land.AreaInMountain,
                AreaInForest: land.AreaInForest,
                Municipality: land.Municipality,
                MainNo: land.MainNo,
                SubNo: land.SubNo,
                TotalArea: land.TotalArea,
                Notes: land.Notes,
                PlotNo: land.PlotNo,
                OwnershipTypeId: land.OwnershipTypeId,
                CreatedBy: land.CreatedBy,
                CreatedOn: land.CreatedOn,
                LastUpdatedBy: land.LastUpdatedBy,
                LastUpdatedDate: land.LastUpdatedDate,
                MunicipalityName: land.MunicipalityName,
              };
              state.landInfo.push(landInfo);
            });
          } else {
            state.landList.pop();
            toast.warning(
              "No land information found for the given lanad details in viltrapporten land register",
              {
                ...getToastOptions(),
                position: "top-center",
              }
            );
          }
          // }
        }
        //state.land.push(action.payload);
        // console.log(
        //   action.payload.MapGeoJson,
        //   action.payload.LandInformation,
        //   "land loadeddddddddddddddddd"
        // );
        // {
        //   Objid: Objid,
        //   Objtype: Objtype ?? null,
        //   Teigid: Teigid,
        //   Navnerom: Navnerom,
        //   Versjonid: Versjonid ?? null,
        //   Datafangstdato: Datafangstdato ?? null,
        //   Oppdateringsdato: Oppdateringsdato,
        //   Datauttaksdato: Datauttaksdato ?? null,
        //   Malemetode: Malemetode ?? null,
        //   Noyaktighet: Noyaktighet ?? null,
        //   Representasjonspunkt: Representasjonspunkt ?? null,
        //   Omrade: Omrade ?? new Geometry(),
        //   Kommunenummer: Kommunenummer ?? "",
        //   Kommunenavn: Kommunenavn ?? "",
        //   Matrikkelnummertekst: Matrikkelnummertekst ?? "",
        //   Teigmedflerematrikkelenheter: Teigmedflerematrikkelenheter ?? false,
        //   Tvist: Tvist ?? false,
        //   Uregistrertjordsameie: Uregistrertjordsameie ?? false,
        //   Avklarteiere: Avklarteiere ?? null,
        //   Lagretberegnetareal: Lagretberegnetareal ?? null,
        //   Arealmerknadtekst: Arealmerknadtekst ?? null,
        //   Noyaktighetsklasseteig: Noyaktighetsklasseteig ?? null,
        //   Uuidteig: Uuidteig ?? "",
        // };
      })
      .addCase(loadLand.rejected, (state, action) => {
        state.landList.pop();
        state.isLoading = false;
        state.isError = true;
        state.status = "failed";
        if (action.payload) {
          state.error.errorMsg = action.payload.message;
          state.error.statusCode = action.payload.statusCode;
        } else {
          state.error.errorMsg = action.error.message;
          state.error.statusCode = 500; // Default to 500 if no status code is available
        }

        // state.error.statusCode = Number(action.error.code);
        // if (action.payload && action.payload.notFound) {
        //   state.notFound = true;
        // } else {
        //   state.error.errorMsg = action.payload || action.error.message;
        // }
      });
  },
});

export const { setselectedLandState, removeSelectedLandLayer } =
  selectedlandSlice.actions;

export default selectedlandSlice.reducer;
