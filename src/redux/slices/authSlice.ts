import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userType: null,
  academicType: null,
  fin_kod: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setAcademicType: (state, action) => {
      state.academicType = action.payload;
    },
    setFinKod: (state, action) => {
      state.fin_kod = action.payload;
    },
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: () => initialState,
    clearLoginSteps: (state) => {
      state.userType = null;
      state.academicType = null;
      state.fin_kod = null;
    },
  },
});

export const {
  setUserType,
  setAcademicType,
  setFinKod,
  loginSuccess,
  logout,
  clearLoginSteps,
} = authSlice.actions;

export default authSlice.reducer;