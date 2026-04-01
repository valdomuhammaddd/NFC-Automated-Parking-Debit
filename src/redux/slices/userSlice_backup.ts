/**
 * User Slice - Redux Toolkit
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserState } from '../../data/types';
import { mockGetProfile, mockTopUp, mockGetUserMotorcycles } from '../../data/api/mockApi';

const initialState: UserState = {
  profile: null,
  motorcycles: [],
  isLoading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string) => {
    const response = await mockGetProfile(userId);
    return response;
  }
);

export const fetchUserMotorcycles = createAsyncThunk(
  'user/fetchMotorcycles',
  async (userId: string) => {
    const response = await mockGetUserMotorcycles(userId);
    return response;
  }
);

export const topUpWallet = createAsyncThunk(
  'user/topUp',
  async (data: { user_id: string; amount: number; provider: 'GOPAY' | 'DANA' | 'LINKAJA' }) => {
    const response = await mockTopUp(data);
    return response;
  }
);

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Vehicle, PaymentMethod } from '../../data/types';

interface UserState {
  currentUser: User | null;
  users: User[];
  balance: number;
  vehicles: Vehicle[];
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  users: [],
  balance: 0,
  vehicles: [],
  paymentMethods: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      if (action.payload) {
        state.balance = action.payload.balance || 0;
      }
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.currentUser?.id === action.payload.id) {
        state.currentUser = action.payload;
      }
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
      if (state.currentUser) {
        state.currentUser.balance = action.payload;
      }
    },
    addBalance: (state, action: PayloadAction<number>) => {
      state.balance += action.payload;
      if (state.currentUser) {
        state.currentUser.balance = state.balance;
      }
    },
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
    },
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.vehicles.push(action.payload);
    },
    updateVehicle: (state, action: PayloadAction<Vehicle>) => {
      const index = state.vehicles.findIndex((v) => v.id === action.payload.id);
      if (index !== -1) {
        state.vehicles[index] = action.payload;
      }
    },
    removeVehicle: (state, action: PayloadAction<string>) => {
      state.vehicles = state.vehicles.filter((v) => v.id !== action.payload);
    },
    setPaymentMethods: (state, action: PayloadAction<PaymentMethod[]>) => {
      state.paymentMethods = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentUser,
  setUsers,
  updateUser,
  updateBalance,
  addBalance,
  setVehicles,
  addVehicle,
  updateVehicle,
  removeVehicle,
  setPaymentMethods,
  setLoading,
  setError,
} = userSlice.actions;
export default userSlice.reducer;

export const { clearUserError, updateBalance } = userSlice.actions;
export default userSlice.reducer;
