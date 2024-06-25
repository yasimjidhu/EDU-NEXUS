// src/redux/slices/courseSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../constants/axiosInstance';


export interface Lesson {
  title: string;
  description: string;
  video: string;
  duration:string |undefined;
  attachmentsTitle: string;
  attachments: string[];
}

export interface CourseState {
  thumbnail: string | null;
  trial: string | null;
  title: string;
  description: string;
  category: string;
  categoryRef:string;
  instructorRef:string;
  certificationAvailable: boolean;
  pricing: 'free' | 'paid';
  courseAmount:number|null;
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  allCourses?:CourseState[]
}

export interface UserData{
  id:string
}


const initialState: CourseState = {
  thumbnail: null,
  trial: null,
  title: '',
  description: '',
  category: '',
  categoryRef:'',
  instructorRef:'',
  certificationAvailable: false,
  pricing: 'free',
  courseAmount:null,
  lessons: [],
  loading: false,
  error: null,
};

export const submitCourse = createAsyncThunk(
  'course/submitCourse',
  async (courseData: CourseState, { rejectWithValue }) => {
    console.log('course data in slice',courseData)
    try {
      const response = await axiosInstance.post('/course/course/add-course', courseData);
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllCourses = createAsyncThunk(
  'course/getAllCourses',
  async (instructorId: string, { rejectWithValue }) => {
    console.log('instructor data in slice', instructorId);
    try {
      
      const response = await axiosInstance.get(`/course/course/get-all-courses`, {
        params: { instructorRef: instructorId },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCourse= createAsyncThunk(
  'course/getCourse',
  async (courseId: string, { rejectWithValue }) => {
    console.log('course  id in slice', courseId);
    try {
      
      const response = await axiosInstance.get(`/course/course/get-course`, {
        params: { courseId: courseId},
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCourseInfo(state, action: PayloadAction<Partial<CourseState>>) {
      return { ...state, ...action.payload };
    },
    addLesson(state, action: PayloadAction<Lesson>) {
      console.log('add lesson reached in slice',action.payload)
      state.lessons.push(action.payload);
    },
    clearCourseInfo(state) {
      return initialState;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(submitCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitCourse.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        Object.assign(state, action.payload.course)
      })
      .addCase(submitCourse.rejected, (state, action : PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.error || 'Failed to submit course';
      })
      .addCase(getAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCourses.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        console.log('all coursses',action.payload.courses)
        state.allCourses = action.payload.courses
      })
      .addCase(getAllCourses.rejected, (state, action : PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.error || 'Failed to submit course';
      });
  },
});

export const { setCourseInfo, addLesson } = courseSlice.actions;
export default courseSlice.reducer;
