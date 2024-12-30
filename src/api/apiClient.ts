import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/invoice-management-system/api/', // Your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.headers['content-type'].includes('application/zip')) {
            response.data = new Blob([response.data], { type: 'application/zip' });
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
