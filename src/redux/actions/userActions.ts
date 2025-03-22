import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUserSignupData } from "../../interface/IUserSignup";
import { IUserLoginData } from "../../interface/IUserLogin";
import axios,  { AxiosError } from "axios";
import { baseUrl } from "../../config/constants";
import { ApiError, config, handleError } from "../../config/configuration";
import { api } from "../../config/api";




export const userSignup = createAsyncThunk('user/userSignup', async(userCredentials:IUserSignupData, {rejectWithValue}) => {
    try {
        console.log("reached in userSignup reducer");
        const {data} = await api.post("/users/signup", userCredentials)
        console.log("API Response:", data);
        return data
        
    } catch (err: any) {
        console.error("API Error:", err);
        const axiosError = err as AxiosError<ApiError>;
        if (axiosError.response) {
            if (axiosError.response.data.message === 'Email already exists') {
                return rejectWithValue('Email already exists, please try a different one');
            }
            return rejectWithValue(axiosError.response.data.message);
          }
         return handleError(axiosError, rejectWithValue);
        
    }
});
//  OTP verification action

export const verifyOtp = createAsyncThunk('user/verifyOtp', async({ otp, email,password, role}: {otp: string; email: string; password:string; role:string}, { rejectWithValue }) => {
    try {
        console.log("reached in verifyOtp reducer");
        const { data } = await api.post("/users/verifyotp", { otp, email, password, role });
        console.log("OTP Verification API Response:", data);
        return data;
    } catch (err: any) {
        console.error("API Error:", err);
        const axiosError = err as AxiosError<ApiError>;
        return handleError(axiosError, rejectWithValue);
        
        
    }
});

// login

export const userLogin = createAsyncThunk('/user/userLogin', async(userCredentials: IUserLoginData, {rejectWithValue}) => {
    try {
        const { data } = await api.post("/users/login", userCredentials);
        if (data.data.isBlocked) {
            return rejectWithValue("Your account has been blocked. Please contact the administrator.");
        }
        return data.data;
    } catch (err: any) {
        const axiosError = err as AxiosError<ApiError>;
        return rejectWithValue(axiosError.response?.data.message || "Login failed. Please try again.");
    }
});

//logout
export const userLogout = createAsyncThunk('user/userLogout', async(_, { rejectWithValue }) => {
    try {
      console.log("reache the api request of the of the logout")
      const { data } = await api.post("/users/logout",{});
      return data;
    } catch (err: any) {
      const axiosError = err as AxiosError<ApiError>;
      return rejectWithValue(axiosError.response?.data.message || "Logout failed. Please try again.");
    }
  });

  export const getUserDataFirst = createAsyncThunk('user/getUserDataFirst',async(_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/getUserDataFirst");
      console.log(response," data in the action")
      return response.data;
    } catch (err: any) {
      const axiosError = err as AxiosError<ApiError>;
      return rejectWithValue(axiosError.response?.data.message || "Failed to fetch user data"
      );
    }
  });
  export const isExist = createAsyncThunk('user/isExist',async(_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/isexist");
      console.log(response," data in the action")
      return response.data;
    } catch (err: any) {
      const axiosError = err as AxiosError<ApiError>;
      return rejectWithValue(axiosError.response?.data.message
      );
    }
  });

  export const updateUserProfile = createAsyncThunk('user/updateProfile', async(userData: IUserSignupData, {rejectWithValue}) => {
    try {
        console.log('here I am getting the user data in thunck', userData)
        const response = await api.put("/users/updateprofile", userData);
        console.log('success response', response)
        return response.data.data;
    } catch (error) {
        console.log('error response', error)
        return handleError(error as AxiosError<ApiError>, rejectWithValue);
    }
  });

//   instructor registration


   export const registerInstructor = createAsyncThunk('user/registerInstructor', async (instructorData: IUserSignupData, {rejectWithValue}) => {
     try {
        console.log("reached in registerInstructor reducer");
        const response = await api.put("/users/registerinstructor", instructorData);
        console.log("Instructor Registration API Response:", response);
        return response.data;
        
     } catch (err) {
        console.error("API Error:", err);
      const axiosError = err as AxiosError<ApiError>;
      return handleError(axiosError, rejectWithValue);
     }
   });

   export const getInstructorById = createAsyncThunk('user/getInstructorById', async (id: string, { rejectWithValue }) => {
    try {
      console.log("reached in getuserid action with id : ", id);
      
      const response = await api.get(`/users/getinstructorbyid/${id}`);
     
      console.log("getting the respose", response)
      return response.data.data;
      
    } catch (err: any) {
      console.log("error catched" , err)
      const axiosError = err as AxiosError<ApiError>;
      return handleError(axiosError, rejectWithValue);
    }
  });






