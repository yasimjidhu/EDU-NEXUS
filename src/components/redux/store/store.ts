import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer, { AuthState } from "../slices/authSlice";
import userReducer, { StudentState } from "../slices/studentSlice";
import otpReducer, { otpState } from "../slices/otpSlice";
import instructorReducer,{InstructorState} from '../slices/instructorSlice'

export interface RootState {
  auth: AuthState;
  otp: otpState;
  user: StudentState;
  instructor:InstructorState;
}
const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  otp: otpReducer,
  user: userReducer,
  instructor:instructorReducer
});

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

let persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export { store, persistor };
