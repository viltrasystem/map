import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { userUnitApi } from "../services/userUnitApi";
import { treeApi } from "../services/treeApi";
import { refreshApi } from "../services/refreshApi";
import { landSelectorApi } from "../services/landSelectorApi";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import baseMapApi, { mapApi, wfsApi } from "../services/mapsApi";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "userUnit", "tree"], // Only persist  state
  // whitelist: ['auth', 'userUnit', 'tree'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      userUnitApi.middleware,
      treeApi.middleware,
      refreshApi.middleware,
      landSelectorApi.middleware,
      baseMapApi.middleware,
      mapApi.middleware,
      wfsApi.middleware
    ), // Add the RTK-Query middleware
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import usersReducer from "./slices/usersSlice";
// import thunkMiddleware from "redux-thunk";

// const store = configureStore({
//   reducer: {
//     users: usersReducer,
//   },
//   middleware: [thunkMiddleware],
// });

// export default store;
