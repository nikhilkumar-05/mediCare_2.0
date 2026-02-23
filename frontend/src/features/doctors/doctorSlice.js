import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import doctorService from './doctorService';

const initialState = {
    doctors: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const getDoctors = createAsyncThunk(
    'doctors/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await doctorService.getDoctors(token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const doctorSlice = createSlice({
    name: 'doctors',
    initialState,
    reducers: {
        resetDoctors: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDoctors.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDoctors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.doctors = action.payload.doctors;
            })
            .addCase(getDoctors.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { resetDoctors } = doctorSlice.actions;
export default doctorSlice.reducer;
