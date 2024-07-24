// studentSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../constants/axiosInstance'
import { Intent } from '../../../types/payment';
import axios from 'axios';


export interface PaymentState {
  loading: boolean;
  error: string | null;
  data:string;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  data:""
};

export const makePayment = createAsyncThunk(
  'payment/create-intent',
  async (paymentData:Intent, { rejectWithValue }) => {
    try {
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
      console.log('complete purchase called')
      const response = await axiosInstance.post('/payment/complete-purchase', { sessionId });
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response.data);
    }
  }
);


const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreatePaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreatePaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(CreatePaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; 
      });
  },
});

export default paymentSlice.reducer;
