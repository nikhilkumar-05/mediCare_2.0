import axios from 'axios';

const API_URL = '/api/auth/doctors'; // This assumes we have a route for this or can use auth/users filtered by role

const getDoctors = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL, config);
    return response.data;
};

const doctorService = {
    getDoctors,
};

export default doctorService;
