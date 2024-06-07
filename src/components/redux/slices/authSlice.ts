import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';

interface AuthState {
    user: any;
    loading: boolean;
    error: string | null;
    email: string | null;
}

interface SignupData {
    username: string;
    email: string;
    password: string;
}

interface OTPData {
    email?: any; 
    otp: string;
    token?:any;
}

interface RejectValue {
    error: string;
}
interface LoginData{
    email:string
    password:string
}

interface ForgotPasswordData{
    email:string
}

interface ResetPassword{
    newPassword:string,
    email:string
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
            
            const response = await axios.post('http://localhost:4000/auth/verify-otp', data,{
                withCredentials:true
            });
            return response.data;
            
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue({ error: error.message });
            }
            return rejectWithValue({ error: 'An unknown error occurred' });
        }
    }
)

export const userLogin = createAsyncThunk<
  any,
  LoginData,
  { rejectValue: RejectValue }
>(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4000/auth/login', data);
      console.log('response data in login thunk',response)
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue({ error: error.response.data.error });
      } else {
        return rejectWithValue({ error: error.message });
      }
    }
  }
)



export const forgotPassword = createAsyncThunk<
any,
ForgotPasswordData,
{rejectValue:RejectValue}
>(
    'auth/forgot-password',
    async (data:ForgotPasswordData,{rejectWithValue})=>{
        try {
            
            const response = await axios.post('http://localhost:4000/auth/forgot-password',data)
            return response.data
        } catch (error) {
            console.log(error)
            return rejectWithValue({error:'error occured in forgot-password'})
        }
    }
)

export const resetPassword = createAsyncThunk<
any,
ResetPassword,
{rejectValue:RejectValue}
>(
    'auth/reset-password',
    async (data:ResetPassword,{rejectWithValue})=>{
        try {
            console.log('reset password called in slice',data)
            const response = await axios.post('http://localhost:4000/auth/reset-password',data,{
                withCredentials:true
            })
            return response.data
        } catch (error) {
            console.log(error)
            return rejectWithValue({error:'error occured in reset password slice'})
        }
    }
)




const userDetails: AuthState = {
    user: null,
    loading: false,
    error: null,
    email:null
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
                state.email = state.user ? state.user.email : null
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
                console.log('action.payload',action.payload)
                state.user = action.payload
            })
            .addCase(verifyOTP.rejected, (state, action: PayloadAction<RejectValue | undefined>) => {
                state.loading = false;
                state.error = action.payload?.error || 'An error occurred';
            })
            .addCase(userLogin.pending,(state)=>{
                state.loading = true
                state.error = null
            })
            .addCase(userLogin.fulfilled,(state,action:PayloadAction<any>)=>{
                state.loading = false
                state.user = action.payload
            })
            .addCase(userLogin.rejected,(state,action:PayloadAction<RejectValue | undefined>)=>{
                state.loading = false
                state.error = action.payload?.error || 'Failed to login'
            })
            .addCase(forgotPassword.pending,(state)=>{
                state.loading = true
                state.error = null
            })
            .addCase(forgotPassword.fulfilled,(state,action:PayloadAction<any>)=>{
                state.loading = false
                state.email = action.payload
            })
            .addCase(forgotPassword.rejected,(state,action:PayloadAction<RejectValue | undefined>)=>{
                state.loading = false
                state.error = action.payload?.error || 'An error occured'
            })
        }
});

export default authSlice.reducer;
