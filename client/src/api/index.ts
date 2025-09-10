import axios, { AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    token?: string;
}

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Generic API caller for React Query
export const fetcher = async <T>(url: string, method: string, data?: any): Promise<ApiResponse<T>> => {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient({ url, method, data });
    if (!response.data.success) {
        throw new Error(response.data.message || 'API request failed');
    }
    return response.data;
};