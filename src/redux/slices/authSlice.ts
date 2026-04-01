/**
 * MARKIR - Auth Slice
 * @author Valdo Muhammad
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../data/types';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Mock User Database for Testing (Sebelum Connect ke Real Database)
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
      e_wallet_balance: 0,
      balance: 0,
      membership_status: 'ACTIVE' as const,
    }
  },
  {
    email: 'superadmin@markir.com',
    password: 'super123',
    user: {
      id: 'ADM002',
      name: 'Super Admin',
      email: 'superadmin@markir.com',
      phone: '081234567891',
      role: 'admin' as const,
      e_wallet_balance: 0,
      balance: 0,
      membership_status: 'ACTIVE' as const,
    }
  },
  
  // === USER ACCOUNTS - DEVELOPER ===
  {
    email: 'valdo@markir.com',
    password: 'valdo123',
    user: {
      id: 'USR001',
      name: 'Valdo Muhammad',
      email: 'valdo@markir.com',
      phone: '081234567890',
      role: 'user' as const,
      e_wallet_balance: 500000,
      balance: 500000,
      membership_status: 'ACTIVE' as const,
    }
  },
  
  // === USER ACCOUNTS - TESTING ===
  {
    email: 'user1@test.com',
    password: 'user123',
    user: {
      id: 'USR002',
      name: 'User Test 1',
      email: 'user1@test.com',
      phone: '081111111111',
      role: 'user' as const,
      e_wallet_balance: 100000,
      balance: 100000,
      membership_status: 'INACTIVE' as const,
    }
  },
  {
    email: 'user2@test.com',
    password: 'user123',
    user: {
      id: 'USR003',
      name: 'User Test 2',
      email: 'user2@test.com',
      phone: '081222222222',
      role: 'user' as const,
      e_wallet_balance: 250000,
      balance: 250000,
      membership_status: 'INACTIVE' as const,
    }
  },
  {
    email: 'user3@test.com',
    password: 'user123',
    user: {
      id: 'USR004',
      name: 'User Test 3',
      email: 'user3@test.com',
      phone: '081333333333',
      role: 'user' as const,
      e_wallet_balance: 75000,
      balance: 75000,
      membership_status: 'INACTIVE' as const,
    }
  },
  
  // === USER ACCOUNTS - REALISTIC NAMES ===
  {
    email: 'budi@gmail.com',
    password: 'budi123',
    user: {
      id: 'USR005',
      name: 'Budi Santoso',
      email: 'budi@gmail.com',
      phone: '081444444444',
      role: 'user' as const,
      e_wallet_balance: 150000,
      balance: 150000,
      membership_status: 'ACTIVE' as const,
    }
  },
  {
    email: 'siti@gmail.com',
    password: 'siti123',
    user: {
      id: 'USR006',
      name: 'Siti Nurhaliza',
      email: 'siti@gmail.com',
      phone: '081555555555',
      role: 'user' as const,
      e_wallet_balance: 300000,
      balance: 300000,
      membership_status: 'INACTIVE' as const,
    }
  },
  {
    email: 'andi@gmail.com',
    password: 'andi123',
    user: {
      id: 'USR007',
      name: 'Andi Wijaya',
      email: 'andi@gmail.com',
      phone: '081666666666',
      role: 'user' as const,
      e_wallet_balance: 200000,
      balance: 200000,
      membership_status: 'ACTIVE' as const,
    }
  },
  {
    email: 'dewi@gmail.com',
    password: 'dewi123',
    user: {
      id: 'USR008',
      name: 'Dewi Lestari',
      email: 'dewi@gmail.com',
      phone: '081777777777',
      role: 'user' as const,
      e_wallet_balance: 450000,
      balance: 450000,
      membership_status: 'ACTIVE' as const,
    }
  },
  {
    email: 'rudi@gmail.com',
    password: 'rudi123',
    user: {
      id: 'USR009',
      name: 'Rudi Hermawan',
      email: 'rudi@gmail.com',
      phone: '081888888888',
      role: 'user' as const,
      e_wallet_balance: 50000,
      balance: 50000,
      membership_status: 'INACTIVE' as const,
    }
  },
  {
    email: 'maya@gmail.com',
    password: 'maya123',
    user: {
      id: 'USR010',
      name: 'Maya Safitri',
      email: 'maya@gmail.com',
      phone: '081999999999',
      role: 'user' as const,
      e_wallet_balance: 350000,
      balance: 350000,
      membership_status: 'ACTIVE' as const,
    }
  },
  {
    email: 'agus@gmail.com',
    password: 'agus123',
    user: {
      id: 'USR011',
      name: 'Agus Salim',
      email: 'agus@gmail.com',
      phone: '082111111111',
      role: 'user' as const,
      e_wallet_balance: 125000,
      balance: 125000,
      membership_status: 'INACTIVE' as const,
    }
  },
  {
    email: 'rina@gmail.com',
    password: 'rina123',
    user: {
      id: 'USR012',
      name: 'Rina Wulandari',
      email: 'rina@gmail.com',
      phone: '082222222222',
      role: 'user' as const,
      e_wallet_balance: 275000,
      balance: 275000,
      membership_status: 'ACTIVE' as const,
    }
  },
];

// Async thunk for Email/Password login (Admin & User Manual)
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Search for user in mock database
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        return {
          user: foundUser.user,
          token: `mock-token-${foundUser.user.role}-${Date.now()}`,
        };
      }
      
      // If credentials don't match any user, reject
      throw new Error('Email atau password salah!');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for Google login (User Auto-Register)
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      // Mock Google OAuth delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate random user (simulate Google OAuth response)
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const mockGoogleUser = {
        user: {
          id: `USER${randomId}`,
          name: `User ${randomId}`,
          email: `user${randomId}@gmail.com`,
          phone: '',
          role: 'user' as const,
          e_wallet_balance: 50000,
          balance: 50000,
          membership_status: 'INACTIVE' as const,
        },
        token: 'mock-google-token-' + Date.now(),
      };
      
      return mockGoogleUser;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Email/Password Login (Admin)
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
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Google Login (User)
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
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { login, logout, updateProfile, clearError } = authSlice.actions;
export default authSlice.reducer;
