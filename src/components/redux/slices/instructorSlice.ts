import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../constants/axiosInstance";

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

export interface InstructorState {
  loading: boolean;
  error: string | null;
  data: User | null;
  allInstructors: User[] | null
}

const initialState: InstructorState = {
  loading: false,
  error: null,
  data: null,
  allInstructors : null
};

export const fetchAllInstructors = createAsyncThunk(
  "instructor/fetchAllInstructors",
  async (_, { rejectWithValue }) => {
    console.log('fetch allcalled in slice')
    try {
      const response = await axiosInstance.get(`/user/user/getInstructors`);
      console.log("getInstructors  in userslice", response);
      return response.data;
    } catch (error: any) {
        console.log(error)
      return rejectWithValue(error.response.data);
    }
  }
);

export const ApproveInstructor = createAsyncThunk(
    'instructor/approve',
    async (email:string, { rejectWithValue }) => {
      try {
        console.log('request reached in register slice',email);
        const response = await axiosInstance.post('/user/user/approve',email);
        console.log('response of approveduser',response)
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  export const RejectInstructor = createAsyncThunk(
    'instructor/reject',
    async (email:string, { rejectWithValue }) => {
      try {
        console.log('request reached in rejection slice',email);
        const response = await axiosInstance.post('/user/user/reject',email);
        console.log('response of rejected user',response)
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  


const InstructorSlice = createSlice({
  name: "instructor",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
      state.allInstructors = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllInstructors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllInstructors.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          console.log("actionpaylod of fetchAllInstructors", action.payload);
          state.allInstructors = action.payload;
          state.error = null;
        }
      )
      .addCase(
        fetchAllInstructors.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(ApproveInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        ApproveInstructor.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          console.log("actionpaylod of approved user", action.payload);
          state.data = action.payload.user
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
          state.data = action.payload.user
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

export const { clearUserState } = InstructorSlice.actions;

export default InstructorSlice.reducer;
