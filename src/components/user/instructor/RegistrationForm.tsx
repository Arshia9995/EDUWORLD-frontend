import React, { useState } from "react";
import { Camera } from "lucide-react"; 
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerInstructor } from "../../../redux/actions/userActions";
import toast from "react-hot-toast";
import { useNavigate  } from "react-router-dom";


// Validation schema
const validationSchema = Yup.object({
    dob: Yup.string().required("Date of Birth is required"),
    gender: Yup.string()
      .oneOf(["male", "female", "other"], "Invalid gender selection")
      .required("Gender is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    qualification: Yup.string().required("Qualification is required"),
    // cv: Yup.mixed()
    //   .required("CV is required")
    //   .test("fileType", "Only PDF files are allowed", (value: any) => {
    //     return value && value.type === "application/pdf";
    //   }),
    // profile_picture: Yup.mixed().test(
    //   "fileType",
    //   "Only image files (jpg, jpeg, png) are allowed",
    //   (value: any) => {
    //     if (!value) return true; // Optional field
    //     return value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    //   }
    // ),
  });

const RegistrationForm: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.user); 
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: user?.name || "", // Pre-fill name from Redux
      email: user?.email || "", // Pre-fill email from Redux
      dob: "",
      gender: "" as "" | "male" | "female" | "other",
      phone: "",
      address: "",
      qualification: "",
    //   cv: null as File | null,
    //   profile_picture: null as File | null,
    },
    validationSchema,
    onSubmit: async(values) => {
    //   console.log("Form Submitted:", values);

    try {
        const result = await dispatch(registerInstructor(values)).unwrap();
        if (result.success) {
            toast.success("Your request is under processing for verification");
          navigate("/"); // Redirect after success
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to register instructor");
      }
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-950/90 to-blue-950/90">
      <div className="relative w-full max-w-xl mx-auto px-4 py-8 z-10">
        <div className="bg-blue-950 rounded-t-lg p-6 shadow-2xl border-t-4 border-t-yellow-500">
          <h2 className="text-3xl font-bold text-white text-center">
            Instructor Registration
          </h2>
          <p className="text-center text-gray-300 mt-2">
            Please fill in your details to register as an instructor
          </p>
        </div>

        <div className="bg-white rounded-b-lg p-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Profile Picture Upload with Camera Icon */}
            <div className="flex justify-center">
              <label className="relative w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer overflow-hidden group">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">Upload</span>
                )}

                {/* Camera Icon (Visible on Hover) */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white w-6 h-6" />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                readOnly
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                readOnly
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formik.values.dob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              />
              {formik.touched.dob && formik.errors.dob && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.dob}</p>
              )}
            </div>

            {/* Gender Selection */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.gender}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              />
              {formik.touched.address && formik.errors.address && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.address}</p>
              )}
            </div>

            {/* Qualification */}
            <div>
              <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                Qualification
              </label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={formik.values.qualification}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              />
              {formik.touched.qualification && formik.errors.qualification && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.qualification}</p>
              )}
            </div>

            {/* CV Upload */}
            <div>
              <label htmlFor="cv" className="block text-sm font-medium text-gray-700">
                Upload CV (PDF only)
              </label>
              <input
                type="file"
                id="cv"
                 name="cv"
                accept=".pdf"
                onChange={(event) => formik.setFieldValue("cv", event.target.files?.[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-yellow-500 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
            {formik.isSubmitting ? "Submitting..." : "Register as Instructor"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
