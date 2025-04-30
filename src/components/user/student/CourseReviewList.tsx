import React, { useState, useEffect } from 'react';
import { FiStar, FiUser } from 'react-icons/fi';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email?: string;
    profile?: {
      profileImage?: string;
    }
  };
  rating: number;
  reviewText: string;
  createdAt: string;
}

interface CourseReviewsListProps {
  courseId: string;
  reviewSubmitted?: boolean;  // Add this new prop
}

const CourseReviewsList: React.FC<CourseReviewsListProps> = ({ courseId, reviewSubmitted }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/courses/${courseId}/getreviews`, {
        withCredentials: true,
      });

      // Always set reviews to the data we received or empty array
      const reviewsData = response.data.reviews || [];
      setReviews(reviewsData);
      
      // Calculate average rating
      if (reviewsData.length > 0) {
        const totalRating = reviewsData.reduce((sum: number, review: Review) => sum + review.rating, 0);
        setAverageRating(totalRating / reviewsData.length);
      }

      // Only set error if it's a true error, not just empty reviews
      if (response.status !== 200 && !response.data.message.includes("No reviews")) {
        throw new Error(response.data.message || 'Failed to fetch reviews');
      }
      
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      // Only show toast for real errors
      const errorMessage = err.response?.data?.message || 'Failed to fetch reviews';
      if (!errorMessage.includes("No reviews")) {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews when component mounts or when reviewSubmitted changes
  useEffect(() => {
    if (courseId) {
      fetchReviews();
    }
  }, [courseId, reviewSubmitted]);  // Added reviewSubmitted to dependency array

  // Rest of the component stays the same
  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error}</p>
        <button 
          onClick={fetchReviews} 
          className="mt-2 text-blue-600 hover:underline text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Course Reviews</h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <FiStar
                  key={index}
                  className={`h-4 w-4 ${
                    index < Math.round(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
          <p>No reviews added yet for this course.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {review.studentId.name}
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <FiStar
                        key={index}
                        className={`h-4 w-4 ${
                          index < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{review.reviewText}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseReviewsList;