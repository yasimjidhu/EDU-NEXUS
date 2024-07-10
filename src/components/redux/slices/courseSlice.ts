// src/redux/slices/courseSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../constants/axiosInstance';
import { CheckEnrollment } from '../../../types/enrollment';
import { Review } from '../../../types/review'
import { UpdateAssessmentPayload } from '../../../types/enrollment';
import axios from 'axios';

interface Question {
  answer: string;
  mark: number;
  options: string[];
  question: string;
}

interface IAssessment {
  title:string;
  total_score: number;
  passing_score: number;
  course_id: string;
  instructor_id: string;
  assessment_type: string;
  questions: Question[];
}



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
  reviews?:Review[]
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
  reviews:[]
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


interface ReviewRequestData{
  courseId:string;
}

export enum CompleationStatus {
    enrolled = 'enrolled',
    inProgress = 'in-progress',
    Completed = 'completed',
}

export interface EnrollmentEntity {
    _id?: string;
    userId: string;
    courseId: string;
    enrolledAt?: Date | string;
    completionStatus?: CompleationStatus;
    progress?: {
        completedLessons?:  string[] | [] | null;
        completedAssessments?: string[] | [] | null;
        overallCompletionPercentage?: number
    };
};


interface Question {
  answer: string;
  mark: number;
  options: string[];
  question: string;
}

interface IAssessment  {
  _id?:string;
  title:string;
  total_score: number;
  passing_score: number;
  course_id: string;
  instructor_id:string;
  assessment_type: string;
  questions: Question[];
}

export default IAssessment;


export const submitCourse = createAsyncThunk(
  'course/submitCourse',
  async (courseData: CourseState, { rejectWithValue }) => {
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
      const response = await axiosInstance.get(`/course/get-courses/${instructorId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserEnrolledCourses= createAsyncThunk(
  'course/getUserEnrolledCourses',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/my-course/${userId}`);
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
      const response = await axiosInstance.get(`/course/get-course/${courseId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllCourses= createAsyncThunk(
  'course/getAllCourses',
  async (page:number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/courses?page=${page}`);
      return {
        courses:response.data.courses.allCourses,
        totalPages: Math.ceil(response.data.courses.totalCourses / 8)
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCategoryWiseCourses = createAsyncThunk(
  'course/getCategoryWiseCourses',
  async ( payload: { page: number; categoryId: string }, { rejectWithValue }) => {
    try {
      const { page, categoryId } = payload;
      const response = await axiosInstance.get(`/course/categorywise/${categoryId}`, {
        params: {
          page,
        },
      });
      return {
        courses: response.data.allCourses,
        totalPages: Math.ceil(response.data.totalCourses / 8),
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const fetchCourseRequests= createAsyncThunk(
  'course/fetchCourseRequests', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/courseRequsts`);
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
      const response = await axiosInstance.put(`/course/update-course`,data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateLessonProgress = createAsyncThunk(
  'course/updateLessonProgress',
  async ({ courseId,userId, lessonId, progress,totalLesson }: { courseId: string,userId:string, lessonId: string, progress: number,totalLesson:number }, { rejectWithValue }) => {
    try {
      console.log('update progress reached in slice',courseId)
      const response = await axiosInstance.put(`/course/enrollment/progress`,{
        courseId,userId,lessonId,progress,totalLesson
      });
      return response.data;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  }
);

export const enrollToCourse= createAsyncThunk(
  'course/enrollment',
  async (data:EnrollmentEntity, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/course/enrollment`,data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkEnrollment= createAsyncThunk(
  'course/check-enrollment',
  async (data:CheckEnrollment, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/enrollment/check`,{
        params:{
          courseId:data.courseId,
          userId:data.userId
        }
      }); 
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addReview= createAsyncThunk(
  'course/add-review',
  async (data:Review, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/course/review`,data);
      return response.data.addedReview
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getReviews= createAsyncThunk(
  'course/get-reviews',
  async (data:ReviewRequestData, { rejectWithValue }) => {
    try {
      const {courseId} = data
      const response = await axiosInstance.get(`/course/review/${courseId}`);
      return Array.isArray(response.data.reviews) ? response.data.reviews : [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addAssessment= createAsyncThunk(
  'course/add-assessment',
  async (data:IAssessment, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/course/assessment`,data);
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAssessments= createAsyncThunk(
  'course/get-assessments',
  async (instructorId:string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/assessment/${instructorId}`);
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editAssessment = createAsyncThunk(
  'course/edit-assessments',
  async ({ updateData }: { updateData: Partial<IAssessment> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/course/assessment`, updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAssessment= createAsyncThunk(
  'course/delete-assessments',
  async (assessmentId:string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/course/assessment/${assessmentId}`);
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAssessment= createAsyncThunk(
  'course/get-assessment',
  async (assessmentId:string, { rejectWithValue }) => {
    try {
      console.log('request reached in slice',assessmentId)
      const response = await axiosInstance.get(`/course/assessment/${assessmentId}`);
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAssessmentCompletion = createAsyncThunk<
  EnrollmentEntity, 
  UpdateAssessmentPayload,
  {
    rejectValue: string; 
  }
>(
  'course/update-assessment-completion',
  async ({ userId, courseId }: UpdateAssessmentPayload, { rejectWithValue }) => {
    try {
      console.log('request updated assessment reached in slice', userId, courseId);
      const response = await axiosInstance.post<EnrollmentEntity>(`/course/update-completion`, { userId, courseId });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as string); 
      }
      return rejectWithValue(error.message);
    }
  }
);

export const getEnrolledStudentInstructors = createAsyncThunk(
  "instructor/getEnrolledStudentInstructors",
  async (userId:string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/enrolled-courses/${userId}`);
      console.log("get student enrolled courses instructors  in courseslice", response);
      return response.data;
    } catch (error: any) {
        console.log(error)
      return rejectWithValue(error.response.data);
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
        state.allCourses = action.payload.courses
      })
      .addCase(getAllCourses.rejected, (state, action : PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.error || 'Failed to submit course';
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        state.reviews = state.reviews ? [action.payload, ...state.reviews] : [action.payload];
      })
      .addCase(addReview.rejected, (state, action : PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.error || 'Failed to add  review';
      })
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.reviews = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getReviews.rejected, (state, action : PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.error || 'Failed to get  reviews';
      })
  },
});

export const { setCourseInfo, addLesson } = courseSlice.actions;
export default courseSlice.reducer;
