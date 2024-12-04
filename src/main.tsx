import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import FullPage from "./ui/FullPage";
import Spinner from "./ui/Spinner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Suspense
    fallback={
      <FullPage>
        <Spinner />
      </FullPage>
    }
  >
    <App />
  </Suspense>
);
