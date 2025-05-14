import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import { config } from "./configuration";

export const baseUrl = 'http://localhost:3000';

export const api = axios.create({
  baseURL: baseUrl,
   
  ...config 
});
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }

api.interceptors.response.use(
    (response) => (response.data),
    (error: AxiosError) => {
        console.error("Request failed:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const commonRequest = async <T, B = unknown>(
    method: Method,
    route: string,
    body?: B,
    config: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
    const requestConfig: AxiosRequestConfig = {
        method,
        url: route,
        data: body,
        headers: config.headers,
        withCredentials: true
    };

    try {
        return await api(requestConfig);
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error("Error response:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error:", error);
        }
        throw error;
    }
};