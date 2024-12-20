import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/invoice-management-system/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to automatically unwrap `data`
apiClient.interceptors.response.use(
    (response) => response.data, // Automatically return `response.data`
    (error) => Promise.reject(error)
);

export default apiClient;
