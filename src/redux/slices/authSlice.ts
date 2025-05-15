import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userType: string | null;
  academicType: string | null;
  fin_kod: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userType: null,
  academicType: null,
  fin_kod: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<string | null>) => {
      state.userType = action.payload;
    },
    setAcademicType: (state, action: PayloadAction<string | null>) => {
      state.academicType = action.payload;
    },
    setFinKod: (state, action: PayloadAction<string>) => {
      state.fin_kod = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: () => initialState,
    clearLoginSteps: (state) => {
      state.userType = null;
      state.academicType = null;
    },
  },
});

export const { setUserType, setAcademicType, setFinKod, loginSuccess, clearLoginSteps } = authSlice.actions;
export default authSlice.reducer;