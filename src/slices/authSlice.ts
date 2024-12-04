import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { login, logout } from "../thunk/authThunk";
import { LoginResponse } from "../lib/types";
import { QueryClient } from "@tanstack/react-query";
// import { persistStore } from "redux-persist";
// import store from "../app/store";

interface AuthState {
  isAuthenticated: boolean;
  isRefreshed: boolean;
  isLoading: boolean;
  user: {
    UserId: number;
    IsAdmin: boolean;
    DisplayName: string | null;
  };
  token: {
    accessToken: string;
    refreshToken: string;
  };
  isError: boolean;
  error: {
    errorMsg: string | null | undefined;
    statusCode: number | null | undefined;
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  isRefreshed: false,
  isLoading: false,
  user: {
    UserId: 0,
    IsAdmin: false,
    DisplayName: "",
  },
  token: {
    accessToken: "",
    refreshToken: "",
  },
  isError: false,
  error: {
    errorMsg: null,
    statusCode: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.isAuthenticated = false;
      state.isRefreshed = false;
      state.isLoading = false;
      state.isError = false;

      state.user = {
        UserId: 0,
        IsAdmin: false,
        DisplayName: "",
      };
      state.token = {
        accessToken: "",
        refreshToken: "",
      };
      state.isError = false;
      state.error = {
        errorMsg: null,
        statusCode: null,
      };
    },
    setAuthState: (state, action: PayloadAction<LoginResponse>) => {
      const { UserId, IsAdmin, DisplayName, Token, RefreshToken } =
        action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isError = false;
      state.user = {
        UserId: UserId,
        IsAdmin: IsAdmin,
        DisplayName: DisplayName,
      };
      state.token = {
        accessToken: Token,
        refreshToken: RefreshToken,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = {
          statusCode: null,
          errorMsg: null,
        };
        state.isAuthenticated = false;
        state.isRefreshed = false;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          const { UserId, IsAdmin, DisplayName, Token, RefreshToken } =
            action.payload;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.isError = false;
          state.user = {
            UserId: UserId,
            IsAdmin: IsAdmin,
            DisplayName: DisplayName,
          };
          state.token = {
            accessToken: Token,
            refreshToken: RefreshToken,
          };
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        if (action.payload) {
          state.error.errorMsg = action.payload.message;
          state.error.statusCode = action.payload.statusCode;
        } else {
          state.error.errorMsg = action.error.message;
          state.error.statusCode = 500;
        }
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = {
          statusCode: null,
          errorMsg: null,
        };
      })
      .addCase(logout.fulfilled, (state) => {
        console.log(state);
        //following no need since reset combine all state in root reducer while log out
        // state.isAuthenticated = false;
        // state.isRefreshed = false;
        // state.isLoading = false;
        // state.isError = false;

        // state.user = {
        //   UserId: 0,
        //   IsAdmin: false,
        //   DisplayName: "",
        // };

        // state.token = {
        //   accessToken: "",
        //   refreshToken: "",
        // };

        const queryClient = new QueryClient();
        queryClient.removeQueries({ queryKey: ["getUserUnits"], exact: true }); /////////////////////
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        if (action.payload) {
          state.error.errorMsg = action.payload.message;
          state.error.statusCode = action.payload.statusCode;
        } else {
          state.error.errorMsg = action.error.message;
          state.error.statusCode = 500; // Default to 500 if no status code is available
        }
      });
  },
});

export const { clearAuthState, setAuthState } = authSlice.actions;

export default authSlice.reducer;
