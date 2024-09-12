// src/redux/slices/kycSlice.ts
import axiosInstance from '../../../constants/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// Initiate KYC Verification
export const initiateKYC = createAsyncThunk(
    'kyc/initiateKYC',
    async (instructorId: string, { rejectWithValue }) => {
        try {
            const respone = await axiosInstance.post(`/user/kyc/initiate/${instructorId}`);
            return respone.data;
        } catch (error) {
            return rejectWithValue('Failed to initiate KYC');
        }
    }
);

// Check KYC Status
export const checkKYCStatus = createAsyncThunk(
    'kyc/checkKYCStatus',
    async (sessionId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/user/kyc/status/${sessionId}`);
            return response.data.status;
        } catch (error) {
            return rejectWithValue('Failed to check KYC status');
        }
    }
);

// KYC Slice
const kycSlice = createSlice({
    name: 'kyc',
    initialState: {
        instructor: null,
        kycStatus: '',
        message: '',
        verificationSessionId:'',
        verificationUrl:'',
        loading: false,
        error: null,
    },
    reducers: {
        setInstructor: (state, action) => {
            state.instructor = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Initiate KYC
        builder.addCase(initiateKYC.pending, (state) => {
            state.loading = true;
            state.message = '';
            state.error = null;
        });
        builder.addCase(initiateKYC.fulfilled, (state, action) => {
            state.verificationSessionId = action.payload.verificationSessionId;
            state.verificationUrl = action.payload.verificationUrl; // Store URL
        })
        builder.addCase(initiateKYC.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Check KYC Status
        builder.addCase(checkKYCStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(checkKYCStatus.fulfilled, (state, action) => {
            state.loading = false;
            state.kycStatus = action.payload;
        });
        builder.addCase(checkKYCStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { setInstructor } = kycSlice.actions;

export default kycSlice.reducer;
