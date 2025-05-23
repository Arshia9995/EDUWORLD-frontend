import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { updateUserProfile } from '../../redux/actions/userActions';
import { toast } from 'react-toastify';
import { Camera, User, Mail, Phone, MapPin, Calendar, Settings, LogOut } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { baseUrl } from '../../config/constants';


const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user ?? {});
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadToS3 = async (file: File) => {
    try {
      const { data } = await axios.post(`${baseUrl}/users/get-s3-url`, {
        fileName: file.name,
        fileType: file.type,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Received S3 URL response:", data);
      if (!data.url) {
        console.error("No S3 URL received:", data);
        throw new Error('Failed to get S3 URL');
      }

      await axios.put(data.url, file, {
        headers: { 'Content-Type': file.type },
      });
      console.log("File successfully uploaded to S3:", data.imageUrl);

      setProfileImageUrl(data.downloadUrl);

      // console.log("profileimage",user?.profile?.profileImage);
      return { permanentUrl: data.imageUrl, downloadUrl: data.downloadUrl };
    
      
    } catch (error: any) {
      console.error('S3 upload error:', error.response?.data || error.message);
      throw new Error('Failed to upload image to S3');
    }
  };

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.profile?.phone || '',
      dob: user?.profile?.dob || '',
      address: user?.profile?.address || '',
      gender: user?.profile?.gender || '',
      profileImage: user?.profile?.profileImage  || '',
      
    },
    enableReinitialize: true, 
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().matches(/^\d+$/, 'Phone number must be numeric').min(10, 'Must be at least 10 digits').required('Phone number is required'),
      dob: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of Birth cannot be in the future')
    .test(
      'is-18-or-older',
      'You must be at least 18 years old',
      (value) => {
        if (!value) return false;
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          return age - 1 >= 18;
        }
        return age >= 18;
      }
    ),
      address: Yup.string().required('Address is required'),
      gender: Yup.string().required('Please select a gender'),
    }),
    onSubmit: async (values) => {
      console.log('Form values', values);
      setLoading(true);
      try {
        let updatedValues = { ...values };

        if (!file && JSON.stringify(values) === JSON.stringify(formik.initialValues)) {
          toast.info("No changes detected.");
          setLoading(false);
          return;
        }

        if (file) {
          const { permanentUrl } = await uploadToS3(file);         
          updatedValues.profileImage = permanentUrl; 
          // formik.setFieldValue("profileImage", downloadUrl); // Use download URL for display
        

        }

        await dispatch(updateUserProfile(updatedValues)).unwrap();
        toast.success('Profile updated successfully');
      } catch (error: any) {
        toast.error(error?.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    },
  });

  
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user?.profile?.profileImage) {
        try {
          
          const fullPath = user.profile.profileImage;
          const fileName = fullPath.split('/').pop();
          
          if (!fileName) {
            console.error("Could not extract filename from path:", fullPath);
            return;
          }
          
          console.log("Fetching downloadUrl for fileName:", fileName);

          
          const { data } = await axios.post(`${baseUrl}/users/get-s3-url`, {
            fileName: fileName,
            fileType: "image/*",
            getUrl: true  
        });
          
          console.log("Received downloadUrl:", data.downloadUrl);
          setProfileImageUrl(data.downloadUrl);
        } catch (error) {
          console.error("Error fetching downloadUrl:", error);
          toast.error("Failed to load profile image");
        }
      }
    };

    fetchProfileImage();
  }, [user]);

  console.log("User state:", user);
  console.log("formikvalues",formik.values);
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
              </div>
              <nav className="space-y-3">
                <button className="w-full flex items-center px-4 py-2.5 text-left bg-blue-50 text-blue-600 rounded-lg font-medium">
                  <User className="mr-3 h-5 w-5" />
                  Profile
                </button>
                <button className="w-full flex items-center px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </button>
                <button className="w-full flex items-center px-4 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-lg font-medium">
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Profile Information</h1>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}>
                <div className="p-6">
                  <div className="max-w-2xl space-y-8">
                    {/* Profile Photo */}
                    <div className="flex justify-center py-4">
                      <div className="relative">
                        <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow overflow-hidden">
                        {previewUrl ? (
                         <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                         ) : profileImageUrl ? (
                        <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                         ) : (
                        <Camera className="w-16 h-16 text-gray-400" />
                         )}
                        </div>
                        <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transition-colors">
                          <Camera className="w-5 h-5" />
                          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            <User className="w-4 h-4 mr-2" />
                            Full Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            {...formik.getFieldProps('name')}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your full name"
                          />
                          {formik.touched.name && formik.errors.name ? (
                            <div className="text-red-500 text-sm">{formik.errors.name}</div>
                          ) : null}
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            <Mail className="w-4 h-4 mr-2" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            {...formik.getFieldProps('email')}
                            readOnly
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            <Phone className="w-4 h-4 mr-2" />
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            type="text"
                            {...formik.getFieldProps('phone')}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your phone number"
                          />
                          {formik.touched.phone && formik.errors.phone ? (
                            <p className="text-red-500 text-sm">{formik.errors.phone}</p>
                          ) : null}
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            <Calendar className="w-4 h-4 mr-2" />
                            Date of Birth
                          </label>
                          <input
                            id="dob"
                            type="date"
                            {...formik.getFieldProps('dob')}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {formik.touched.dob && formik.errors.dob ? (
                            <p className="text-red-500 text-sm">{formik.errors.dob}</p>
                          ) : null}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <MapPin className="w-4 h-4 mr-2" />
                          Address
                        </label>
                        <textarea
                          id="address"
                          {...formik.getFieldProps('address')}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your full address"
                        />
                        {formik.touched.address && formik.errors.address ? (
                          <p className="text-red-500 text-sm">{formik.errors.address}</p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Gender
                        </label>
                        <select
                          id="gender"
                          {...formik.getFieldProps('gender')}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {formik.touched.gender && formik.errors.gender ? (
                          <p className="text-red-500 text-sm">{formik.errors.gender}</p>
                        ) : null}
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;