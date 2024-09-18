import React from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';


const AboutUs = () => {
    useDocumentTitle('About-us')
    return (
        <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto p-8 bg-white shadow-lg rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex justify-center items-center">
                        <img 
                            src='/assets/images/learning.png' 
                            alt="About Edu-Nexus" 
                            className="rounded-lg shadow-md w-full max-w-md transition-transform duration-300 hover:scale-105" 
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to Edu-Nexus</h1>
                        <p className="text-lg text-gray-700 mb-4">
                            At Edu-Nexus, we believe in the transformative power of education. Our mission is to make quality learning accessible to everyone, regardless of their location or background. We provide a platform where knowledge meets opportunity, allowing instructors to share their expertise while empowering students to achieve their educational goals.
                        </p>
                    </div>
                </div>

                <div className="mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-3xl font-semibold text-gray-900 mb-4">For Instructors</h2>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="mr-2 text-blue-600">✓</span>
                                    <p><strong>Create and Upload Courses:</strong> Design and publish courses in your area of expertise, reaching a global audience eager to learn.</p>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-blue-600">✓</span>
                                    <p><strong>Earn Money:</strong> Benefit from a revenue-sharing model that rewards you for your contributions, allowing you to turn your passion for teaching into a sustainable income.</p>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-blue-600">✓</span>
                                    <p><strong>Engage with Students:</strong> Foster a community of learners by interacting with students through discussions, feedback, and personalized guidance.</p>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-3xl font-semibold text-gray-900 mb-4">For Students</h2>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="mr-2 text-blue-600">✓</span>
                                    <p><strong>Enroll in Courses:</strong> Choose from a wide variety of subjects and skill levels. Whether you're looking to advance your career or explore a new hobby, there's something for everyone.</p>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-blue-600">✓</span>
                                    <p><strong>Learn at Your Own Pace:</strong> Enjoy the flexibility of online learning. Access course materials anytime, anywhere, and progress at a speed that suits you.</p>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-blue-600">✓</span>
                                    <p><strong>Connect with Instructors:</strong> Benefit from direct interaction with experienced educators who are dedicated to your success.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-4">Why Choose Edu-Nexus?</h2>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Edu-Nexus stands out as a unique e-learning platform because we prioritize community and collaboration. Our user-friendly interface, comprehensive resources, and supportive environment ensure that both instructors and students can thrive.
                    </p>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-4">Join Us</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Join us at Edu-Nexus, where learning knows no bounds, and every course is a step towards a brighter future. Together, let's build a nexus of knowledge that empowers individuals and transforms lives.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
