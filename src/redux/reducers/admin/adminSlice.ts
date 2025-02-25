import { createSlice } from "@reduxjs/toolkit";
import { IAdminLoginData } from "../../../interface/IAdminLogin";
import { adminLogin ,getallStudents, getallInstructors, approveInstructor, rejectInstructor} from "../../actions/adminActions";
import { IStudentData } from "../../../interface/IStudent";
import { IInstructorData } from "../../../interface/IInstructor";



interface AdminState {
    admin :IAdminLoginData | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    students: IStudentData[]; 
    studentLoading: boolean;
    studentError: string | null;
    instructors: IInstructorData[]; // Added instructors array
    instructorLoading: boolean;    // Added instructor loading state
    instructorError: string | null;
  }

  const initialState: AdminState = {
    admin: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    students: [], 
    studentLoading: false,
    studentError: null,
    instructors: [],
    instructorLoading: false,
    instructorError: null,
  };


const adminSlice = createSlice({
    name:"adminSlice",
    initialState,
    reducers: {
        logoutAdmin: (state) => {
            state.admin = null;
            state.isAuthenticated = false;
            state.loading = false; 
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(adminLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(adminLogin.fulfilled, (state, action) => {
           
            state.loading = false;
            state.admin = action.payload.admin as IAdminLoginData;
            state.isAuthenticated = true;
            state.error = null;
          })
          .addCase(adminLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          .addCase(getallStudents.pending, (state) => {
            state.studentLoading = true;
            state.studentError = null;
        })
        .addCase(getallStudents.fulfilled, (state, action) => {
            state.studentLoading = false;
            state.students = action.payload as IStudentData[];
        })
        .addCase(getallStudents.rejected, (state, action) => {
            state.studentLoading = false;
            state.studentError = action.payload as string;
        })
        .addCase(getallInstructors.pending, (state) => {
            state.instructorLoading = true;
            state.instructorError = null;
          })
          .addCase(getallInstructors.fulfilled, (state, action) => {
            state.instructorLoading = false;
            state.instructors = action.payload as IInstructorData[];
          })
          .addCase(getallInstructors.rejected, (state, action) => {
            state.instructorLoading = false;
            state.instructorError = action.payload as string;
          })
          .addCase(approveInstructor.pending, (state) => {
            state.instructorLoading = true;
            state.instructorError = null;
          })
          .addCase(approveInstructor.fulfilled, (state, action) => {
            state.instructorLoading = false;
            state.instructors = action.payload as IInstructorData[]; // Replace entire array
          })
          .addCase(approveInstructor.rejected, (state, action) => {
            state.instructorLoading = false;
            state.instructorError = action.payload as string;
          })
          .addCase(rejectInstructor.pending, (state) => {
            state.instructorLoading = true;
            state.instructorError = null;
          })
          .addCase(rejectInstructor.fulfilled, (state, action) => {
            state.instructorLoading = false;
            state.instructors = action.payload as IInstructorData[]; // Replace entire array
          })
          .addCase(rejectInstructor.rejected, (state, action) => {
            state.instructorLoading = false;
            state.instructorError = action.payload as string;
          });

    },


    
});

export const { logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
