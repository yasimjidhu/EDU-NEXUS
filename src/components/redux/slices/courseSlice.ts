// src/redux/slices/courseSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../constants/axiosInstance';


export interface Lesson {
  title: string;
  description: string;
  video: string;
  duration:string |undefined;
  attachments: Attachments[];
}

interface Attachments {
  title?: string;
  url?: string;
}

export interface Pricing {
  type:"free" | "paid"
  amount:number
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
  pricing: Pricing
  level:'beginner' | 'intermediate'|'expert';
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
  pricing: {
    type: "free",
    amount: 0,
  },
  level:'beginner',
  courseAmount:null,
  lessons: [],
  loading: false,
  error: null,
};


interface UpdateData{
  courseId?:string;
  thumbnail: string | null;
  trial: string | null;
  title: string;
  description: string;
  category: string;
  categoryRef:string;
  instructorRef:string;
  certificationAvailable: boolean;
  pricing: Pricing
  level:'beginner' | 'intermediate'|'expert';
  courseAmount:number|null;
  lessons: Lesson[];
}

export const submitCourse = createAsyncThunk(
  'course/submitCourse',
  async (courseData: CourseState, { rejectWithValue }) => {
    console.log('course data in slice',courseData)
    try {
      const response = await axiosInstance.post('/course/add-course', courseData);
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const  getAllCoursesOfInstructor= createAsyncThunk(
  'course/getAllCoursesOfInstructor',
  async (instructorId: string, { rejectWithValue }) => {
    try {
      console.log('get request reached of instructors mycourse',instructorId)
      const response = await axiosInstance.get(`/course/get-courses/${instructorId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCourse= createAsyncThunk(
  'course/getCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      console.log('course id for getcourse',courseId)
      const response = await axiosInstance.get(`/course/get-course/${courseId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllCourses= createAsyncThunk(
  'course/getAllCourses',
  async (_, { rejectWithValue }) => {
    console.log('get request reached  in slice');
    try {
      const response = await axiosInstance.get(`/course/get-all-courses`);
      console.log('response of allcourses',response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCourseRequests= createAsyncThunk(
  'course/fetchCourseRequests',
  async (_, { rejectWithValue }) => {
    console.log('fetchCourseRequests request reached  in slice');
    try {
      const response = await axiosInstance.get(`/course/courseRequsts`);
      console.log('response of all unpublished courses',response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const updateCourse= createAsyncThunk(
  'course/updateCourse',
  async (data:UpdateData, { rejectWithValue }) => {
    try {
      console.log(' id for update course',data.courseId)
      const response = await axiosInstance.put(`/course/update-course`,data);
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
      console.log('updated data',action.payload)  
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
