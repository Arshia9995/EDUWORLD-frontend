import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';

interface CourseRatingReviewProps {
  courseId: string;
  studentId?: string;
}

const CourseReview: React.FC<CourseRatingReviewProps> = ({ courseId, studentId }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!studentId) {
      toast.error('You must be logged in to submit a review');
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please provide a review');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(
        `/users/courses/${courseId}/reviews`,
        { courseId, rating, reviewText },
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success('Review submitted successfully');
        setRating(0);
        setReviewText('');
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit review';
      toast.error(errorMessage);

      if (errorMessage === 'You have already reviewed this course') {
        setRating(0);
        setReviewText('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-5 w-80 mt-4">
      <h3 className="text-sm font-bold text-gray-800 mb-2">Rate This Course</h3>
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <FiStar
              key={index}
              className={`h-4 w-5 cursor-pointer ${
                ratingValue <= (hover || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
              onClick={() => setRating(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          );
        })}
      </div>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
        rows={2}
        placeholder="Write a brief review"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`mt-2 px-2 py-1 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors text-xs ${
          submitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default CourseReview;