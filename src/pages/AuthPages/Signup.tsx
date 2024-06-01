import Navbar from "../../components/authentication/Navbar";
import React from "react";
import {  Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { signupUser } from "../../components/redux/slices/authSlice";
import { RootState } from "../../components/redux/store/store";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import {  getSignupValidationSchema } from "../../utils/validation";
import { ErrorMessage, Field, Formik ,Form} from "formik";



const SignupPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  type AppDispatch = ThunkDispatch<any, any, any>;
  const { username, email, password } = useSelector(
    (state: RootState) => state?.auth
  );

  // const [formData, setFormData] = useState({
  //   username: "",
  //   email: "",
  //   password: "",
  //   confirmPassword: "",
  // });

  const initialValues = {
    username:'',
    email:'',
    password:'',
    confirmPassword:''
  }

  // const [errorMessage, setErrorMessage] = useState("");
  // const [isLoading, isSetLoading] = useState(false);


  const validationSchema = getSignupValidationSchema()

  const handleSubmit = async (values:any,{setSubmitting}:any) => {
    setSubmitting(true)

    try {

      const { username, email, password } = values
      const response: any = await (dispatch as AppDispatch)(
        signupUser({ username, email, password })
      );

      if (response.error) {
        throw new Error(response.error.message);
      }

      navigate("/verify-otp");
    } catch (error) {
      console.error("Signup failed:", error);
    }finally{
      setSubmitting(false)
    }
  };



  return (
    <>
      <Navbar />
      <div className=" flex justify-around">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gray-200 p-20 rounded-3xl">
              <h2 className="text-2xl font-sans">Signup</h2>
              <Formik 
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
                {({isSubmitting})=>(
                  <Form>
                  <div className="mb-4 mt-10">
                    <label htmlFor="username" className="block w-full">Username</label>
                    <Field type="text" id="username" name="username" className="signup-input w-full py-2 rounded-md border pl-2  text-lg focus:outline-none"/>
                    <ErrorMessage name="username" component="div" className="text-red-600"/>
                    {/* <input
                      type="text"
                      id="username"
                      name="username"
                      // value={formData.username}
                      onChange={handleChange}
                      className="signup-input w-full py-2 rounded-md border pl-2  text-lg focus:outline-none "
                    /> */}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block w-full">
                      Email
                    </label>
                    <Field type="email" id="email" name="email" className="signup-input w-full py-2 rounded-md border pl-2 text-lg focus:outline-none" />
                    <ErrorMessage name="email" component="div" className="text-red-600" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="block w-full">
                      Password
                    </label>
                    <Field type="password" id="password" name="password" className="signup-input w-full py-2 rounded-md border pl-2 text-lg focus:outline-none" />
                    <ErrorMessage name="password" component="div" className="text-red-600" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block w-full">
                      Confirm Password
                    </label>
                    <Field type="password" id="confirmPassword" name="confirmPassword" className="signup-input w-full py-2 rounded-md border pl-2 text-lg focus:outline-none" />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-600" />
                  </div>
                  {isSubmitting ? (
                    <button
                      type="submit"
                      className="bg-prime-blue w-full py-3 text-xl text-white rounded-md "
                    >
                      <BeatLoader className="mr-4 text-center mx-auto" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-prime-blue w-full py-3 text-xl text-white rounded-md "
                    >
                      Signup
                    </button>
                  )}
                </Form>
                )}
              </Formik>
              
              <h4 className="text-center mt-5 text-violet-950 font-semibold">
                Forgot Password
              </h4>

              <h5 className="text-center ">
                I have an account ?{" "}
                <Link to="/login">
                  <span className="text-violet-900 font-semibold"> Login </span>
                </Link>{" "}
              </h5>
            </div>
            <div className="p-4">
              <img src="/public/assets/images/signup.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
