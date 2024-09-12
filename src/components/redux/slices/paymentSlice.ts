// studentSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../constants/axiosInstance'
import { Intent } from '../../../types/payment';
import axios from 'axios';


export interface PaymentState {
  loading: boolean;
  error: string | null;
  data: string;
  transactions: any[];
  profit: number;
  onboardingCompleted: boolean
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  data: "",
  transactions: [],
  profit: 0,
  onboardingCompleted: false
};

export const makePayment = createAsyncThunk(
  'payment/create-intent',
  async (paymentData: Intent, { rejectWithValue }) => {
    try {
      console.log('make payment called', paymentData)
      const response = await axiosInstance.post('/payment/create-checkout-session', paymentData);
      return { data: response.data };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
)

export const createAccountLink = createAsyncThunk(
  'payment/createAccountLink',
  async ({ instructorId, email }: { instructorId: string, email: string }, { rejectWithValue }) => {
    try {
      console.log('create account link called in slice')
      const response = await axiosInstance.post('/payment/create-account-link', { instructorId, email });
      return response.data
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
)

export const completeOnboarding = createAsyncThunk(
  'payment/completeOnboarding',
  async (accountId: string, { rejectWithValue }) => {
    try {
      console.log('complete onboarind link called in slice')
      const response = await axiosInstance.get(`/payment/complete-onboarding/${accountId}`);
      console.log('response of complete onboarding', response.data)
      return response.data
    } catch (error: any) {
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
      console.log('complete purchase called', sessionId)
      const response = await axiosInstance.post('/payment/complete-purchase', { sessionId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getTransactions = createAsyncThunk(
  'payment/getTransactions',
  async (filter: Record<string, any>, { rejectWithValue }) => {
    try {
      console.log('get transactions reached in slice', filter)
      const response = await axiosInstance.get('/payment/find-transactions', { params: filter });
      console.log('response of get transactions', response.data)
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
  async ({ instructorId, page, limit }: { instructorId: string; page: number; limit: number }, { rejectWithValue }) => {
    try {
      console.log('get instructor payment called in slice', instructorId, page, limit);

      // Fetch transactions with pagination
      const response = await axiosInstance.get(`/payment/find-transactions/${instructorId}`, {
        params: { page, limit }
      });
      console.log('response data ofr', response.data)
      const { transactions, totalTransactions } = response.data;

      // Calculate total pages based on total transactions and limit
      const totalPages = Math.ceil(totalTransactions / limit);

      console.log('instructor payment data', transactions, totalPages, totalTransactions);

      return {
        transactions,
        currentPage: page,
        totalPages,
        totalTransactions
      };

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const getInstructorAvailablePayouts = createAsyncThunk(
  'payment/getInstructorAvailablePayouts',
  async (instructorId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/payment/payouts/available-payouts/${instructorId}`);
      console.log('available payoures response', response.data)
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);


export const getInstructorsTodaysRevenue = createAsyncThunk(
  'payment/getInstructorsTodaysRevenue',
  async (instructorId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/payment/todays-revenue/${instructorId}`);
      console.log('get instructors revenues data', response.data)
      return response.data.revenue
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
)

export const getTodaysAdminRevenue = createAsyncThunk(
  'payment/getTodaysAdminRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/payment/todays-revenue`);
      console.log('get admin revenues data', response.data)
      return response.data.revenue
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
)

export const getInstructorsTotalEarnings = createAsyncThunk(
  'payment/getInstructorsTotalEarnings',
  async (instructorId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/payment/total-earnings/${instructorId}`);
      console.log('get instructors total earnings data', response.data)
      return response.data.totalEarnings
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
)

export const getAdminTotalEarnings = createAsyncThunk(
  'payment/getAdminTotalEarnings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/payment/total-earnings`);
      console.log('get admin total earnings data', response.data)
      return response.data.totalEarnings
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
)

// payout thunks
export const getRecentPayouts = createAsyncThunk(
  'payment/getRecentPayouts',
  async (_, { rejectWithValue }) => {
    try {
      console.log('get recent  payment called in slice')
      const response = await axiosInstance.get(`/payment/payouts`);
      console.log('recent  payouts data', response.data)
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
)


export const getAdminAvailablePayouts = createAsyncThunk(
  'payment/getAdminAvailablePayouts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/payment/payouts/available-payouts`);
      console.log('available payoures for admin response', response.data)
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const requestInstructorPayout = createAsyncThunk(
  'payment/requestInstructorPayout',
  async ({ paymentId, accountId, amount, currency, email }: { paymentId: string, accountId: string, amount: number, currency: string, email: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/payment/payouts/instructor', {
        paymentId,
        accountId,
        amount,
        currency,
        email
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const requestAdminPayout = createAsyncThunk(
  'payment/requestAdminPayout',
  async ({ paymentId, accountId, amount, currency }: { paymentId: string, accountId: string, amount: number, currency: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/payment/payouts/admin', {
        paymentId,
        accountId,
        amount,
        currency,
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);



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
        const profit = action.payload.transactions.reduce((sum: number, payment: any) => sum + payment.instructorAmount / 100, 0)
        state.profit = profit
      })
      .addCase(getInstructorCoursesTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  },
});

export const { setOnboardingCompleted } = paymentSlice.actions
export default paymentSlice.reducer;
