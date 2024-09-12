import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../constants/axiosInstance';
import { FeedbackPayload } from '../../../types/feedback';

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
  stripeAccountId?:string;
  onboardingComplete?:boolean;
  verificationSessionId?: string,
  verificationStatus?: string,
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
      console.log('response of register',response)
      return response.data.user;
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
      console.log('this is the get user error', error)
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'student/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/getAllUsers');
      console.log('response of allusers in slice', response)
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
      await axiosInstance.post('/user/block', { email });
      return { email, isBlocked: true }

    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const unblockUser = createAsyncThunk(
  'student/unblockUser',
  async (email: string, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/user/unblock', { email });
      return { email, isBlocked: false }

    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const ApproveInstructor = createAsyncThunk(
  'student/approve',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/approve', email);
      console.log('approve instructor response',response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const RejectInstructor = createAsyncThunk(
  'student/reject',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/reject', email);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  'student/update',
  async ({ email, updateData }: { email: string, updateData: Partial<User> }, { rejectWithValue }) => {
    try {
      console.log('update user detils called', updateData)
      const response = await axiosInstance.put(`/user/update/${email}`, { updateData });
      console.log('response of update user details', response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const submitFeedback = createAsyncThunk(
  'student/submit-feedback',
  async (feedback:FeedbackPayload, { rejectWithValue }) => {
    try {
      console.log('post submit feedback called', feedback);
      const response = await axiosInstance.post(`/user/feedback`, {feedback:feedback});
      console.log('Response of sumbit feedback', response);
      return response.data.message 
    } catch (error: any) {
      const errorMessage = error.response?.data || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getFeedbacks = createAsyncThunk(
  'student/get-feedbacks',
  async (_, { rejectWithValue }) => {
    try {
      console.log('get  feedback called');
      const response = await axiosInstance.get(`/user/feedbacks`);
      console.log('Response of get feedbacks', response);
      return response.data 
    } catch (error: any) {
      const errorMessage = error.response?.data || 'An error occurred';
      return rejectWithValue(errorMessage);
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
        console.log('paylod of register in thunk',action.payload)
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(Register.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        console.log('updated user in thunk', action.payload)
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserDetails.rejected, (state, action: PayloadAction<any>) => {
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
        const allUsers = state.allUsers;

        if (allUsers) {
          const index = allUsers.findIndex(u => u.email === action.payload.email);

          if (index !== -1 && state.allUsers?.length) {
            state.allUsers[index].isBlocked = action.payload.isBlocked;
          }
        }

        if (user && user.email === action.payload.email) {
          state.user!.isBlocked = action.payload.isBlocked;
        }
      })
      .addCase(unblockUser.fulfilled, (state, action: PayloadAction<{ email: string; isBlocked: boolean }>) => {
        const user = state.user;
        const allUsers = state.allUsers;

        if (allUsers) {
          const index = allUsers.findIndex(user => user.email === action.payload.email);

          if (index !== -1) {
            allUsers[index].isBlocked = action.payload.isBlocked;
          }
        }

        if (user && user.email === action.payload.email) {
          user.isBlocked = action.payload.isBlocked;
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
          console.log('approved user is', action.payload)
          state.user = action.payload.user;
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
        (state) => {
          state.loading = false;
          if (state.user) {
            state.user.isVerified = false;
          }
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
