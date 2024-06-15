import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../constants/axiosInstance";

export interface AuthState {
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
            const response = await axiosInstance.post('/auth/auth/signup', data);
            console.log('response of signup',response)
            const token:any = response.data.access_token

            localStorage.setItem('access_token',token)
            return { user: response.data.user, error: null };       
        } catch (error:any) {
            console.log('this is the signup eror bro>>>',error.response.data.message);
            return rejectWithValue({error:error.response.data.message})
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
            console.log('data in verifyotp slice',data)
            const response = await axiosInstance.post('/auth/auth/verify-otp', data);
            console.log('response of verifyotp thunk',response)
            return response.data;
            
        } catch (error:any) {
            console.log('error in thunk',error.response.data.message)
            return rejectWithValue({ error: error.response.data.message });
        }
    }
)

export const resendOtp = createAsyncThunk<
any,
ForgotPasswordData,
{ rejectValue: RejectValue }
>(
    'auth/resendotp',
    async (data:ForgotPasswordData, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post('/auth/auth/resendOtp',data);
        console.log('response in authslice of resend otp',response)
        return response.data;
      } catch (error) {
        console.log(error);
        return rejectWithValue({ error: 'Error occurred in logout slice' });
      }
    }
  );



export const userLogin = createAsyncThunk<
  any,
  LoginData,
  { rejectValue: RejectValue }
>(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/auth/login', data,{
        headers:{
            'Content-Type': 'application/json',
        }
      }
    );
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
            
            const response = await axiosInstance.post('/auth/auth/forgot-password',data)
            return response.data
        } catch (error) {
            console.log('error in slice bro',error)
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
            const response = await axiosInstance.post('/auth/auth/reset-password',data)
            return response.data
        } catch (error) {
            console.log(error)
            return rejectWithValue({error:'error occured in reset password slice'})
        }
    }
)

export const logoutUser = createAsyncThunk<any, void, { rejectValue: RejectValue }>(
    'auth/logout-user',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post('/auth/auth/logout');
        return response.data;
      } catch (error) {
        console.log(error);
        return rejectWithValue({ error: 'Error occurred in logout slice' });
      }
    }
  );



  export const logoutAdmin = createAsyncThunk<any, void, { rejectValue: RejectValue }>(
    'auth/logout-admin',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post('/auth/auth/logout');
        return response.data;
      } catch (error) {
        console.log(error);
        return rejectWithValue({ error: 'Error occurred in logout slice' });
      }
    }
  );



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
                console.log('user in signup authslice',action.payload)
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
                console.log('user in loginslice',action.payload)
                state.user = action.payload.user
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
            .addCase(resendOtp.pending,(state)=>{
                state.loading = true
                state.error = null
            })
            .addCase(resendOtp.fulfilled,(state)=>{
                state.loading = false
                state.error = null
            })
            .addCase(resendOtp.rejected,(state,action:PayloadAction<RejectValue | undefined>)=>{
                state.loading = false
                state.error = action.payload?.error || 'An error occured'
            })
        }
});

export default authSlice.reducer;
