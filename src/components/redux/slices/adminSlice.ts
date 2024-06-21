import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../constants/axiosInstance";

interface Category {
    name: string;
    description: string;
    image: string;
}

interface RejectValue {
    error: string;
}

export interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

export const addCategory = createAsyncThunk<
    Category,
    Category,
    { rejectValue: RejectValue }
>(
    'categories/add-category',
    async (data: Category, { rejectWithValue }) => {
        try {
            console.log('data in slice', data)
            const response = await axiosInstance.post('/course/course/add-category', data);
            console.log('response of addcategory', response);
            return response.data; 
        } catch (error: any) {
            console.log('this is the add category error>>>', error);
            return rejectWithValue({ error: error.message || 'Failed to add category' });
        }
    }
);

export const getAllCategories = createAsyncThunk<
    Category[],
    void,
    { rejectValue: RejectValue }
>(
    'categories/get-all-categories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/course/course/get-all-categories');
            console.log('response data in slice', response)
            return response.data; 
        } catch (error: any) {
            console.error('Failed to fetch categories:', error);
            return rejectWithValue({ error: error.message || 'Failed to fetch categories' });
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
                console.log('new category payload', action.payload)
                state.loading = false;
                state.categories = [...state.categories, action.payload]; // immutably add new category
                state.error = null;
            })
            .addCase(addCategory.rejected, (state, action: PayloadAction<RejectValue | undefined>) => {
                state.loading = false;
                state.error = action.payload?.error || 'Failed to add category';
            })
            .addCase(getAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.loading = false;
                console.log('payload of all categories', action.payload)
                state.categories = action.payload; // Replace the entire categories array with fetched data
                state.error = null;
            })
            .addCase(getAllCategories.rejected, (state, action: PayloadAction<RejectValue | undefined>) => {
                state.loading = false;
                state.error = action.payload?.error || 'Failed to fetch categories';
            });
    },
});

export default categorySlice.reducer;
