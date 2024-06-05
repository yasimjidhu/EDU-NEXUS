import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

interface FormValues {
    username?: string
    email: string
    password: string
}

// Validation schema function for signup
const getSignupValidationSchema = () => {
    return Yup.object({
        username: Yup.string().required('Username is required'),
        email: Yup.string()
            .email('Invalid email address')
            .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a valid @gmail.com address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
    })
}

// Validation schema function for login
const getLoginValidationSchema = () => {
    return Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a valid @gmail.com address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
    })
}

const getForgotPasswordSchema = ()=>{
    return Yup.object({
        email:Yup.string()
        .email('Invalid Email address')
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a valid @gmail.com address')
        .required('Email is required')
    })
}

export {
    getSignupValidationSchema,
    getLoginValidationSchema,
    getForgotPasswordSchema
}
