/**
 * Transaction Slice - Parkee-style Redux State
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, ParkingLocation, Notification, Promotion, Voucher, Subscription } from '../../data/types';

interface ParkeeTransactionState {
  transactions: Transaction[];
  parkingLocations: ParkingLocation[];
  activeParking: Transaction | null;
  notifications: Notification[];
  unreadCount: number;
  promotions: Promotion[];
  vouchers: Voucher[];
  subscriptions: Subscription[];
  activeSubscription: Subscription | null;
  loading: boolean;
  error: string | null;
}

const initialState: ParkeeTransactionState = {
  transactions: [],
  parkingLocations: [],
  activeParking: null,
  notifications: [],
  unreadCount: 0,
  promotions: [],
  vouchers: [],
  subscriptions: [],
  activeSubscription: null,
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    setParkingLocations: (state, action: PayloadAction<ParkingLocation[]>) => {
      state.parkingLocations = action.payload;
    },
    setActiveParking: (state, action: PayloadAction<Transaction | null>) => {
      state.activeParking = action.payload;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    setPromotions: (state, action: PayloadAction<Promotion[]>) => {
      state.promotions = action.payload;
    },
    setVouchers: (state, action: PayloadAction<Voucher[]>) => {
      state.vouchers = action.payload;
    },
    addVoucher: (state, action: PayloadAction<Voucher>) => {
      state.vouchers.push(action.payload);
    },
    setSubscriptions: (state, action: PayloadAction<Subscription[]>) => {
      state.subscriptions = action.payload;
    },
    setActiveSubscription: (state, action: PayloadAction<Subscription | null>) => {
      state.activeSubscription = action.payload;
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
  setTransactions,
  addTransaction,
  setParkingLocations,
  setActiveParking,
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setPromotions,
  setVouchers,
  addVoucher,
  setSubscriptions,
  setActiveSubscription,
  setLoading,
  setError,
} = transactionSlice.actions;
export default transactionSlice.reducer;
