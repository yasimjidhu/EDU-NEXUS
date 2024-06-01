import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';

interface AuthState {
    user: any;
    loading: boolean;
    error: string | null;
    userEmail: string | null; // New property to store user email
}

interface SignupData {
    username: string;
    email: string;
    password: string;
}

interface OTPData {
    email: any; 
    otp: string;
    token:any;
}

interface RejectValue {
    error: string;
}



export const signupUser = createAsyncThunk<
    any,
    SignupData,
    { rejectValue: RejectValue }
>(
    'auth/signup',
    async (data: SignupData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4000/auth/signup', data);
            const token:any = response.data.token

            localStorage.setItem('token',token)
            return { user: response.data.user, error: null };       
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                return { user: null, error: axiosError.message };
            }
            return { user: null, error: 'An unknown error occurred' };
        }
    }
);



export const verifyOTP = createAsyncThunk<
any,
OTPData,
{ rejectValue: RejectValue }
>(
    'auth/verifyotp',
    async (data: OTPData, { rejectWithValue }) => {
        try {

            const response = await axios.post('http://localhost:4000/auth/verify-otp', data);
            return response.data;
            
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue({ error: error.message });
            }
            return rejectWithValue({ error: 'An unknown error occurred' });
        }
    }
)

const userDetails: AuthState = {
    user: null,
    loading: false,
    error: null,
    userEmail:null
}

const authSlice = createSlice({
    name: 'auth',
    initialState: userDetails,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.user = action.payload.user;
                if (action.payload.error) {
                    state.error = action.payload.error;
                }
                state.userEmail = state.user ? state.user.email : null
            })
            .addCase(signupUser.rejected, (state, action: PayloadAction<RejectValue | undefined>) => {
                state.loading = false;
                state.error = action.payload?.error || 'An error occurred';
            })
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(verifyOTP.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(verifyOTP.rejected, (state, action: PayloadAction<RejectValue | undefined>) => {
                state.loading = false;
                state.error = action.payload?.error || 'An error occurred';
            });
    }
});

export default authSlice.reducer;
