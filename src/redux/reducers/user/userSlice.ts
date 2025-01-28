import { createSlice } from "@reduxjs/toolkit";
import  {userSignup, verifyOtp, userLogin,userLogout} from "../../actions/userActions";
import { IUserSignupData } from "../../../interface/IUserSignup";
import { IUserLoginData } from "../../../interface/IUserLogin";




const userSlice = createSlice({
    name: "userSlice",
    initialState: {
      user: null as IUserSignupData | null, 
      error: null as string | null,
      loading: false as boolean,
      userDetails: null as IUserSignupData | null,
      
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
            state.OtpVerification.success = true;
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
          })
          .addCase(userLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string | null; ;
          })
           // Handle user logout
          .addCase(userLogout.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(userLogout.fulfilled, (state) => {
            state.loading = false;
            state.user = null; 
            state.error = null;
          })
          .addCase(userLogout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string | null;
          });

      },
});

export const { makeErrorDisable } = userSlice.actions;
export default userSlice.reducer;