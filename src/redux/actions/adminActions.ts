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

  export const getallInstructors = createAsyncThunk(
    "admin/getallInstructors",
    async(_, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${baseUrl}/admin/getallinstructors`, config);
            // The response.data will directly contain message and instructors
            if (response.data.instructors) {
                return response.data.instructors;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return handleError(error as AxiosError<ApiError>, rejectWithValue);
        }
    }

    

);

export const approveInstructor = createAsyncThunk(
  "admin/approveInstructor",
  async (instructorId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/admin/approveinstructor`,
        { instructorId },
        config
      );
      return response.data; // Expect updated instructor or success message
    } catch (error) {
      return handleError(error as AxiosError<ApiError>, rejectWithValue);
    }
  }
);

export const rejectInstructor = createAsyncThunk(
  "admin/rejectInstructor",
  async (instructorId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/admin/rejectinstructor`,
        { instructorId },
        config
      );
      return response.data; // Expect updated instructor or success message
    } catch (error) {
      return handleError(error as AxiosError<ApiError>, rejectWithValue);
    }
  }
);

export const blockUnblockInstructor = createAsyncThunk(
  "admin/blockUnblockInstructor",
  async (
    { instructorId, isBlocked }: { instructorId: string; isBlocked: boolean },
    { rejectWithValue }
  ) => {
    try {
      const url = isBlocked
        ? `${baseUrl}/admin/unblockinstructor`
        : `${baseUrl}/admin/blockinstructor`;
      const response = await axios.put(url, { instructorId }, config);
      return response.data.instructor;
    } catch (error) {
      return handleError(error as AxiosError<ApiError>, rejectWithValue);
    }
  }
);