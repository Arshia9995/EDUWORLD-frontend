import { createSlice } from "@reduxjs/toolkit";
import  {userSignup, verifyOtp, userLogin,userLogout, updateUserProfile, getUserDataFirst, isExist, registerInstructor} from "../../actions/userActions";
import { IUserSignupData } from "../../../interface/IUserSignup";
import { IUserLoginData } from "../../../interface/IUserLogin";
import { IUserData } from "../../../interface/IUserData";



const userSlice = createSlice({
    name: "userSlice",
    initialState: { 
      user: null as IUserSignupData | null, 
      error: null as string | null,
      loading: false as boolean,
      userDetails: null as IUserSignupData | null,
      
      // isExistData: null as IUserData | null,

      OtpVerification: {
        loading: false,
        success: false,
        error: null as string | null,
      },
      messages: null as any | null,
     
    },
    reducers: {
        makeErrorDisable: (state) => {
          state.error = null;
        },
      },
      extraReducers: (builder) => {
        builder
          .addCase(userSignup.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(userSignup.fulfilled, (state, action: any) => {
            console.log(action.payload,"payload in user signup ---------------------------");
            
            state.loading = false;
            state.user = action.payload as IUserSignupData;
            state.error = null;
          })
          .addCase(userSignup.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload as string

          })
          // OTP verification actions
          .addCase(verifyOtp.pending, (state) => {
            state.OtpVerification.loading = true;
            state.OtpVerification.error = null;
          })
          .addCase(verifyOtp.fulfilled, (state, action) => {
            state.OtpVerification.loading = false;
            state.OtpVerification.success = action.payload.success;
            state.OtpVerification.error = null;
          })
          .addCase(verifyOtp.rejected, (state, action) => {
            state.OtpVerification.loading = false;
            state.OtpVerification.success = false;
            state.OtpVerification.error = action.payload as string;
          })
          .addCase(userLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(userLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
          })
          .addCase(userLogin.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            state.error = action.payload as string | null; ;
          })
          // Handle user logout
          .addCase(userLogout.pending, (state) => {
            console.log("pending in logout")

            state.loading = true;
            state.error = null;
          })
           .addCase(userLogout.fulfilled, (state) => {
            console.log("fullfilled in logout")
             state.loading = false;
             state.user = null; 
             state.OtpVerification.success = false;
             state.error = null;
           })
          .addCase(userLogout.rejected, (state, action) => {
            console.log("reject in logout")

            state.loading = false;
            state.error = action.payload as string | null;
          })
          .addCase(updateUserProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(updateUserProfile.fulfilled, (state, action) => {
            console.log(action,"action after saving")
            state.loading = false;
            state.user = action.payload as IUserSignupData
            state.error = null;
          })
          .addCase(updateUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          .addCase(getUserDataFirst.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getUserDataFirst.fulfilled, (state,action) => {
            state.loading = false;
            state.user = action.payload.data; 
            state.error = null;
          })
          .addCase(getUserDataFirst.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string | null;
          })
          .addCase(registerInstructor.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(registerInstructor.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data // Update user with new data
            state.error = null;
          })
          .addCase(registerInstructor.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          });

      },
});

export const { makeErrorDisable } = userSlice.actions;
export default userSlice.reducer;