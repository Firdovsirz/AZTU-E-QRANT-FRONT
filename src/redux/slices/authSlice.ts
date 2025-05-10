import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserData {
  fin_kod: string | null;
}

interface AuthState {
  user: UserData;
  token: string | null;
}

const initialState: AuthState = {
  user: {
    fin_kod: typeof window !== "undefined" ? localStorage.getItem("fin_kod") : null,
  },
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        fin_kod: string;
        token: string;
      }>
    ) => {
      state.user.fin_kod = action.payload.fin_kod;
      state.token = action.payload.token;

      if (typeof window !== "undefined") {
        localStorage.setItem("fin_kod", action.payload.fin_kod ?? "");
        localStorage.setItem("token", action.payload.token ?? "");
      }
    },
    logout: (state) => {
      state.user = {
        fin_kod: null,
      };
      state.token = null;

      if (typeof window !== "undefined") {
        [
          "fin_kod"
        ].forEach((key) => localStorage.removeItem(key));
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;