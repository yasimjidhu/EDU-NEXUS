import React from 'react'
import {Formik,Form,Field,ErrorMessage} from 'formik'
import * as Yup from 'yup'


interface FormValues{
    username?:string
    email:string
    password:string
}

//validation schema function for signup
const getSignupValidationSchema = ()=>{
    return Yup.object({
        username:Yup.string().required('Username is required'),
        email:Yup.string().email('Invalid email address').required('Email is required'),
        password:Yup.string().required('Password is required'),
    })
}

//validation shcema function for login
const getLoginValidationSchema=()=>{
    return Yup.object({
        email:Yup.string().email('Invalid email address').required('Email is required'),
        password:Yup.string().required('password is required')
    })
}

export {
    getSignupValidationSchema,
    getLoginValidationSchema
}