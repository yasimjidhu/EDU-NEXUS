import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice'


// interface RootState{
//     auth:{
//         username:string;
//         email:string;
//         password:string;
//     };
// }
const store = configureStore({
    reducer:{
        auth:authReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;

export default store