import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../constants/axiosInstance';


export interface User {
  contact: {
    address: string;
    phone: string;
    social: string;
  };
  createdAt: string;
  email: string;
  firstName: string;
  isBlocked: boolean;
  isGAuth: boolean;
  isRejected: boolean;
  isVerified: boolean;
  lastName: string;
  profile: {
    avatar: string;
    dateOfBirth: string;
    gender: string;
  };
  profit: number;
  qualification: string;
  role: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface StudentState {
  loading:boolean
  error:string | null
  user:User | null
}


const initialState: StudentState = {
  loading:false,
  error:null,
  user:null
};

interface StudentRegistrationPayload {
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    qualification: string;
    dob: Date;
    gender: string;
    cv?:any;
    profileImage?:string;
  };
}



export const Register = createAsyncThunk(
  'student/register',
  async (payload: StudentRegistrationPayload, { rejectWithValue }) => {
    try {
      console.log('request reached in register slice', payload);
      const response = await axiosInstance.post('/user/user/register', payload.formData);
      console.log('response in slicce',response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const fetchUserData = createAsyncThunk(
  'student/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user/user/getUser`)
      console.log('getuserdata in userslice',response)
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);





const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(Register.fulfilled, (state,action:PayloadAction<any>) => {
        state.loading = false
        console.log('actionpaylod in sliceds',action.payload.user)
        state.user = action.payload.user
        state.error = null
      })
      .addCase(Register.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload;
      })
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        console.log('actionpaylod of fetchuserdata',action.payload)
        state.user = action.payload
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearUserState} = studentSlice.actions

export default studentSlice.reducer;
