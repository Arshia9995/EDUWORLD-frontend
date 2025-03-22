import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import InstructorSidebar from '../../../common/InstructorSidebar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from '../../../config/constants';

function InstructorAddCourse() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ _id: string; categoryName: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Function to upload the thumbnail to S3 (copied from Profile.tsx)
  const uploadToS3 = async (file: File) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/users/get-s3-url`,
        {
          fileName: file.name,
          fileType: file.type,
          folder: 'thumbnails', // Specify the folder for thumbnails

        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // Include cookies for authentication
        }
      );
      console.log('Received S3 URL response:', data);
      if (!data.url) {
        console.error('No S3 URL received:', data);
        throw new Error('Failed to get S3 URL');
      }

      await axios.put(data.url, file, {
        headers: { 'Content-Type': file.type },
      });
      console.log('File successfully uploaded to S3:', data.imageUrl);

      return { permanentUrl: data.imageUrl, downloadUrl: data.downloadUrl };
    } catch (error: any) {
      console.error('S3 upload error:', error.response?.data || error.message);
      throw new Error('Failed to upload thumbnail to S3');
    }
  };

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/fetchallcategories', {
          withCredentials: true, // Send cookies with the request
        });
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setCategories(response.data);
        } else {
          setError('No categories available. Please add a category first.');
        }
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(
          err.response?.data?.message || 'Failed to load categories. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const initialValues = {
    title: '',
    description: '',
    category: '', // Will be set after categories load
    price: '',
    language: '',
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
      // Validate thumbnail
      if (!thumbnail) {
        setThumbnailError('Thumbnail is required');
        toast.error('Please upload a thumbnail');
        return;
      }

      // Upload thumbnail to S3
      const { permanentUrl } = await uploadToS3(thumbnail);

      // Prepare course data (excluding instructor, which is set by backend)
      const courseData = {
        title: values.title,
        description: values.description,
        category: values.category,
        price: values.price,
        language: values.language,
        thumbnail: permanentUrl, // Include the S3 permanent URL
      };

      // Submit to backend
      const response = await api.post('/users/addcourse', courseData, {
        withCredentials: true, // Send cookies with the request
      });

      const createdCourse = response.data.course;
      toast.success('Course added successfully');
      // Navigate to the next page with the created course ID
      navigate('/instructoraddlesson', {
        state: { courseId: createdCourse._id },
      });
    } catch (err: any) {
      console.error('Error submitting course:', err);
      setError(err.response?.data?.message || 'Failed to create course. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setThumbnailError('Please upload an image file');
        toast.error('Please upload an image file');
        return;
      }
      // Validate file size (e.g., max 5MB)
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
        className={`flex-1 min-h-screen transition-all duration-300`}
        style={{ marginLeft: sidebarOpen ? '16rem' : '5rem' }}
      >
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-2xl font-bold text-[#1e3a8a]">Course Management</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-[#1e3a8a]" />
            </button>
          </div>
        </div>

        <div className="pt-2 pr-8 pb-2 pl-8">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8">Add New Course</h2>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {loading ? (
            <p className="text-gray-500">Loading categories...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Formik
              initialValues={{
                ...initialValues,
                category: categories.length > 0 ? categories[0]._id : '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form className="bg-white rounded-lg shadow-sm p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Course Thumbnail */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Course Thumbnail</h3>
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

                    {/* Right Column - Form Fields */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                        <Field
                          type="text"
                          name="title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter course title"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <Field
                          as="textarea"
                          name="description"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter course description"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                          <Field
                            type="number"
                            name="price"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          {categories.length === 0 ? (
                            <p className="text-gray-500">No categories available</p>
                          ) : (
                            <Field
                              as="select"
                              name="category"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                          <Field
                            type="text"
                            name="language"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter language (e.g., English)"
                          />
                          <ErrorMessage
                            name="language"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || loading || categories.length === 0}
                        className={`w-full py-3 px-4 rounded-md flex items-center justify-center gap-2 mt-6 ${
                          isSubmitting || loading || categories.length === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#1e3a8a] text-white hover:bg-blue-800'
                        } transition-colors`}
                      >
                        {isSubmitting ? 'Submitting...' : 'Next'}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorAddCourse;