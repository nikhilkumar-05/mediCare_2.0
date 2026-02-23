import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from './analyticsService';

const initialState = {
    stats: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const getDashboardStats = createAsyncThunk(
    'analytics/getStats',
    async (role, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await analyticsService.getDashboardStats(role, token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        resetStats: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDashboardStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.stats = action.payload.data;
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { resetStats } = analyticsSlice.actions;
export default analyticsSlice.reducer;
