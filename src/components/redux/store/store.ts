import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer, { AuthState } from "../slices/authSlice";
import userReducer, { StudentState } from "../slices/studentSlice";
import courseReducer, { CourseState } from '../slices/courseSlice';
import otpReducer, { otpState } from "../slices/otpSlice";
import instructorReducer, { InstructorState } from '../slices/instructorSlice';
import CategoryReducer, { CategoryState } from '../slices/adminSlice';

export interface RootState {
  auth: AuthState;
  otp: otpState;
  user: StudentState;
  instructor: InstructorState;
  category: CategoryState;
  course: CourseState;
}

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ['auth', 'otp', 'course', 'instructor', 'category'], 
  blacklist: ['user'], 
};

const rootReducer = combineReducers({
  auth: authReducer,
  otp: otpReducer,
  user: userReducer,
  instructor: instructorReducer,
  category: CategoryReducer,
  course: courseReducer,
});

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export { store, persistor };
