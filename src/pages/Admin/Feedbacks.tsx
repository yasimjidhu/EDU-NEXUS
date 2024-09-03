import React, { useEffect, useState } from 'react';
import { FeedbackEntity } from '../../types/feedback';
import { AppDispatch } from '../../components/redux/store/store';
import { useDispatch } from 'react-redux';
import { getFeedbacks } from '../../components/redux/slices/studentSlice';

interface FeedbackCardProps {
    feedback: FeedbackEntity;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
    const formatDate = (date: Date | undefined) => {
        if (!date) return '';
        return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(date));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition ease-in-out duration-150 h-80 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{feedback.subject}</h2>
            </div>
            <div className="flex-grow overflow-y-auto">
                <p className="text-gray-700 mb-4">{feedback.message}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                    <img
                        src={feedback.image || '/default-avatar.png'} // Fallback image if feedback.image is not available
                        alt={`${feedback.name}'s avatar`}
                        className="w-10 h-10 rounded-full object-cover mr-4"
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-800">{feedback.name}</p>
                        <p className="text-sm text-gray-500">{feedback.email}</p>
                    </div>
                </div>
                <div>
                    <span className="text-sm text-gray-500">{formatDate(feedback.createdAt)}</span>
                </div>
            </div>
        </div>
    );
};

interface FeedbackListProps {
    feedbacks: FeedbackEntity[];
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks }) => {
    return (
        <div className="max-w-6xl mx-auto ">
            <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">User Feedback</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {feedbacks.map((feedback, index) => (
                    <div key={index}>
                        <FeedbackCard feedback={feedback} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const FeedbackPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [feedbacks, setFeedbacks] = useState<FeedbackEntity[]>([]);

    useEffect(() => {
        dispatch(getFeedbacks())
            .unwrap()
            .then((res) => setFeedbacks(res))
            .catch((error) => console.error('Failed to fetch feedbacks:', error));
    }, [dispatch]);

    return (
        <div className="bg-gray-50 min-h-screen py-2">
            <FeedbackList feedbacks={feedbacks} />
        </div>
    );
};

export default FeedbackPage;