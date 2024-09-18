import { AppDispatch, RootState } from '../../components/redux/store/store';
import { submitFeedback } from '../../components/redux/slices/studentSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FeedbackEntity } from '../../types/feedback';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';


const ContactUs: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.user);

    useDocumentTitle('Contact-Us')
    const [formData, setFormData] = useState<FeedbackEntity>({
        name: '',
        email: '',
        subject: '',
        message: '',
        userId: user?._id || '',
        image: user?.profile?.avatar || '',
        createdAt: new Date()
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            setFormData(prevData => ({
                ...prevData,
                createdAt: new Date(),
                image: user.profile?.avatar || ''
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        try {
            const response: any = await dispatch(submitFeedback(formData)).unwrap();
            console.log('Response of submit feedback in frontend:', response);
            toast.success('Feedback submitted successfully');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                userId: user._id || '',
                image: user.profile?.avatar || '',
                createdAt: new Date()
            });
            setErrors({});
        } catch (error: any) {
            const errorMessages = error.response?.data?.errors || {};
            setErrors(errorMessages);
            toast.error('Failed to submit feedback');
        }
    };


    return (
        <div className="bg-gray-50 py-2">
            <div className="max-w-7xl mx-auto p-6 md:p-8 bg-white shadow-lg rounded-lg">
                {/* <div className="text-center mb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900">Contact Us</h1>
                </div> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Contact Form */}
                    <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Us a Message</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Your Name"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Your Email"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-gray-700">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Subject"
                                />
                                {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-gray-700">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={3}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Your Message"
                                ></textarea>
                                {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-medium-rose text-white py-3 rounded-lg shadow-md hover:bg-strong-rose "
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="flex flex-col items-center justify-start w-full">
                        <div>
                            <img
                                src="/assets/png/contact.png"
                                alt="Contact Us"
                                className="mb-6 md:w-full h-auto "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
