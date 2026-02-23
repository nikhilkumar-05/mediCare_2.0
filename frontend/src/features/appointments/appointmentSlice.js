import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import appointmentService from './appointmentService';

const initialState = {
    appointments: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Book appointment
export const bookAppointment = createAsyncThunk(
    'appointments/book',
    async (appointmentData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await appointmentService.bookAppointment(appointmentData, token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get appointments
export const getAppointments = createAsyncThunk(
    'appointments/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await appointmentService.getAppointments(token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update status
export const updateStatus = createAsyncThunk(
    'appointments/updateStatus',
    async ({ id, status, ...rest }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await appointmentService.updateStatus(id, status, rest, token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Add / update prescription only (without changing status)
export const updatePrescription = createAsyncThunk(
    'appointments/updatePrescription',
    async ({ id, prescription }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await appointmentService.updatePrescription(id, prescription, token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const appointmentSlice = createSlice({
    name: 'appointments',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(bookAppointment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(bookAppointment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.appointments.push(action.payload.appointment);
            })
            .addCase(bookAppointment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAppointments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAppointments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.appointments = action.payload.appointments;
            })
            .addCase(getAppointments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateStatus.fulfilled, (state, action) => {
                state.appointments = state.appointments.map((apt) =>
                    apt._id === action.payload.appointment._id ? action.payload.appointment : apt
                );
            })
            .addCase(updatePrescription.fulfilled, (state, action) => {
                state.appointments = state.appointments.map((apt) =>
                    apt._id === action.payload.appointment._id ? action.payload.appointment : apt
                );
            });
    },
});

export const { reset } = appointmentSlice.actions;
export default appointmentSlice.reducer;
