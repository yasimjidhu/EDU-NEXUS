// studentSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../constants/axiosInstance'
import { Intent } from '../../../types/payment';
import axios from 'axios';


export interface PaymentState {
  loading: boolean;
  error: string | null;
  data:string;
  transactions:any[];
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  data:"",
  transactions:[]
};

export const makePayment = createAsyncThunk(
  'payment/create-intent',
  async (paymentData:Intent, { rejectWithValue }) => {
    try {
      console.log('make payment called',paymentData)
      const response = await axiosInstance.post('/payment/create-checkout-session', paymentData);
      return { data: response.data };
    } catch (error:any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
)

export const completePurchase = createAsyncThunk(
  'payment/completePurchase',
  async ({ sessionId }: { sessionId: string }, { rejectWithValue }) => {
    try {
      console.log('complete purchase called',sessionId)
      const response = await axiosInstance.post('/payment/complete-purchase', { sessionId });
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getTransactions = createAsyncThunk(
  'payment/getTransactions',
  async (filter: Record<string, any>, { rejectWithValue }) => {
    try {
      console.log('get transactions reached in slice',filter)
      const response = await axiosInstance.get('/payment/find-transactions', { params: filter });
      console.log('response of get transactions',response.data)
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
)


const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(makePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(makePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(completePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completePurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(completePurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default paymentSlice.reducer;
