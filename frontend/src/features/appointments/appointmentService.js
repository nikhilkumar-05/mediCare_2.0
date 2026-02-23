import api from '../../utils/api';

const API_URL = '/api/appointments/';

// Create new appointment
const bookAppointment = async (appointmentData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await api.post(API_URL, appointmentData, config);
    return response.data;
};

// Get user appointments
const getAppointments = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await api.get(API_URL + 'me', config);
    return response.data;
};

// Update appointment status
const updateStatus = async (id, status, extraData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await api.put(`${API_URL}${id}/status`, { status, ...extraData }, config);
    return response.data;
};

// Add / update prescription only
const updatePrescription = async (id, prescription, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await api.put(`${API_URL}${id}/prescription`, { prescription }, config);
    return response.data;
};

const appointmentService = {
    bookAppointment,
    getAppointments,
    updateStatus,
    updatePrescription,
};

export default appointmentService;
