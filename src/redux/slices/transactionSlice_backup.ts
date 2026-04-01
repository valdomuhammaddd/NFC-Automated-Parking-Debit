/**
 * Transaction Slice - Redux Toolkit
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TransactionState } from '../../data/types';
import { mockTagCheck, mockRegisterMotor } from '../../data/api/mockApi';

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
  lastTransaction: null,
};

export const checkTag = createAsyncThunk(
  'transaction/checkTag',
  async (nfcTagId: string) => {
    const response = await mockTagCheck(nfcTagId);
    return response;
  }
);

export const registerMotor = createAsyncThunk(
  'transaction/registerMotor',
  async (data: {
    nfc_tag_id: string;
    plate_number: string;
    brand: string;
    model?: string;
    color?: string;
    owner_name: string;
  }) => {
    const response = await mockRegisterMotor(data);
    return response;
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
    clearLastTransaction: (state) => {
      state.lastTransaction = null;
    },
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkTag.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastTransaction = action.payload;
        state.transactions.unshift(action.payload);
      })
      .addCase(checkTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to check tag';
      })
      .addCase(registerMotor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerMotor.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerMotor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to register motor';
      });
  },
});

export const { clearTransactionError, clearLastTransaction, addTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
