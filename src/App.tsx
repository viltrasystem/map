import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkModeProvider } from "./context/DarkModeContext";
import { TranslationProvider } from "./context/TranslationContext";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import LoginForm from "./features/authentication/LoginForm";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./ui/ProtectedRoute";
import AppLayout from "./pages/AppLayout";
import Dashboard from "./pages/Dashboard";

import store, { persistor } from "./app/store";
import { Provider } from "react-redux";
import LandDetailMapping from "./features/authentication/LandDetailMapping";
import LandOwnerMapping from "./features/authentication/LandOwnerMapping";
import { PersistGate } from "redux-persist/integration/react";
import LandSelector from "./features/land/LandSelector";
import TestLand from "./features/land/TestLand";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandSelectedMapping from "./features/authentication/LandSelectedMapping";
import OwnerMapping from "./features/authentication/OwnerMapping";
import Mapper from "./features/land/Mapper";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000, // is basically time data in cache stay, 0 means no cashing
    },
  },
});

function App() {
  return (
    <DarkModeProvider>
      <TranslationProvider>
        <QueryClientProvider client={queryClient}>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <Provider store={store}>
            <Router>
              <PersistGate loading={null} persistor={persistor}>
                <Routes>
                  <Route
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="land" element={<Mapper />} />
                    <Route path="landowner" element={<Mapper />} />
                    <Route path="land_selector" element={<LandSelector />} />
                  </Route>
                  <Route index element={<Navigate replace to="login" />} />
                  <Route path="login" element={<LoginForm />} />
                  <Route
                    path="land/:unitId/:currentUserId"
                    element={<LandDetailMapping />}
                  />
                  <Route
                    path="landowner/:unitId/:currentUserId"
                    element={<LandOwnerMapping />}
                  />
                  <Route
                    path="land_mapping/:rootId?/:unitId?/:currentUserId?/:landId?/:municipality?/:mainNo?/:subNo?"
                    element={<LandSelectedMapping />}
                  />
                  <Route
                    path="owner_mapping/:rootId?/:unitId?/:currentUserId?"
                    element={<OwnerMapping />} // owner own all land need to be loaded to mapwrapper *** neeed to impelement
                  />
                  <Route path="testland" element={<TestLand />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </PersistGate>
            </Router>
          </Provider>
          <ToastContainer />
          {/* <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
                backgroundColor: "var(--color-grey-0)",
                color: "var(--color-grey-700)",
              },
            }}
          /> */}
        </QueryClientProvider>
      </TranslationProvider>
    </DarkModeProvider>
  );
}

export default App;
///:rootId?/:unitId?/:municipality?/:mainNo?/:subNo?"
