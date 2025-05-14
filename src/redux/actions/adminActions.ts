import { createAsyncThunk } from "@reduxjs/toolkit";
import { IAdminLoginData } from "../../interface/IAdminLogin";
import axios,  { AxiosError } from "axios";
import { baseUrl } from "../../config/constants";
import { ApiError, config, handleError } from "../../config/configuration";
import { api } from "../../config/api";
import { commonRequest } from "../../config/interceptors";

 export interface AdminLoginResponse {
  _id: string;
  email: string;
  role: string;
  token?: string;
  refreshToken?: string;
}


// export const adminLogin = createAsyncThunk(
//     "admin/adminLogin",
//     async ({ email, password }: IAdminLoginData,{ rejectWithValue }) => {
//       try {
//         const response = await api.post("/admin/login" , { email, password });
//         return response.data;
//       } catch (error: any) {
//         return handleError(error as AxiosError<ApiError>, rejectWithValue);
//       }
//     }
//   );

export const adminLogin = createAsyncThunk(
  "admin/adminLogin",
  async ({ email, password }: IAdminLoginData, { rejectWithValue }) => {
    try {
     
      const response = await commonRequest<AdminLoginResponse>(
        'POST',
        '/admin/login',
        { email, password }
      );
      
     
      return response;
    } catch (error: any) {
      return handleError(error as AxiosError<ApiError>, rejectWithValue);
    }
  }
);

  export const getallStudents = createAsyncThunk(
    "admin/getallStudents",
    async(_, {rejectWithValue}) => {
        try {
            const response = await api.get("/admin/getallstudents");
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
            const response = await api.get("/admin/getallinstructors");
            
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
      const response = await api.post(
        "/admin/approveinstructor",
        { instructorId }
      
      );
      return response.data; 
    } catch (error) {
      return handleError(error as AxiosError<ApiError>, rejectWithValue);
    }
  }
);

export const rejectInstructor = createAsyncThunk(
  "admin/rejectInstructor",
  async (instructorId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/admin/rejectinstructor",
        { instructorId }
       
      );
      return response.data; 
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
        ? "/admin/unblockinstructor"
        : "/admin/blockinstructor";
      const response = await api.put(url, { instructorId });
      return response.data.instructor;
    } catch (error) {
      return handleError(error as AxiosError<ApiError>, rejectWithValue);
    }
  }
);

export const logoutAdminAction = createAsyncThunk(
  "admin/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/adminlogout", {});
      return response.data;
    } catch (error: any) {
      return handleError(error as AxiosError<ApiError>, rejectWithValue);
    }
  }
);

export const addCategory = createAsyncThunk(
  "admin/addCategory",
  async (categoryName: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/addcategory", { categoryName });
      return response.data; // { message: "Category added successfully", category: {...} }
    } catch (error: any) {
      return handleError(error as AxiosError<ApiError>, rejectWithValue);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "admin/updateCategory",
  async ({ id, categoryName }: { id: string; categoryName: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/editcategory/${id}`, { categoryName });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update category");
    }
  }
);




// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { IAdminLoginData } from "../../interface/IAdminLogin";
// import { commonRequest, ApiResponse } from "../../config/axiosinterceptors";
// import { AxiosError } from "axios";
// import { handleError, ApiError } from "../../config/configuration";

// export const adminLogin = createAsyncThunk(
//   "admin/adminLogin",
//   async ({ email, password }: IAdminLoginData, { rejectWithValue }) => {
//     try {
//       const response = await commonRequest<any, IAdminLoginData>(
//         "POST",
//         "/admin/login",
//         { email, password }
//       );
//       return response.data;
//     } catch (error: any) {
//       return handleError(error as AxiosError<ApiError>, rejectWithValue);
//     }
//   }
// );

// export const getallStudents = createAsyncThunk(
//   "admin/getallStudents",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await commonRequest<{ students: any[] }>("GET", "/admin/getallstudents");
//       return response.data.students;
//     } catch (error) {
//       return handleError(error as AxiosError<ApiError>, rejectWithValue);
//     }
//   }
// );

// export const getallInstructors = createAsyncThunk(
//   "admin/getallInstructors",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await commonRequest<{ instructors: any[]; message: string }>(
//         "GET",
//         "/admin/getallinstructors"
//       );
//       if (response.data.instructors) {
//         return response.data.instructors;
//       } else {
//         return rejectWithValue(response.data.message);
//       }
//     } catch (error) {
//       return handleError(error as AxiosError<ApiError>, rejectWithValue);
//     }
//   }
// );

// export const approveInstructor = createAsyncThunk(
//   "admin/approveInstructor",
//   async (instructorId: string, { rejectWithValue }) => {
//     try {
//       const response = await commonRequest<any, { instructorId: string }>(
//         "POST",
//         "/admin/approveinstructor",
//         { instructorId }
//       );
//       return response.data;
//     } catch (error) {
//       return handleError(error as AxiosError<ApiError>, rejectWithValue);
//     }
//   }
// );

// export const rejectInstructor = createAsyncThunk(
//   "admin/rejectInstructor",
//   async (instructorId: string, { rejectWithValue }) => {
//     try {
//       const response = await commonRequest<any, { instructorId: string }>(
//         "POST",
//         "/admin/rejectinstructor",
//         { instructorId }
//       );
//       return response.data;
//     } catch (error) {
//       return handleError(error as AxiosError<ApiError>, rejectWithValue);
//     }
//   }
// );

// export const blockUnblockInstructor = createAsyncThunk(
//   "admin/blockUnblockInstructor",
//   async (
//     { instructorId, isBlocked }: { instructorId: string; isBlocked: boolean },
//     { rejectWithValue }
//   ) => {
//     try {
//       const url = isBlocked ? "/admin/unblockinstructor" : "/admin/blockinstructor";
//       const response = await commonRequest<{ instructor: any }, { instructorId: string }>(
//         "PUT",
//         url,
//         { instructorId }
//       );
//       return response.data.instructor;
//     } catch (error) {
//       return handleError(error as AxiosError<ApiError>, rejectWithValue);
//     }
//   }
// );

// export const logoutAdminAction = createAsyncThunk(
//   "admin/logoutAdmin",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await commonRequest<any, {}>("POST", "/admin/adminlogout", {});
//       return response.data;
//     } catch (error: any) {
//       return handleError(error as AxiosError<ApiError>, rejectWithValue);
//     }
//   }
// );

// export const addCategory = createAsyncThunk(
//   "admin/addCategory",
//   async (categoryName: string, { rejectWithValue }) => {
//     try {
//       const response = await commonRequest<any, { categoryName: string }>(
//         "POST",
//         "/admin/addcategory",
//         { categoryName }
//       );
//       return response.data;
//     } catch (error: any) {
//       return handleError(error as AxiosError<ApiError>, rejectWithValue);
//     }
//   }
// );

// export const updateCategory = createAsyncThunk(
//   "admin/updateCategory",
//   async ({ id, categoryName }: { id: string; categoryName: string }, { rejectWithValue }) => {
//     try {
//       const response = await commonRequest<any, { categoryName: string }>(
//         "PUT",
//         `/admin/editcategory/${id}`,
//         { categoryName }
//       );
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Failed to update category");
//     }
//   }
// );