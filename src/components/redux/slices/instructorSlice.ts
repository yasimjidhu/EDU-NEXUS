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
}

const initialState: InstructorState = {
  loading: false,
  error: null,
  data: null,
};

export const fetchAllInstructors = createAsyncThunk(
  "user/fetchAllInstructors",
  async (_, { rejectWithValue }) => {
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
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(
        fetchAllInstructors.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearUserState } = InstructorSlice.actions;

export default InstructorSlice.reducer;
