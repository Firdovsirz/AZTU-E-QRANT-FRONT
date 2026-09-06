import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userType: number | null;
  // academicType: number | null;
  fin_kod: string | null;
  projectRole: number | null;
  token: string | null;
  isAuthenticated: boolean;
  projectCode: number | null;
  profileCompleted: number | null;
  showLoginToast: boolean;
  isCollaborator: boolean | null;
  /** An expert signs in with a one-time password and must replace it first. */
  mustChangePassword: boolean;
}

const initialState: AuthState = {
  userType: null,
  // academicType: null,
  fin_kod: null,
  projectRole: null,
  token: null,
  isAuthenticated: false,
  projectCode: null,
  profileCompleted: null,
  showLoginToast: false,
  isCollaborator: null,
  mustChangePassword: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<number | null>) => {
      state.userType = action.payload;
    },
    // setAcademicType: (state, action: PayloadAction<number | null>) => {
    //   state.academicType = action.payload;
    // },
    setFinKod: (state, action: PayloadAction<string>) => {
      state.fin_kod = action.payload;
    },
    setGlobalProjectCode: (state, action: PayloadAction<number>) => {
      state.projectCode = action.payload;
    },
    setGlobalProfilCompleted: (state, action: PayloadAction<number>) => {
      state.profileCompleted = action.payload;
    },
    setGlobalIsCollaborator: (state, action: PayloadAction<boolean>) => {
      state.isCollaborator = action.payload;
    },
    setMustChangePassword: (state, action: PayloadAction<boolean>) => {
      state.mustChangePassword = action.payload;
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
        is_collaborator: boolean;
        projectCode: number;
        profileCompleted: number;
        mustChangePassword?: boolean;
      }>
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // state.academicType = action.payload.user.academic_role;
      state.fin_kod = action.payload.user.fin_kod;
      state.projectRole = action.payload.user.project_role;
      state.userType = action.payload.user.user_type;
      state.projectCode = action.payload.projectCode;
      state.profileCompleted = action.payload.profileCompleted;
      state.showLoginToast = true;
      state.isCollaborator = action.payload.is_collaborator;
      state.mustChangePassword = !!action.payload.mustChangePassword;
    },
    clearLoginToast: (state) => {
      state.showLoginToast = false;
    },
    logout: () => initialState,
    clearLoginSteps: (state) => {
      state.userType = null;
      state.showLoginToast = false;
      state.isCollaborator = false
      // state.academicType = null;
    },
  },
});

export const {
  setUserType,
  // setAcademicType,
  setFinKod,
  loginSuccess,
  clearLoginSteps,
  logout,
  clearLoginToast,
  setGlobalProjectCode,
  setGlobalProfilCompleted,
  setGlobalIsCollaborator,
  setMustChangePassword
} = authSlice.actions;
export default authSlice.reducer;