import * as Yup  from 'yup'


interface FormValues {
    firstName:string
    lastName:string
    phone:string
    address:string
    email:string
    dob:string
}

const registrationFormSchema = ()=>{
    return Yup.object({
    firstName:Yup.string()
        .typeError('First Name must be string')
        .required('First Name is required'),
    lastName:Yup.string()
        .typeError('Last Name must be string')
        .required('Last Name is required'),
    phone:Yup.string().required('Phone number is required'),
    address:Yup.string().required('Address is Required'),
    dob:Yup.string()
            .required('Date of Birth is required')
    })
}

export {
    registrationFormSchema
}