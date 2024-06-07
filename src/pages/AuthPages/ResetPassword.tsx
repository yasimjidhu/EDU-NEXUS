import React from 'react';
import Navbar from '../../components/authentication/Navbar';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import { getResetPasswordSchema } from '../../utils/validation';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { resetPassword } from '../../components/redux/slices/authSlice';
import { RootState } from '../../components/redux/store/store';

const ResetPassword: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const email = useSelector((state:RootState)=>state.auth.user?.email)

    type AppDispatch = ThunkDispatch<any, any, any>;

    const initialValues = {
        newPassword: '',
        confirmNewPassword: '',
    };

    const validationSchema = getResetPasswordSchema();

    const handleSubmit = async (values: { newPassword: string; confirmNewPassword: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        setSubmitting(true);
        try {
            const { newPassword, confirmNewPassword } = values;
            if (newPassword !== confirmNewPassword) {
                toast.warning('Both passwords do not match');
                setSubmitting(false);
                return;
            }
            const response: any = await (dispatch as AppDispatch)(resetPassword({newPassword,email}));
            if (response.error) {
                throw new Error(response.error.message);
            }
            console.log('response data in reset password',response)
            toast.success('Password reset successfully')
            navigate('/home');
        } catch (error: any) {
            toast.error(error.message);
            console.log('reset password encountered an error', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className='grid grid-cols-2 px-10 justify-center items-center'>
                <div className='w-full'>
                    <img src='/assets/images/reset-pass-img.png' width='80%' alt='' />
                </div>
                <div className='bg-gray-200 px-16 py-16 rounded-3xl'>
                    <h2 className='text-3xl font-mono'>Reset Password</h2>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ isSubmitting }) => (
                            <Form className='mt-10'>
                                <div className='mb-4'>
                                    <label htmlFor='newPassword' className='block w-full'>
                                        New Password
                                    </label>
                                    <Field
                                        type='password'
                                        id='newPassword'
                                        name='newPassword'
                                        className='Login-input w-full py-2 rounded-md border pl-2 text-lg focus:outline-none'
                                    />
                                    <ErrorMessage
                                        name='newPassword'
                                        id='newPassword'
                                        component='div'
                                        className='text-red-600 mt-1 text-sm'
                                    />
                                </div>
                                <div className='mb-4'>
                                    <label htmlFor='confirmNewPassword' className='block w-full'>
                                        Confirm New Password
                                    </label>
                                    <Field
                                        type='password'
                                        id='confirmNewPassword'
                                        name='confirmNewPassword'
                                        className='Login-input w-full py-2 rounded-md border pl-2 text-lg focus:outline-none'
                                    />
                                    <ErrorMessage
                                        name='confirmNewPassword'
                                        component='div'
                                        className='text-red-600 mt-1 text-sm'
                                    />
                                </div>
                                <button
                                    type='submit'
                                    className='bg-strong-rose w-full py-2 text-xl text-white rounded-md'
                                    disabled={isSubmitting}
                                >
                                    Reset
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
