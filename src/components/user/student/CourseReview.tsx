// CourseReview.tsx - Component for adding a review
import React, { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import { api } from '../../../config/api';
import toast from 'react-hot-toast';

interface CourseReviewProps {
  courseId: string;
  studentId?: string;
  onReviewAdded?: () => void;
}

const CourseReview: React.FC<CourseReviewProps> = ({ courseId, studentId, onReviewAdded }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);

  // Check if user has already reviewed this course
  useEffect(() => {
    const checkExistingReview = async () => {
      if (!studentId || !courseId) return;
      
      try {
        const response = await api.get(`/reviews/course/${courseId}/student/${studentId}`, {
          withCredentials: true
        });
        
        if (response.data?.review) {
          setHasReviewed(true);
          setRating(response.data.review.rating);
          setReviewText(response.data.review.reviewText);
          toast.success('You have already reviewed this course. You can update your review.');
        }
      } catch (error) {
        // No review exists or other error
        setHasReviewed(false);
      }
    };
    
    checkExistingReview();
  }, [courseId, studentId]);

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
      let response;
      
      if (hasReviewed) {
        // Update existing review
        response = await api.put(
          `/reviews/${courseId}`,
          { rating, reviewText },
          { withCredentials: true }
        );
        toast.success('Review updated successfully');
      } else {
        // Add new review
        response = await api.post(
          `/reviews`,
          { courseId, rating, reviewText },
          { withCredentials: true }
        );
        toast.success('Review submitted successfully');
        setHasReviewed(true);
      }
      
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error: any) {
      console.error('Error with review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {hasReviewed ? 'Update Your Review' : 'Rate and Review'}
      </h3>
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <FiStar
              key={index}
              className={`h-6 w-6 cursor-pointer ${
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
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        placeholder="Write your review"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors ${
          submitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {submitting ? 'Submitting...' : hasReviewed ? 'Update Review' : 'Submit Review'}
      </button>
    </div>
  );
};

export default CourseReview;