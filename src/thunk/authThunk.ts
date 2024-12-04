import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ApiResponse,
  ErrorState,
  LoginFormInputs,
  LoginResponse,
  LogoutRequest,
} from "../lib/types";
import authApiService from "../services/authApi";
import axios from "axios";

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

export const login = createAsyncThunk<
  LoginResponse,
  LoginFormInputs,
  { rejectValue: ErrorState }
>(LOGIN, async (credentials: LoginFormInputs, { rejectWithValue }) => {
  try {
    const response = await authApiService.logIn(credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiResponse;
      return rejectWithValue({
        message: apiError?.Message || error.message,
        statusCode: apiError?.StatusCode || 500,
      });
    } else if (error instanceof Error) {
      return rejectWithValue({
        message: error.message,
        statusCode: 500,
      });
    } else {
      return rejectWithValue({
        message: "An unexpected error occurred",
        statusCode: 500,
      });
    }
  }
});

export const logout = createAsyncThunk<
  void,
  LogoutRequest,
  { rejectValue: ErrorState }
>(LOGOUT, async (logoutReq: LogoutRequest, { rejectWithValue }) => {
  try {
    const response = await authApiService.logOut(logoutReq);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiResponse;
      return rejectWithValue({
        message: apiError?.Message || error.message,
        statusCode: apiError?.StatusCode || 500,
      });
    } else if (error instanceof Error) {
      return rejectWithValue({
        message: error.message,
        statusCode: 500,
      });
    } else {
      return rejectWithValue({
        message: "An unexpected error occurred",
        statusCode: 500,
      });
    }
  }
});
