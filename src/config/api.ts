import axios, { AxiosError } from "axios";
import { baseUrl } from "./constants";
import { ApiError, handleError } from "./configuration";


const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true
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
      const response = await instance(requestConfig);
      console.log("🚀 ~ file: api.ts:25 ~ response:", response)
      return response.data.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      return handleError(axiosError, rejectWithValue);
    }
  }
