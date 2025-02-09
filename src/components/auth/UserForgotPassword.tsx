import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast"; // ✅ Fixed import
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../config/constants";

const UserForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const handleSubmit = async (
    values: { email: string },
    { setSubmitting }: any
  ) => {
    try {
      const response = await axios.post(
        `${baseUrl}/users/forgotpassword`,
        values
      );

      // ✅ Show toast only if response is successful
      if (response.status === 200) {
        toast.success(response.data.message || "OTP sent successfully!");

        setTimeout(() => {
          navigate("/forgototp")
        }, 2000);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("Email not registered. Please check and try again.");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }

    setSubmitting(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundColor: "#1E40AF" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-950/90 bg-opacity-75"></div>

      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-8 z-10">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Forgot Password?
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your registered email address to receive the OTP.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* ✅ Use <Form> instead of <form> */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                {/* ✅ Added name="email" */}
                <Field
                  // type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  // required
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-500 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {isSubmitting ? "Sending..." : "Send OTP"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-gray-600 mt-4">
          Remembered your password?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserForgotPassword;
