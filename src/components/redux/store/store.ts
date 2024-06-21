import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer, { AuthState } from "../slices/authSlice";
import userReducer, { StudentState } from "../slices/studentSlice";
import otpReducer, { otpState } from "../slices/otpSlice";
import instructorReducer,{InstructorState} from '../slices/instructorSlice'
import CategoryReducer,{CategoryState} from '../slices/adminSlice'


export interface RootState {
  auth: AuthState;
  otp: otpState;
  user: StudentState;
  instructor:InstructorState;
  category:CategoryState;
}
const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  otp: otpReducer,
  user: userReducer,
  instructor:instructorReducer,
  category:CategoryReducer
});

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export { store, persistor };
