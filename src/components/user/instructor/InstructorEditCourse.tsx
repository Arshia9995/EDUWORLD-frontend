import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import InstructorSidebar from '../../../common/InstructorSidebar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from '../../../config/constants';

interface Category {
  _id: string;
  categoryName: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: { _id: string; categoryName: string };
  price: number;
  language: string;
  duration?: string;
  lessons: string[];
  rating?: number;
  isPublished: boolean;
  instructor: { _id: string; name: string };
  isBlocked: boolean;
}

const InstructorEditCourse: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);

  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

 
  const uploadToS3 = async (file: File) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/users/get-s3-url`,
        {
          fileName: file.name,
          fileType: file.type,
          folder: 'thumbnails',
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (!data.url) {
        throw new Error('Failed to get S3 URL');
      }

      await axios.put(data.url, file, {
        headers: { 'Content-Type': file.type },
      });

      return { permanentUrl: data.imageUrl, downloadUrl: data.downloadUrl };
    } catch (error: any) {
      console.error('S3 upload error:', error.response?.data || error.message);
      throw new Error('Failed to upload thumbnail to S3');
    }
  };

  
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) {
        setError('Course ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        
        const courseResponse = await api.get(`/users/getcoursebyid/${courseId}`, {
          withCredentials: true,
        });
        if (courseResponse.status !== 200) {
          throw new Error(courseResponse.data.message || 'Failed to fetch course details');
        }
        const courseData = courseResponse.data.course;
        setCourse(courseData);
        setPreviewUrl(courseData.thumbnail || null);

        
        const categoriesResponse = await api.get('/users/fetchallcategories', {
          withCredentials: true,
        });
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data) && categoriesResponse.data.length > 0) {
          setCategories(categoriesResponse.data);
        } else {
          setError('No categories available. Please add a category first.');
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const initialValues = {
    title: course?.title || '',
    description: course?.description || '',
    category: course?.category?._id || '',
    price: course?.price?.toString() || '',
    language: course?.language || '',
    isPublished: course?.isPublished || false,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Course title is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number()
      .required('Price is required')
      .min(0, 'Price must be greater than or equal to 0'),
    category: Yup.string().required('Category is required'),
    language: Yup.string().required('Language is required'),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      
      if (!thumbnail && !previewUrl) {
        setThumbnailError('Thumbnail is required');
        toast.error('Please upload a thumbnail');
        return;
      }
  
      
      let thumbnailUrl = previewUrl;
      const courseData: Partial<{
        title: string;
        description: string;
        category: string;
        price: number;
        language: string;
        thumbnail: string;
        isPublished: boolean;
      }> = {
        title: values.title,
        description: values.description,
        category: values.category,
        price: parseFloat(values.price),
        language: values.language,
        isPublished: values.isPublished,
      };
  
      if (thumbnail) {
        const { permanentUrl } = await uploadToS3(thumbnail);
        thumbnailUrl = permanentUrl;
        courseData.thumbnail = thumbnailUrl || ''; 
      }
  
      
      const response = await api.put(`/users/updatecourse/${courseId}`, courseData, {
        withCredentials: true,
      });
  
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to update course');
      }

      // if(!response.data.success){
      //   toast.error(response.data.error)
      //   return;
      // }
  
      toast.success('Course updated successfully');
      navigate(`/instructor/editlessons/${courseId}`);
      // navigate("/instructorcourses")
    } catch (err: any) {
      console.error('Error updating course:', err);
      setError(err.response?.data?.message || 'Failed to update course. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to update course');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        setThumbnailError('Please upload an image file');
        toast.error('Please upload an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setThumbnailError('File size must be less than 5MB');
        toast.error('File size must be less than 5MB');
        return;
      }
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file));
      setThumbnailError(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <InstructorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="flex-1 min-w-0"
        style={{
          marginLeft: sidebarOpen ? '16rem' : '5rem',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/instructorcourses')}
              className="p-2 rounded-full text-blue-900 hover:bg-blue-50 mr-4"
            >
              <FiArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-blue-900">Edit Course</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full text-blue-900 hover:bg-blue-50 relative">
              <FiMessageSquare className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-medium">
              ID
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Edit Your Course</h1>
            <p className="text-gray-600">Update the details of your course below</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mb-4"></div>
              <p className="text-gray-600">Loading course details...</p>
            </div>
          ) : !course ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Course Not Found</h3>
              <p className="text-gray-600 mb-6">The course you are trying to edit does not exist.</p>
            </div>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Thumbnail Section */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Course Thumbnail</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 aspect-video flex items-center justify-center relative overflow-hidden">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Course thumbnail preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Click to upload thumbnail</p>
                          </div>
                        )}
                        <input
                          type="file"
                          id="thumbnail"
                          name="thumbnail"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      {thumbnailError && (
                        <div className="text-red-500 text-sm mt-1">{thumbnailError}</div>
                      )}
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                          Course Title
                        </label>
                        <Field
                          type="text"
                          id="title"
                          name="title"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                          placeholder="Enter course title"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                          Description
                        </label>
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          rows={4}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                          placeholder="Enter course description"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                        Category
                      </label>
                      {categories.length === 0 ? (
                        <p className="text-gray-500">No categories available</p>
                      ) : (
                        <Field
                          as="select"
                          id="category"
                          name="category"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.categoryName}
                            </option>
                          ))}
                        </Field>
                      )}
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
                        Price (₹)
                      </label>
                      <Field
                        type="number"
                        id="price"
                        name="price"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                      />
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="language">
                        Language
                      </label>
                      <Field
                        type="text"
                        id="language"
                        name="language"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                        placeholder="Enter language (e.g., English)"
                      />
                      <ErrorMessage
                        name="language"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="flex items-center mt-6">
                        <Field
                          type="checkbox"
                          name="isPublished"
                          className="h-5 w-5 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                          checked={values.isPublished}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFieldValue('isPublished', e.target.checked)
                          }
                        />
                        <span className="ml-2 text-gray-700 font-medium">Publish Course</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-8 flex space-x-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || loading || categories.length === 0}
                      className={`py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${
                        isSubmitting || loading || categories.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-900 text-white hover:bg-blue-800'
                      } transition-colors`}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Course'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/instructorcourses')}
                      className="py-3 px-6 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorEditCourse;