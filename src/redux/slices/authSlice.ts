import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userType: number | null;
  academicType: number | null;
  fin_kod: string | null;
  projectRole: number | null;
  token: string | null;
  isAuthenticated: boolean;
  projectCode: Number | null;
  profileCompleted: Number | null;
}

const initialState: AuthState = {
  userType: null,
  academicType: null,
  fin_kod: null,
  projectRole: null,
  token: null,
  isAuthenticated: false,
  projectCode: null,
  profileCompleted: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<number | null>) => {
      state.userType = action.payload;
    },
    setAcademicType: (state, action: PayloadAction<number | null>) => {
      state.academicType = action.payload;
    },
    setFinKod: (state, action: PayloadAction<string>) => {
      state.fin_kod = action.payload;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        user: {
          academic_role: number;
          fin_kod: string;
          project_role: number;
          user_type: number;
        };
        projectCode: number;
        profileCompleted: number;
      }>
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.academicType = action.payload.user.academic_role;
      state.fin_kod = action.payload.user.fin_kod;
      state.projectRole = action.payload.user.project_role;
      state.userType = action.payload.user.user_type;
      state.projectCode = action.payload.projectCode;
      state.profileCompleted = action.payload.profileCompleted;
    },
    logout: () => initialState,
    clearLoginSteps: (state) => {
      state.userType = null;
      state.academicType = null;
    },
  },
});

export const {
  setUserType,
  setAcademicType,
  setFinKod,
  loginSuccess,
  clearLoginSteps,
} = authSlice.actions;
export default authSlice.reducer;