import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  accessToken: string | null;
  status: AuthStatus;
  isInitialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  status: 'idle',
  isInitialized: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
      state.error = null;
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
      state.status = 'unauthenticated';
      state.error = null;
    },
    setAuthStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.status = action.payload;
    },
    setAuthInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = 'unauthenticated';
    },
    resetAuth: (state) => {
      state.accessToken = null;
      state.status = 'unauthenticated';
      state.isInitialized = true;
      state.error = null;
    },
  },
});

export const {
  setAccessToken,
  clearAccessToken,
  setAuthStatus,
  setAuthInitialized,
  setAuthError,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;
