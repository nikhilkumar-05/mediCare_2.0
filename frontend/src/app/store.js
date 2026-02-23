import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import appointmentReducer from '../features/appointments/appointmentSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';
import doctorReducer from '../features/doctors/doctorSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        appointments: appointmentReducer,
        analytics: analyticsReducer,
        doctors: doctorReducer,
    },
});
