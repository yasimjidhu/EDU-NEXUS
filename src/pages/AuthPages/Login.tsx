
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { ThunkDispatch } from "@reduxjs/toolkit";
import Navbar from "../../components/authentication/Navbar";
import { getLoginValidationSchema } from "../../utils/validation";
import { userLogin } from "../../components/redux/slices/authSlice";
import { toast } from "react-toastify";
import GoogleSignInButton from "../../components/authentication/GoogleSigninButton";
import { RootState } from "../../components/redux/store/store";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  type AppDispatch = ThunkDispatch<any, any, any>;

  const {loading,error} = useSelector((state:RootState)=>state.auth)

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = getLoginValidationSchema();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);

    try {
      const { email, password } = values;
      const response: any = await (dispatch as AppDispatch)(
        userLogin({ email, password })
      );
      console.log(response)
      if (response.payload && response.payload.error) {
        throw new Error(response.payload.error);
      }
      navigate("/home");
    } catch (error:any) {
      toast.error(error.message || 'An unexpected error occurred');
      console.error("Login failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

React.useEffect(()=>{
  if(error){
    toast.error(error)
  }
},[])


  return (
    <>
      <Navbar />
      <div className=" flex justify-around">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4 w-[90%]">
            <div className="p-8">
              <img
                src="/public/assets/images/login-img.png"
                width="100%"
                alt=""
              />
            </div>
            <div className="bg-gray-200 px-16 py-16 rounded-3xl">
              <h2 className="text-3xl font-sans">Login</h2>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="mt-10">
                    <div className="mb-4">
                      <label htmlFor="email" className="block w-full">
                        Email
                      </label>
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        className="Login-input w-full py-2 rounded-md border pl-2  text-lg focus:outline-none "
                      />
                      <ErrorMessage
                        name="email"
                        id="email"
                        component="div"
                        className="text-red-600 mt-1 text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="password" className="block w-full">
                        Password
                      </label>
                      <Field
                        type="password"
                        id="password"
                        name="password"
                        className="Login-input w-full py-2 rounded-md border pl-2  text-lg focus:outline-none "
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-600 mt-1 text-sm "
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-strong-rose w-full py-2 text-xl text-white rounded-md "
                    >
                      Login
                    </button>
                  </Form>
                )}
              </Formik>
              <div className="mt-3">
                <GoogleSignInButton message="Login" />
              </div>
              <Link to='/forgot-password'><h4
                className="text-center text-violet-950 font-semibold mt-4 cursor-pointer"
              >
                Forgot Password
              </h4></Link>
              <h5 className="text-center mt-4">
                don't have an account ?{" "}
                <Link to="/">
                  <span className="text-violet-900 font-semibold">
                    {" "}
                    Signup{" "}
                  </span>
                </Link>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
