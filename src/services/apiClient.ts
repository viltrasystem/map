import axios from "axios";
import store, { RootState } from "../app/store";

// Create a custom Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : import.meta.env.MODE === "production"
    ? "https://test.viltrapporten.no/api/v1"
    : "https://localhost:7144/api/v1", // Backend API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the Authorization header dynamically
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState() as RootState;
    const token = state.auth.token.accessToken;
    if (token) {
      config.headers?.set("Authorization", `Bearer ${token}`);
      //   config.headers = {
      //     ...config.headers,
      //     Authorization: `Bearer ${token}`, // Set the Authorization header
      //   };
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common response scenarios
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // // You can handle errors like token expiration, unauthorized access, etc., here
    // if (error.response?.status === 401) {
    //   console.error("Unauthorized! Redirecting to login.");
    //   // Optionally trigger a logout or redirect to login
    //   // store.dispatch(logoutAction());
    // }
    return Promise.reject(error);
  }
);

export default apiClient;

//  resIp.data.Ip
// console.log("API URL:", API_URL);
//   console.log("Mode:", import.meta.env.MODE);
//   console.log(import.meta.env);
