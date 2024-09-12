// src/redux/slices/courseSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../constants/axiosInstance';
import { CheckEnrollment } from '../../../types/enrollment';
import { Review } from '../../../types/review'
import { UpdateAssessmentPayload } from '../../../types/enrollment';
import axios from 'axios';
import { CourseRequest } from '../../../types/course';
import { ReportEntity } from '../../../types/reports';

interface Question {
  answer: string;
  mark: number;
  options: string[];
  question: string;
}

interface IAssessment {
  title: string;
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
  duration: string | undefined;
  attachments: Attachments[];
}

interface Attachments {
  title?: string;
  url?: string;
}

export interface Pricing {
  type: "free" | "paid"
  amount: number
}

export interface CourseState {
  thumbnail: string | null;
  trial: string | null;
  title: string;
  description: string;
  category: string;
  categoryRef: string;
  instructorRef: string;
  certificationAvailable: boolean;
  pricing: Pricing
  level: 'beginner' | 'intermediate' | 'expert';
  rating?: number;
  courseAmount: number | null;
  enrolledStudentsCount?: number;
  language: string;
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  allCourses?: CourseState[]
  reviews?: Review[];
  _id?: string;
  reviewCounts?: number;
  reports?: ReportEntity[];
}

export interface UserData {
  id: string
}


const initialState: CourseState = {
  thumbnail: null,
  trial: null,
  title: '',
  description: '',
  category: '',
  categoryRef: '',
  instructorRef: '',
  certificationAvailable: false,
  pricing: {
    type: "free",
    amount: 0,
  },
  level: 'beginner',
  rating: 0,
  courseAmount: null,
  enrolledStudentsCount: 0,
  language: 'english',
  lessons: [],
  loading: false,
  error: null,
  reviews: [],
  _id: '',
  reviewCounts: 0,
  reports: []
};

interface UpdateData {
  courseId?: string;
  thumbnail: string | null;
  trial: string | null;
  title: string;
  description: string;
  category: string;
  categoryRef: string;
  instructorRef: string;
  certificationAvailable: boolean;
  pricing: Pricing
  level: 'beginner' | 'intermediate' | 'expert';
  courseAmount: number | null;
  lessons: Lesson[];
}


