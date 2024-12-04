import axios from "axios";

const authApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : import.meta.env.MODE === "production"
    ? "https://test.viltrapporten.no/api/v1"
    : "https://localhost:7144/api/v1", // Backend API URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default authApiClient;

// import axios from "axios";

// const authApiClient = axios.create({
//   baseURL:
//     import.meta.env.VITE_API_URL ||
//     (import.meta.env.MODE === "production"
//       ? "https://test.viltrapporten.no"
//       : "https://localhost:7144/api/v1"), // Backend API URL
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default authApiClient;
