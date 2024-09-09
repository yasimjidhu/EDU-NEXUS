// studentSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../constants/axiosInstance'
import { Intent } from '../../../types/payment';
import axios from 'axios';


export interface PaymentState {
  loading: boolean;
  error: string | null;
  data:string;
  transactions:any[];
  profit:number;
  onboardingCompleted:boolean
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  data:"",
  transactions:[],
  profit:0,
  onboardingCompleted:false
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

export const createAccountLink = createAsyncThunk(
  'payment/createAccountLink',
  async ({instructorId,email}:{instructorId:string,email:string}, { rejectWithValue }) => {
    try {
      console.log('create account link called in slice')
      const response = await axiosInstance.post('/payment/create-account-link',{instructorId,email});
      return response.data
    } catch (error:any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
)

export const completeOnboarding = createAsyncThunk(
  'payment/completeOnboarding',
  async (accountId:string, { rejectWithValue }) => {
    try {
      console.log('complete onboarind link called in slice')
      const response = await axiosInstance.get(`/payment/complete-onboarding/${accountId}`);
      console.log('response of complete onboarding',response.data)
      return response.data
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

export const getInstructorCoursesTransaction = createAsyncThunk(
  'payment/getInstructorCoursesTransaction',
  async (instructorId:string, { rejectWithValue }) => {
    try {
      console.log('getinstructor payment called in slice',instructorId)
      const response = await axiosInstance.get(`/payment/find-transactions/${instructorId}`);
      console.log('instructor payment data',response.data)
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
  reducers: {
    setOnboardingCompleted(state, action: PayloadAction<boolean>) {
      state.onboardingCompleted = action.payload;
    },
  },
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
      })
      .addCase(getInstructorCoursesTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInstructorCoursesTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const profit = action.payload.reduce((sum:number,payment:any)=>sum + payment.instructorAmount / 100,0)
        state.profit = profit
      })
      .addCase(getInstructorCoursesTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
  },
});

export const {setOnboardingCompleted} = paymentSlice.actions
export default paymentSlice.reducer;
