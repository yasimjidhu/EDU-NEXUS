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
  loading: boolean;
  error: string | null;
  user: User | null;
  allUsers: User[] | null;
}

const initialState: StudentState = {
  loading: false,
  error: null,
  user: null,
  allUsers: null,
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
    cv?: any;
    profileImage?: string;
  };
}

export const Register = createAsyncThunk(
  'student/register',
  async (payload: StudentRegistrationPayload, { rejectWithValue }) => {
    try {
      console.log('register reached in frontend')
      const response = await axiosInstance.post('/user/register', payload.formData);
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
      const response = await axiosInstance.get('/user/getUser');
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
  
export const getAllUsers = createAsyncThunk(
  'student/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/getAllUsers');
      return response.data.allUsers;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const blockUser = createAsyncThunk(
  'student/blockUser',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/block', { email });
      return {email,isBlocked:true}

    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const unblockUser = createAsyncThunk(
  'student/unblockUser',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/unblock', { email });
      return {email,isBlocked:false}

    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const ApproveInstructor = createAsyncThunk(
  'student/approve',
  async (email:string, { rejectWithValue }) => {
    try {
      console.log('request reached in register slice',email);
      const response = await axiosInstance.post('/user/approve',email);
      console.log('response of approveduser',response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const RejectInstructor = createAsyncThunk(
  'student/reject',
  async (email:string, { rejectWithValue }) => {
    try {
      console.log('request reached in rejection slice',email);
      const response = await axiosInstance.post('/user/reject',email);
      console.log('response of rejected user',response)
      return response.data;
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
        state.loading = true;
        state.error = null;
      })
      .addCase(Register.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(Register.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.allUsers = action.payload;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(blockUser.fulfilled, (state, action: PayloadAction<{ email: string; isBlocked: boolean }>) => {
        const user = state.user;
        const index = state.allUsers?.findIndex(user => user.email === action.payload.email);

        if (index !== undefined && index !== -1) {
          state.allUsers[index].isBlocked = action.payload.isBlocked;
        }

        if (user && user.email === action.payload.email) {
          state.user.isBlocked = action.payload.isBlocked;
        }
      })
      .addCase(unblockUser.fulfilled, (state, action: PayloadAction<{ email: string; isBlocked: boolean }>) => {
        const user = state.user;
        const index = state.allUsers?.findIndex(user => user.email === action.payload.email);

        if (index !== undefined && index !== -1) {
          state.allUsers[index].isBlocked = action.payload.isBlocked;
        }

        if (user && user.email === action.payload.email) {
          state.user.isBlocked = action.payload.isBlocked;
        }
      })
      .addCase(ApproveInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        ApproveInstructor.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          console.log("actionpaylod of approved user", action.payload);
          state.user = action.payload.user
          state.error = null;
        }
      )
      .addCase(
        ApproveInstructor.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(RejectInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        RejectInstructor.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          console.log("actionpaylod of approved user", action.payload);
          state.user = action.payload.user
          state.error = null;
        }
      )
      .addCase(
        RejectInstructor.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
  },
});

export const { clearUserState } = studentSlice.actions;

export default studentSlice.reducer;
