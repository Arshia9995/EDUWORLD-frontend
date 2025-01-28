import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUserSignupData } from "../../interface/IUserSignup";
import { IUserLoginData } from "../../interface/IUserLogin";
import axios,  { AxiosError } from "axios";
import { baseUrl } from "../../config/constants";
import { ApiError, config, handleError } from "../../config/configuration";




export const userSignup = createAsyncThunk('user/userSignup', async(userCredentials:IUserSignupData, {rejectWithValue}) => {
    try {
        console.log("reached in userSignup reducer");
        const {data} = await axios.post(`${baseUrl}/users/signup`, userCredentials,config)
        console.log("API Response:", data);
        return data.data
        
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
        const { data } = await axios.post(`${baseUrl}/users/verify-otp`, { otp, email, password, role }, config);
        console.log("OTP Verification API Response:", data);
        return data.data;
    } catch (err: any) {
        console.error("API Error:", err);
        const axiosError = err as AxiosError<ApiError>;
        return handleError(axiosError, rejectWithValue);
        
        
    }
});

// login

export const userLogin = createAsyncThunk('/user/userLogin', async(userCredentials: IUserLoginData, {rejectWithValue}) => {
    try {
        const { data } = await axios.post(`${baseUrl}/users/login`, userCredentials, config);
        return data.data;
    } catch (err: any) {
        const axiosError = err as AxiosError<ApiError>;
        return rejectWithValue(axiosError.response?.data.message || "Login failed. Please try again.");
    }
});

//logout
export const userLogout = createAsyncThunk('user/userLogout', async(_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseUrl}/users/logout`);
      return data;
    } catch (err: any) {
      const axiosError = err as AxiosError<ApiError>;
      return rejectWithValue(axiosError.response?.data.message || "Logout failed. Please try again.");
    }
  });







