import * as yup from 'yup';

export const OtpValidationSchema = yup.object({
    otp: yup
      .string()
      .required("OTP is required")
      .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
  });