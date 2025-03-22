import axios, { AxiosError } from "axios";
import { baseUrl } from "./constants";
import { ApiError, config, handleError } from "./configuration";


 export const api = axios.create({
    baseURL: baseUrl,
    // withCredentials: true
    ...config
  })

  export const reduxRequest = async (
    method: string,
    route: string,
    config: any,
    rejectWithValue: any,
    body?: any,
  ) => {
    const requestConfig = {
      method,
      url: route,
      data:body,
      config,
    };
    try {
      const response = await api(requestConfig);
      console.log("🚀 ~ file: api.ts:25 ~ response:", response)
      return response.data.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      return handleError(axiosError, rejectWithValue);
    }
  }
