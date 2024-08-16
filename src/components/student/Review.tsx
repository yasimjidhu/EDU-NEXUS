import { Star } from 'lucide-react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store/store';
import { addReview, getReviews } from '../redux/slices/courseSlice';
import { toast } from 'react-toastify';
import { getAllUsers } from '../redux/slices/studentSlice';

interface ReviewProps {
    courseId: string;
}

interface Review {
    _id: string;
    userId: string;
    rating: number;
    content: string;
}

export const Review: React.FC<ReviewProps> = ({ courseId }) => {
    const [newReview, setNewReview] = useState<string>("");
    const [newRating, setNewRating] = useState<number>(0);
    const [allUsers, setAllUsers] = useState([]);
    // const [reviews, setAllReviews] = useState<any>([]);
    const dispatch: AppDispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.user);
    const { reviews } = useSelector((state: RootState) => state.course);

    const handleReviewChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setNewReview(event.target.value);
    };

    const handleRatingChange = (rating: number) => {
        setNewRating(rating);
    };

    const handlePostReview = async () => {
        if (newReview.trim() !== "" && newRating > 0 && user?._id) {
            const newReviewItem = {
                courseId,
                userId: user._id,
                rating: newRating,
                content: newReview,
            };

            try {
                await dispatch(addReview(newReviewItem));
                toast.success("Review added successfully");
                setNewReview("");
                setNewRating(0);
            } catch (error) {
                toast.error("Failed to add review");
            }
        }
    };

    useEffect(() => {
        dispatch(getAllUsers()).then((res) => setAllUsers(res.payload))
    }, []);

    
    useEffect(() => {
        dispatch(getReviews({courseId}))
    }, [dispatch,user?._id]);

    const userMap = new Map(allUsers.map(user => [user._id, user]));

    const getUserData = (id: string): any | undefined => {
        return userMap.get(id);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 mt-4">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>

            <div>
                <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
                <textarea
                    className="w-full border rounded-md p-2 mb-2"
                    placeholder="Share your thoughts..."
                    value={newReview}
                    onChange={handleReviewChange}
                ></textarea>
                <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                            key={rating}
                            className={`w-6 h-6 cursor-pointer ${rating <= newRating ? "text-yellow-500" : "text-gray-300"}`}
                            onClick={() => handleRatingChange(rating)}
                        />
                    ))}
                </div>
                <button
                    className="bg-black text-white font-semibold py-1 px-4 rounded-full"
                    onClick={handlePostReview}
                >
                    Post Review
                </button>
            </div>

            {/* Existing Reviews */}
            <div>
                <h3 className="text-lg mt-6">Student Reviews</h3>
                {reviews && reviews.length > 0 ? (
                    reviews.map((review:any) => {
                        const reviewUser = getUserData(review.userId);
                        return (
                            <div key={review?._id} className="border-t pt-4">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full border-2 border-gray-200 overflow-hidden mr-4">
                                        <img
                                            src={reviewUser?.profile?.avatar || '/assets/png/user.png'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            {`${reviewUser?.firstName} ${reviewUser?.lastName}`}
                                        </p>
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <Star
                                                    key={rating}
                                                    className={`w-5 h-5 ${rating <= review.rating ? "text-yellow-500" : "text-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 ml-16">{review?.content}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>No reviews available.</p>
                )}
            </div>
        </div>
    );
};
