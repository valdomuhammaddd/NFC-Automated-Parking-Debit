/**
 * MARKIR - Auth Slice (With API Integration)
 * @author Valdo Muhammad
 * @description Redux slice untuk authentication dengan support backend API & mock fallback
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../data/types';
import * as MarkirAPI from '../../data/api/markir-api';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// =====================================================
// Configuration: USE_BACKEND_API
// Set to true when backend is ready, false for mock
// =====================================================
const USE_BACKEND_API = true; // ✅ Backend API activated!

// =====================================================
// ASYNC THUNKS - Login with Email (HYBRID MODE)
// =====================================================
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      if (USE_BACKEND_API) {
        // === BACKEND API MODE ===
        console.log('🌐 [Auth] Using Backend API');
        const response = await MarkirAPI.login(email, password);
        
        if (!response.success) {
          return rejectWithValue(response.message || 'Login gagal');
        }

        // Set auth token for future requests
        MarkirAPI.setAuthToken(response.data.token);

        // Transform API response to app format
        const user: User = {
          id: response.data.user.user_id.toString(),
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone || '',
          role: response.data.user.role as 'admin' | 'user',
          e_wallet_balance: response.data.user.saldo_ewallet,
          balance: response.data.user.saldo_ewallet,
          membership_status: 'ACTIVE',
        };

        return { user, token: response.data.token };
      } else {
        // === MOCK MODE (for development without backend) ===
        console.log('🔧 [Auth] Using Mock Data');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (!mockUser) {
          return rejectWithValue('Email atau password salah');
        }

        // Generate mock token
        const mockToken = `mock_token_${Date.now()}_${mockUser.user.id}`;

        return { user: mockUser.user, token: mockToken };
      }
    } catch (error: any) {
      console.error('❌ [Auth] Login error:', error);
      
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      
      if (error.message.includes('Network Error') || error.code === 'ECONNREFUSED') {
        return rejectWithValue('Tidak dapat terhubung ke server. Gunakan mock data.');
      }
      
      return rejectWithValue('Terjadi kesalahan saat login');
    }
  }
);

// =====================================================
// ASYNC THUNKS - Login with Google
// =====================================================
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      if (USE_BACKEND_API) {
        // TODO: Implement Google OAuth with backend
        return rejectWithValue('Google login belum tersedia dengan backend');
      } else {
        // Mock Google login
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const googleMockUser: User = {
          id: 'GOOGLE001',
          name: 'Google User',
          email: 'google@test.com',
          phone: '081234567899',
          role: 'user',
          e_wallet_balance: 250000,
          balance: 250000,
          membership_status: 'ACTIVE',
        };

        const mockToken = `mock_token_google_${Date.now()}`;
        return { user: googleMockUser, token: mockToken };
      }
    } catch (error: any) {
      console.error('❌ [Auth] Google login error:', error);
      return rejectWithValue('Terjadi kesalahan saat login dengan Google');
    }
  }
);

// =====================================================
// Auth Slice
// =====================================================
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      MarkirAPI.clearAuthToken();
      console.log('👋 [Auth] User logged out');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserBalance: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.balance = action.payload;
        state.user.e_wallet_balance = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Login with Email
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        console.log('✅ [Auth] Login successful:', action.payload.user.name);
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        console.error('❌ [Auth] Login failed:', action.payload);
      });

    // Login with Google
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        console.log('✅ [Auth] Google login successful:', action.payload.user.name);
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

// =====================================================
// Mock User Database (Fallback when backend not ready)
// =====================================================
const MOCK_USERS = [
  // === ADMIN ACCOUNTS ===
  {
    email: 'admin@markir.com',
    password: 'admin123',
    user: {
      id: 'ADM001',
      name: 'Admin MARKIR',
      email: 'admin@markir.com',
      phone: '081234567890',
      role: 'admin' as const,
      e_wallet_balance: 1000000,
      balance: 1000000,
      membership_status: 'ACTIVE' as const,
    }
  },
  {
    email: 'superadmin@markir.com',
    password: 'admin123',
    user: {
      id: 'ADM002',
      name: 'Super Admin',
      email: 'superadmin@markir.com',
      phone: '081234567891',
      role: 'admin' as const,
      e_wallet_balance: 5000000,
      balance: 5000000,
      membership_status: 'ACTIVE' as const,
    }
  },
  
  // === USER ACCOUNTS ===
  {
    email: 'valdo@markir.com',
    password: 'valdo123',
    user: {
      id: 'USR001',
      name: 'Valdo Rinaldi',
      email: 'valdo@markir.com',
      phone: '081234567892',
      role: 'user' as const,
      e_wallet_balance: 500000,
      balance: 500000,
      membership_status: 'ACTIVE' as const,
    }
  },
  {
    email: 'dewi@gmail.com',
    password: 'dewi123',
    user: {
      id: 'USR002',
      name: 'Dewi Sartika',
      email: 'dewi@gmail.com',
      phone: '081234567893',
      role: 'user' as const,
      e_wallet_balance: 450000,
      balance: 450000,
      membership_status: 'ACTIVE' as const,
    }
  },
  {
    email: 'user1@test.com',
    password: 'user123',
    user: {
      id: 'USR003',
      name: 'Test User 1',
      email: 'user1@test.com',
      phone: '081234567894',
      role: 'user' as const,
      e_wallet_balance: 100000,
      balance: 100000,
      membership_status: 'ACTIVE' as const,
    }
  },
  {
    email: 'user2@test.com',
    password: 'user123',
    user: {
      id: 'USR004',
      name: 'Test User 2',
      email: 'user2@test.com',
      phone: '081234567895',
      role: 'user' as const,
      e_wallet_balance: 85000,
      balance: 85000,
      membership_status: 'ACTIVE' as const,
    }
  },
  {
    email: 'user3@test.com',
    password: 'user123',
    user: {
      id: 'USR005',
      name: 'Test User 3',
      email: 'user3@test.com',
      phone: '081234567896',
      role: 'user' as const,
      e_wallet_balance: 75000,
      balance: 75000,
      membership_status: 'ACTIVE' as const,
    }
  },
];

export const { logout, clearError, updateUserBalance } = authSlice.actions;
export default authSlice.reducer;

// =====================================================
// HELPER: Check if using backend API
// =====================================================
export const isUsingBackendAPI = () => USE_BACKEND_API;
