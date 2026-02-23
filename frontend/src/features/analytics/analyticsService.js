import axios from 'axios';

const API_URL = '/api/analytics/';

const getDashboardStats = async (role, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(`${API_URL}${role}`, config);
    return response.data;
};

const analyticsService = {
    getDashboardStats,
};

export default analyticsService;
