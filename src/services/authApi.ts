import axios, { AxiosError } from "axios";
import { LoginFormInputs, LoginResponse, LogoutRequest } from "../lib/types";
import authApiClient from "./authApiClient";
import { getIpAddress } from "../lib/helpFunction";

const authApi = {
  logIn: async (credentials: LoginFormInputs) => {
    let ipAddress: string | null;
    ipAddress = await getIpAddress();

    try {
      return await authApiClient.post<LoginResponse>("/auth/login", {
        Username: credentials.username,
        Password: credentials.password,
        IpAddress: ipAddress,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        throw axiosError;
        // throw new Error(error.response?.data?.Message || "Login failed");
      } else {
        //throw error;
        throw new Error("An unexpected error occurred");
      }
    }
  },

  logOut: async (logoutReq: LogoutRequest) => {
    try {
      return await authApiClient.post<void>("/auth/logout", logoutReq);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        throw axiosError;
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  },
};

export default authApi;
