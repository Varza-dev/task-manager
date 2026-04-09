import axios from 'axios';

const axiosClient = axios.create({
    // Replace with your actual .NET backend URL
    baseURL: 'http://localhost:5085/api/taskapp',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add a "Response Interceptor" to handle global errors
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;