// store/slices/authSlice.ts
import { authService } from '@/services/auth.service';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  registrationSuccess: boolean;
}

// Helper function to load initial state from localStorage
const loadInitialState = (): Partial<AuthState> => {
  if (typeof window === 'undefined') {
    return {};
  }

  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  };
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registrationSuccess: false,
  ...loadInitialState(),
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { firstName: string; lastName: string; email: string; password: string },
    { rejectWithValue }) => {
    try {

      const response = await authService.register(userData);
      if (response.success) {
        const { tokens, user } = response.data.data;

        // Store tokens in localStorage
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        return { tokens, user };
      }
      return rejectWithValue(response.message || 'Registration failed');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        const { tokens, user } = response.data.data;

        // Store tokens in localStorage
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        return { tokens, user };
      }
      return rejectWithValue(response.message || 'Login failed');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await authService.getMe();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user data'
      );
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.registrationSuccess = false;

      // Clear localStorage
      localStorage.clear();
      authService.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
    resetRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { user, tokens } = action.payload;
        state.loading = false;
        state.isAuthenticated = true;
        state.registrationSuccess = true;
        state.user = user;
        state.accessToken = tokens.accessToken;
        state.refreshToken = tokens.refreshToken;

      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        const { tokens, user } = action.payload;
        state.loading = false;
        state.isAuthenticated = true;
        state.user = user;
        state.accessToken = tokens.accessToken;
        state.refreshToken = tokens.refreshToken;

        // Store in localStorage
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        // Set default Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Fetch current user cases
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        // Clear storage on failed user fetch
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });
  },
});



export const { logoutUser, clearError, resetRegistrationSuccess } = authSlice.actions;
export default authSlice.reducer;