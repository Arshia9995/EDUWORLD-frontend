import { createAsyncThunk } from "@reduxjs/toolkit";
import { IAdminLoginData } from "../../interface/IAdminLogin";
import axios,  { AxiosError } from "axios";
import { baseUrl } from "../../config/constants";
import { ApiError, config, handleError } from "../../config/configuration";




export const adminLogin = createAsyncThunk(
    "admin/adminLogin",
    async ({ email, password }: IAdminLoginData,{ rejectWithValue }) => {
      try {
        const response = await axios.post(`${baseUrl}/admin/login` , { email, password }, config);
        return response.data;
      } catch (error: any) {
        return handleError(error as AxiosError<ApiError>, rejectWithValue);
      }
    }
  );

  export const getallStudents = createAsyncThunk(
    "admin/getallStudents",
    async(_, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${baseUrl}/admin/getallstudents`, config);
            return response.data.students; 
        } catch (error) {
            return handleError(error as AxiosError<ApiError>, rejectWithValue);
        }
    }
  );