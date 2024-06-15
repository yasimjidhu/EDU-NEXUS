import {PayloadAction, createSlice} from '@reduxjs/toolkit'

export interface otpState{
    timeLeft : number
    isActive:boolean
}
const initialState :otpState= {
    timeLeft:180,
    isActive:false
}

const otpSlice = createSlice({
    name:'otp',
    initialState,
    reducers:{
        startCountdown(state,action:PayloadAction<number | undefined>){
            state.isActive = true
            state.timeLeft = action.payload ?? initialState.timeLeft
        },
        decrementTimer(state){
            if(state.timeLeft > 0){
                state.timeLeft -= 1
            }else{
                state.isActive = false
            }
        },
        resetTimer(state){
            state.isActive = false
            state.timeLeft = initialState.timeLeft
        },
        setTimeLeft(state,action:PayloadAction<number | undefined>){
            state.timeLeft = action.payload ?? initialState.timeLeft
        }
    }
})

export const {startCountdown,decrementTimer,resetTimer,setTimeLeft} = otpSlice.actions
export default otpSlice.reducer