interface ReviewRequestData {
  courseId: string;
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
  completedAssessmentId?: string;
  progress?: {
    completedLessons?: string[] | [] | null;
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

interface IAssessment {
  _id?: string;
  title: string;
  total_score: number;
  passing_score: number;
  course_id: string;
  instructor_id: string;
  assessment_type: string;
  questions: Question[];
}

export const submitCourse = createAsyncThunk(
  'course/submitCourse',
  async (courseData: CourseState, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/course/courses/add-course', courseData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllCoursesOfInstructor = createAsyncThunk(
  'course/getAllCoursesOfInstructor',
  async (instructorId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/courses/get-courses/${instructorId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserEnrolledCourses = createAsyncThunk(
  'course/getUserEnrolledCourses',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/enrollments/my-course/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchCourses = createAsyncThunk(
  'courses/searchCourses',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/courses/search`, {
        params: { query: searchTerm },
      });
      console.log('response of search course', response.data)
      return response.data.allCourses;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const getCourse = createAsyncThunk(
  'course/getCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/courses/get-course/${courseId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const disableCourse = createAsyncThunk(
  'course/disableCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      console.log('couser d in disablecourse', courseId)
      const response = await axiosInstance.put(`/course/courses/disable/${courseId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCourseVideoUrl = createAsyncThunk(
  'course/getCourseVideoUrl',
  async ({ courseId, userId }: { courseId: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/courses/stream-video/${courseId}`, {
        params: { userId }
      });
      console.log('Response of getCourseVideoUrl', response);
      return response.data.videoUrl;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getInstructorCourseDetailed = createAsyncThunk(
  'course/getCourse',
  async (instructorId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/courses/get-courses-detailed/${instructorId}`);
      console.log('response of detailed course ', response.data.courses)
      return response.data.courses;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getInstructorsStudentsOverview = createAsyncThunk(
  'course/getInstructorsStudentsOverview',
  async ({ instructorId, courseId }: { instructorId: string, courseId: string }, { rejectWithValue }) => {
    try {
      // Pass courseId as a query parameter
      const response = await axiosInstance.get(`/course/courses/studentsOverview/${instructorId}?courseId=${courseId}`);
      console.log('response of getinstructors student overvew', response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const getAllCourses = createAsyncThunk(
  'course/getAllCourses',
  async ({ page, sort,limit, filters }: { page?: number; sort?: string; limit?:number, filters?: any }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: page?.toString(),
        limit: limit?.toString(),
        ...(sort && { sort }),
        ...(filters?.price && { price: filters.price }),
        ...(filters?.level && { level: filters.level }),
      });

      const response = await axiosInstance.get(`/course/courses?${queryParams}`);
      console.log('rseponse of allcourses', response)
      return {
        courses: response.data.courses.allCourses,
        totalPages: Math.ceil(response.data.courses.totalCourses / 6)
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPopularInstructorsCourses = createAsyncThunk(
  'course/getPopularInstructorsCourses',
  async (_, { rejectWithValue }) => {
    try {
      // Pass courseId as a query parameter
      const response = await axiosInstance.get(`/course/courses/popular-courses`);
      console.log('response of popular courses', response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getCategoryWiseCourses = createAsyncThunk(
  'course/getCategoryWiseCourses',
  async ({ categoryId, page, sort, filters }: { categoryId: string, page: number; sort?: string; filters?: any }, { rejectWithValue }) => {

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...(sort && { sort }),
        ...(filters?.price && { price: filters.price }),
        ...(filters?.level && { level: filters.level }),
      }).toString();

      const response = await axiosInstance.get(`/course/courses/categorywise/${categoryId}?${queryParams}`);
      console.log('response of categorywise', response.data)
      return {
        courses: response.data.allCourses,
        totalPages: Math.ceil(response.data.totalCourses / 8),
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCourseRequests = createAsyncThunk(
  'course/fetchCourseRequests',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/courses/courseRequests?page=${page}`);
      return {
        courses: response.data.allCourses,
        totalPages: Math.ceil(response.data.totalCourses / 10),
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const approveCourse = createAsyncThunk(
  'course/approve-course',
  async (data: CourseRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/course/courses/approve/${data.courseId}`, data);
      console.log('response of approve couse', response)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const rejectCourse = createAsyncThunk(
  'course/reject-course',
  async (data: CourseRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/course/courses/reject/${data.courseId}`, data);
      console.log('response of reject couse', response)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'course/updateCourse',
  async (data: { courseId: string, course: UpdateData }, { rejectWithValue }) => {
    try {
      const { courseId, course } = data;
      const response = await axiosInstance.put(`/course/courses/update-course/${courseId}`, { course });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateLesson = createAsyncThunk(
  'course/updateLesson',
  async (data: { courseId: string; lessons: Lesson[] }, { rejectWithValue }) => {
    try {
      const { courseId, lessons } = data;
      const response = await axiosInstance.put(`/course/courses/update-lessons/${courseId}`, { lessons });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Report course
export const submitReport = createAsyncThunk(
  'course/submitReport',
  async ({ reason, courseId, userId, courseName, userName }: { reason: string, courseId: string, userId: string, courseName: string, userName: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/course/courses/report/${courseId}`, { reason, userId, courseName, userName });
      console.log('response of report course', response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllReports = createAsyncThunk(
  'course/getAllReports',
  async (_, { rejectWithValue }) => {
    try {
      console.log('get all reports called')
      const response = await axiosInstance.get(`/course/courses/reports`);
      console.log('response of get reports', response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateReportStatus = createAsyncThunk(
  'course/updateReportStatus',
  async ({ reportId, status }: { reportId: string, status: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/course/courses/report/${reportId}`, { status });
      console.log('response of get reports', response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateLessonProgress = createAsyncThunk(
  'course/updateLessonProgress',
  async ({ courseId, userId, lessonId, progress, totalLesson }: { courseId: string, userId: string, lessonId: string, progress: number, totalLesson: number }, { rejectWithValue }) => {
    try {
      console.log('update progress reached in slice', courseId)
      const response = await axiosInstance.put(`/course/enrollments/enrollment/progress`, {
        courseId, userId, lessonId, progress, totalLesson
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating lesson progress:', error);
      return rejectWithValue(error.respone?.data || error.message)
    }
  }
);

export const enrollToCourse = createAsyncThunk(
  'course/enrollment',
  async (data: EnrollmentEntity, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/course/enrollments`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkEnrollment = createAsyncThunk(
  'course/check-enrollment',
  async (data: CheckEnrollment, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/enrollments/check`, {
        params: {
          courseId: data.courseId,
          userId: data.userId
        }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addReview = createAsyncThunk(
  'course/add-review',
  async (data: Review, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/course/reviews/review`, data);
      console.log('add review response', response.data)
      return response.data.addedReview
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getReviews = createAsyncThunk(
  'course/get-reviews',
  async (data: ReviewRequestData, { rejectWithValue }) => {
    try {
      const { courseId } = data
      const response = await axiosInstance.get(`/course/reviews/review/${courseId}`);
      return Array.isArray(response.data.reviews) ? response.data.reviews : [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addAssessment = createAsyncThunk(
  'course/add-assessment',
  async (data: IAssessment, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/course/assessments`, data);
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAssessments = createAsyncThunk(
  'course/get-assessments',
  async (instructorId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/assessments/${instructorId}`);
      console.log('rsponse of get assessments after detletion', response)
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
      const response = await axiosInstance.put(`/course/assessments/${updateData._id}`, updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAssessment = createAsyncThunk(
  'course/delete-assessment',
  async (assessmentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/course/assessments/${assessmentId}`);
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAssessment = createAsyncThunk(
  'course/get-assessment',
  async (assessmentId: string, { rejectWithValue }) => {
    try {
      console.log('request reached in slice', assessmentId)
      const response = await axiosInstance.get(`/course/assessments/assessment/${assessmentId}`);
      console.log('response of get assessments in sice', response)
      return response.data
    } catch (error: any) {
      console.log('error in get assessment', error)
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getStudentAssessments = createAsyncThunk(
  'course/get-student-assessments',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/enrollments/${userId}`);
      console.log('response of get student assessments in sice', response)
      return response.data
    } catch (error: any) {
      console.log('error in get assessment', error)
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
  async ({ userId, courseId, score, completedAssessmentId, examStatus }: UpdateAssessmentPayload, { rejectWithValue }) => {
    try {
      console.log('update assessment completeiton called', examStatus)
      const response = await axiosInstance.post<EnrollmentEntity>(`/course/enrollments/update-completion`, { userId, courseId, score, completedAssessmentId, examStatus });
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
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/enrollments/instructorRefs/${userId}`);
      return response.data;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(error.response.data);
    }
  }
);

export const getStudentCourseOverview = createAsyncThunk(
  "course/getStudentCourseOverview",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/courses/course-overview/${userId}`);
      return response.data;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(error.response.data);
    }
  }
);

export const getStudentEnrollmentOverview = createAsyncThunk(
  "course/getStudentEnrollmentOverview",
  async (instructorId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/course/courses/enrollment-overview/${instructorId}`);
      console.log('response of get student enrollment overview', response)
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
    clearCourseInfo() {
      return initialState
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(submitCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitCourse.fulfilled, (state: any, action: PayloadAction<any>) => {
        state.loading = false;
        // Reset course state after successful submission
        Object.assign(state, action.payload.course)
        state = courseSlice.caseReducers.clearCourseInfo(state);
      })
      .addCase(submitCourse.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.error || 'Failed to submit course';
      })
      .addCase(submitReport.pending, (state) => {
        state.error = null
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.reports = [...(state.reports || []), action.payload]; // Ensuring it's an array and appending new data immutably
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to submit report";
      })
      .addCase(getAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCourses.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.allCourses = action.payload.courses
      })
      .addCase(getAllCourses.rejected, (state, action: PayloadAction<any>) => {
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
      .addCase(addReview.rejected, (state, action: PayloadAction<any>) => {
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
      .addCase(getReviews.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.error || 'Failed to get  reviews';
      })
  },
});

export const { setCourseInfo, addLesson, clearCourseInfo } = courseSlice.actions;
export default courseSlice.reducer;
