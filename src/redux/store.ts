import authReducer from "./slices/authSlice";
import { configureStore } from "@reduxjs/toolkit";

// interface AuthSlice {
//     token: string | null;
//     username: string | null;
//     role: string | null;
// }

// export interface RootState {
//     auth: AuthSlice;
// }

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;