import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080/geoserver/base/ows?",
});

export const baseLayerApi = createApi({
  baseQuery,
  endpoints: (builder) => ({
    getBaseLayer: builder.query({
      query: (typeName) =>
        `service=WFS&version=1.0.0&request=GetFeature&typeName=${typeName}&outputFormat=application/json`,
    }),
  }),
});

export const { useGetBaseLayerQuery } = baseLayerApi;
